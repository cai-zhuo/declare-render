import type { CanvasRenderingContext2D } from "../../engine/types";
import type { ImageLike } from "../../engine/types";
import { MetricsCharWithCoordinates } from "../../types";
import { TextRenderData } from "./types";

export enum HighlightType {
  UNDERLINE = "underline",
  COLORED = "colored",
  HALF_RECTANGLE = "halfRectangle",
  SVG = "svg",
}

export class Highlighter {
  ctx: CanvasRenderingContext2D;
  static highlightByChar = [
    HighlightType.UNDERLINE,
    HighlightType.COLORED,
    HighlightType.HALF_RECTANGLE,
  ] as const;
  static highlightByWord = [HighlightType.SVG] as const;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  svg(
    word: MetricsCharWithCoordinates[],
    svgImage: ImageLike,
    style: NonNullable<TextRenderData["style"]["highlight"]>["style"],
  ) {
    const width = word.reduce((sum, c) => sum + c.metrics.width, 0);
    const startY = style?.coverText
      ? word[0].Y - word[0].boundingHeight
      : word[0].Y;
    const height = style?.coverText ? word[0].boundingHeight : style?.height;
    this.ctx.drawImage(
      svgImage as CanvasImageSource,
      word[0].X,
      startY + (style?.offsetY || 0),
      width,
      height || word[0].boundingHeight,
    );
  }

  colorText = (c: MetricsCharWithCoordinates, color: string) => {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.fillText(c.char, c.X, c.Y);
    this.ctx.restore();
  };

  rectFill = (c: MetricsCharWithCoordinates, color: string) => {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      c.X,
      c.Y - Math.abs(c.metrics.alphabeticBaseline) - 4,
      c.metrics.width,
      c.emHeight / 3,
    );
    this.ctx.restore();
    this.ctx.fillText(c.char, c.X, c.Y);
  };

  underLine = (c: MetricsCharWithCoordinates, color: string) => {
    const x = c.X;
    const y = c.Y;
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 8;
    this.ctx.moveTo(x, y + (c.metrics.actualBoundingBoxDescent ?? 0));
    this.ctx.lineTo(
      x + c.metrics.width,
      y + (c.metrics.actualBoundingBoxDescent ?? 0),
    );
    this.ctx.stroke();
    this.ctx.fillText(c.char, c.X, c.Y);
  };
}
