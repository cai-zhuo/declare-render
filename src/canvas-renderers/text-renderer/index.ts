import type {
  CanvasRenderingContext2D,
  CanvasEngine,
  ImageLike,
} from "../../engine/types";
import {
  cloneDeep,
  groupBy,
  isNumber,
  isObject,
  isUndefined,
  last,
  map,
  values,
} from "lodash-es";
import { BaseRender } from "../base-renderer";
import { TextRenderData, highlightLogics } from "./types";

import { MetricsCharWithCoordinates } from "../../types";
import { MetricsChar } from "../../types";
import { Highlighter, HighlightType } from "./highlighter";

const rightFlow =
  <T>(opts: any[]) =>
  () =>
    opts.reverse().reduce((ret, cur) => cur(ret), undefined) as T;

export class TextRender extends BaseRender<TextRenderData> {
  private ctx: CanvasRenderingContext2D;
  private engine: CanvasEngine;
  private highlighter: Highlighter;
  private lines: MetricsCharWithCoordinates[][] = [];
  private svg?: ImageLike;

  constructor(
    ctx: CanvasRenderingContext2D,
    engine: CanvasEngine,
    data: TextRenderData,
    options?: { inFlexFlow?: boolean },
  ) {
    super();
    this.ctx = ctx;
    this.engine = engine;
    this.data = cloneDeep(data);
    this.highlighter = new Highlighter(ctx);

    if (options?.inFlexFlow) {
      this.data.style.verticalAlign = undefined;
      this.data.style.align = undefined;
    }
  }

  get container() {
    if (!this.lines) {
      throw new Error("can not get container before layout in text renderer");
    }
    return this.getContainerCoordinates(this.lines);
  }

  public layout = async () => {
    const highlightSVGUrl = this.data.style.highlight?.style?.url;

    if (highlightSVGUrl) {
      const image = await this.engine.loadImage(highlightSVGUrl);
      this.svg = image;
    }

    const lines = rightFlow<MetricsCharWithCoordinates[][]>([
      this.coordinateLines,
      this.metricsLines,
      this.ensureFontStyles,
      this.parseFontSize,
    ])();

    this.lines = lines;
    return this;
  };

  public draw = () => {
    rightFlow<MetricsCharWithCoordinates[][]>([
      this.restoreRotatedCanvas,
      this.drawChars,
      () => this.drawBackground(this.lines),
      this.rotateCanvas,
      this.ensureFontStyles,
    ])();
    return this;
  };

  private restoreRotatedCanvas = () => {
    const { rotate } = this.data;
    if (rotate) {
      this.ctx.restore();
    }
  };

  private parseFontSize = () => {
    const fontSize = this.data.style.fontSize;

    if (isObject(fontSize)) {
      const fontObject = fontSize as { max: number; min: number };
      const count = this.data.content.length;
      const { horizonalGap = 0 } = this.data.style;
      const maxWidth = this.data.width;

      this.data.style.fontSize = Math.min(
        Math.max(
          (maxWidth - (count - 1) * horizonalGap) / count,
          fontObject.min,
        ),
        fontObject.max,
      );
    }
  };

  private rotateCanvas = () => {
    const { x, y, rotate, width, height } = this.data;

    if (rotate) {
      this.ctx.save();
      this.ctx.translate(x + width / 2, y + height / 2);
      this.ctx.rotate((rotate * Math.PI) / 180);
      this.ctx.translate(-(x + width / 2), -(y + height / 2));
    }
  };

  private ensureFontStyles = () => {
    const fontSize = this.data.style.fontSize;
    const fontName = this.data.style.fontName;
    const fontWeight = this.data.style.fontWeight || "";
    this.ctx.font = `${fontSize}px ${fontWeight} "${fontName}"`;
  };

  private metricsLines = () => {
    const containerWidth = this.data.width;
    const horizonalGap = this.data.style.horizonalGap || 0;
    const fontSize = this.data.style.fontSize;
    const oneLineMaxWidth = containerWidth;

    if (!isNumber(fontSize)) {
      throw new Error("[Renderer] field fontSize should be number type");
    }

    return this.data.content
      .split("")
      .map((char, index) => {
        const metrics = this.ctx.measureText(char) as MetricsChar["metrics"];
        const boundingHeight =
          (metrics.actualBoundingBoxAscent ?? 0) +
          (metrics.actualBoundingBoxDescent ?? 0);
        const emHeight = metrics.emHeightAscent + metrics.emHeightDescent;
        return { char, metrics, index, fontSize, boundingHeight, emHeight };
      })
      .reduce<MetricsChar[][]>(
        (lines, metricsChar) => {
          const lastLine = lines.at(-1)!;

          const curWidth = lastLine.reduce((sumWidth, cur, index) => {
            if (index !== 0 && index !== lastLine.length) {
              return cur.metrics.width + horizonalGap + sumWidth;
            }
            return cur.metrics.width + sumWidth;
          }, 0);
          if (curWidth + metricsChar.metrics.width > oneLineMaxWidth) {
            lines.push([metricsChar]);
          } else {
            lastLine.push(metricsChar);
          }
          return lines;
        },
        [[]],
      );
  };

  private drawChar = (c: MetricsCharWithCoordinates) => {
    this.ctx.fillStyle = this.data.style.color;
    this.ctx.fillText(c.char, c.X, c.Y);
    if (this.data.style.border) {
      this.ctx.save();

      this.ctx.lineWidth = this.data.style.border.width || 1;
      this.ctx.strokeStyle = this.data.style.border.color;
      this.ctx.strokeText(c.char, c.X, c.Y);

      this.ctx.restore();
    }
  };

  private coordinateLines = (lines: MetricsChar[][]) => {
    const {
      width: containerWidth,
      height: containerHeight,
      x: containerStartX,
      y: containerStartY,
    } = this.data;
    const { fontSize, verticalGap = 0, horizonalGap = 0 } = this.data.style;

    if (!isNumber(fontSize)) {
      throw new Error("[Renderer] field fontSize should be number type");
    }

    const boundingHeightsSum = lines
      .map((line) => Math.max(...line.map((c) => c.boundingHeight)))
      .reduce((ret, maxHeightAline) => ret + maxHeightAline, 0);
    const totalVerticalGap = (lines.length - 1) * verticalGap;

    const paddingY = (() => {
      switch (this.data.style.verticalAlign) {
        case "center":
          return (containerHeight - boundingHeightsSum - totalVerticalGap) / 2;
        case "bottom":
          return containerHeight - boundingHeightsSum - totalVerticalGap;
        case "top":
        default:
          return 0;
      }
    })();

    let preY = containerStartY + paddingY;

    return lines.map((mline, lineIndex) => {
      const currentLineWidth =
        mline.reduce((sum, mc) => sum + mc.metrics.width, 0) +
        (horizonalGap * mline.length - 1);

      const paddingLeft = (() => {
        switch (this.data.style.align) {
          case "center":
            return (containerWidth - currentLineWidth) / 2;
          case "right":
            return containerWidth - currentLineWidth;
          default:
            return 0;
        }
      })();

      let preX = containerStartX + paddingLeft;

      const maxHeightAline = Math.max(
        ...mline.map((c) => c.metrics.actualBoundingBoxAscent ?? 0),
      );

      let Y = (preY =
        preY + maxHeightAline + (lineIndex === 0 ? 0 : verticalGap));

      return mline.map((mseg, index) => {
        const _gap = index === 0 ? 0 : horizonalGap;

        const preWidth = mline[index - 1]?.metrics.width || 0;

        let X = (preX = preX + _gap + preWidth);

        return { ...mseg, X, Y };
      });
    });
  };

  private drawChars = (lines: MetricsCharWithCoordinates[][]) => {
    const { highlight } = this.data.style;
    if (!highlight || !highlight.type) {
      lines.flat().forEach(this.drawChar);
      return lines;
    }

    const highlightWord = highlightLogics.word;

    const startIndex = this.data.content.indexOf(highlightWord);

    const highlightChars = lines
      .map((line, lineIndex) => line.map((c) => ({ lineIndex, c })))
      .flat()
      .map(({ lineIndex, c }, cIndex) => ({ lineIndex, cIndex, c }))
      .slice(startIndex, startIndex + highlightWord.length)
      .map(({ c, cIndex, lineIndex }) => ({
        ...c,
        cIndex: cIndex,
        lineIndex: lineIndex,
      }));

    const highlightType = highlight.type;

    if (
      Highlighter.highlightByChar.includes(
        highlightType as (typeof Highlighter.highlightByChar)[number],
      )
    ) {
      const indexes = map(highlightChars, "cIndex");
      lines
        .flat()
        .filter((c) => indexes.includes(c.index))
        .forEach((c) => {
          if (!highlight.color)
            throw new Error(
              "color is required for highlight type:" + highlightType,
            );
          switch (highlightType) {
            case HighlightType.COLORED:
              this.highlighter.colorText(c, highlight.color);
              break;
            case HighlightType.HALF_RECTANGLE:
              this.highlighter.rectFill(c, highlight.color);
              break;
            case HighlightType.UNDERLINE:
              this.highlighter.underLine(c, highlight.color);
              break;
            default:
              throw new Error(
                `[Renderer] unknown highlight type with ${highlightType})`,
              );
          }
        });
      lines
        .flat()
        .filter((c) =>
          highlight && indexes.length ? !indexes.includes(c.index) : true,
        )
        .forEach(this.drawChar);
      return lines;
    }

    switch (highlight.type) {
      case HighlightType.SVG:
        values(groupBy(highlightChars, "lineIndex")).forEach((chars) => {
          if (!highlight.style)
            throw new Error("style field is required for highlight type: ");
          if (!this.svg)
            throw new Error(
              "svg url in highlight style is not correct: " + highlight.style,
            );
          this.highlighter.svg(chars, this.svg, highlight.style);
        });
        lines.flat().forEach(this.drawChar);
        break;
      default:
        break;
    }

    return lines;
  };

  private drawBackground = (lines: MetricsCharWithCoordinates[][]) => {
    if (!this.data.style.backgroundColor) return lines;
    const { x1, y1, x2, y2 } = this.getContainerCoordinates(lines);

    this.ctx.save();

    this.ctx.fillStyle = this.data.style.backgroundColor;

    this.ctx.beginPath();

    this.ctx.roundRect(x1, y1, x2 - x1, y2 - y1, this.data.style.radius || 0);

    this.ctx.fill();

    this.ctx.restore();

    return lines;
  };

  private getContainerCoordinates = (lines: MetricsCharWithCoordinates[][]) => {
    const { horizonalGap = 0, padding } = this.data.style;

    if (!lines) throw new Error("can not get text coordinates before layouted");

    const maxWidth = lines.reduce(
      (maxWidth, line) =>
        Math.max(
          maxWidth,
          line.reduce((sum, mc) => sum + mc.metrics.width, 0) +
            horizonalGap * (line.length - 1),
        ),
      0,
    );

    const startWord = lines[0][0];
    const endWord = last(last(lines))!;

    const actualPadding = isUndefined(padding)
      ? { x: 0, y: 0 }
      : isObject(padding)
        ? padding
        : { x: padding, y: padding };

    const firstLineTopest = Math.max(
      ...lines[0].map((c) => c.metrics.actualBoundingBoxAscent ?? 0),
    );

    const x1 = startWord.X - actualPadding.x;
    const y1 = startWord.Y - firstLineTopest - actualPadding.y;
    return {
      x1,
      y1,
      x2: x1 + maxWidth + actualPadding.x * 2,
      y2:
        endWord.Y +
        (endWord.metrics.actualBoundingBoxDescent ?? 0) +
        actualPadding.y,
    };
  };
}
