import {
  ChildRenderers,
  ImgRenderData,
  RendererType,
  ShapeRenderData,
  TextRenderData,
} from "../../types";
import type { ContainerRenderData, LayerBounds } from "../../types";
import type { CanvasRenderingContext2D, CanvasEngine } from "../../engine/types";
import { cloneDeep, isNumber, isObject, isUndefined } from "lodash-es";
import { BaseRender } from "../base-renderer";
import { ImgRender } from "../img-renderer/index";
import { TextRender } from "../text-renderer/index";
import { ShapeRender } from "../shape-render/index";

export type { ContainerRenderData } from "../../types";

type LayoutedLayer =
  | ImgRender
  | TextRender
  | ShapeRender
  | ContainerRenderer;

interface LineState {
  lineStartX: number;
  lineStartY: number;
  lineBottom: number;
  lineRight: number;
  lineIndex: number;
}

export class ContainerRenderer extends BaseRender<ContainerRenderData> {
  private ctx: CanvasRenderingContext2D;
  private engine: CanvasEngine;
  public data: ContainerRenderData;
  private layers: LayoutedLayer[] = [];

  constructor(ctx: CanvasRenderingContext2D, engine: CanvasEngine, data: ContainerRenderData) {
    super();
    this.ctx = ctx;
    this.engine = engine;
    this.data = cloneDeep(data);
    // Set quality properties if available (node-canvas specific)
    if ("patternQuality" in this.ctx) {
      (this.ctx as any).patternQuality = "best";
    }
    if ("quality" in this.ctx) {
      (this.ctx as any).quality = "best";
    }
  }

  get container() {
    return this.getContainerCoordinates();
  }

  /** Recursively collect bounds for all layers (including nested). */
  collectLayerBounds(prefixPath: number[]): LayerBounds[] {
    const result: LayerBounds[] = [];
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      const path = [...prefixPath, i];
      const bounds = layer.container;
      const type = layer.getLayerType();
      const id = layer.getId();
      result.push({ id, type, bounds: { ...bounds }, path });
      if (type === "container" && "collectLayerBounds" in layer) {
        result.push(...(layer as ContainerRenderer).collectLayerBounds(path));
      }
    }
    return result;
  }

  private createLayer = (
    layerData:
      | ImgRenderData
      | TextRenderData
      | ShapeRenderData
      | ContainerRenderData,
  ) => {
    switch (layerData.type) {
      case RendererType.TEXT: {
        return new TextRender(this.ctx, this.engine, layerData, {
          inFlexFlow: isUndefined(layerData.x) || isUndefined(layerData.y),
        });
      }
      case RendererType.IMG:
        return new ImgRender(this.ctx, this.engine, layerData);
      case RendererType.SHAPE:
        return new ShapeRender(this.ctx, layerData);
      case RendererType.CONTAINER:
        return new ContainerRenderer(this.ctx, this.engine, layerData);
      default:
        throw new Error("[Renderer] unknown layer type");
    }
  };

  private getGapX(): number {
    if (!this.data.gap) return 0;
    return isObject(this.data.gap) ? this.data.gap.x : this.data.gap;
  }

  private getGapY(): number {
    if (!this.data.gap) return 0;
    return isObject(this.data.gap) ? this.data.gap.y : this.data.gap;
  }

  private resolvePosition(
    index: number,
    layerData: { x?: number; y?: number },
    layouted: { layer: LayoutedLayer; lineIndex: number }[],
    lineState: LineState,
  ): { layerX: number; layerY: number; lineIndex: number } {
    const containerRight = this.data.x + this.data.width;
    const containerBottom = this.data.y + this.data.height;
    let layerX: number;
    let layerY: number;
    if (index === 0) {
      layerX = isNumber(layerData.x) ? layerData.x + this.data.x : this.data.x;
      layerY = isNumber(layerData.y) ? layerData.y + this.data.y : this.data.y;
      return { layerX, layerY, lineIndex: 0 };
    }
    let candidateX: number;
    let candidateY: number;
    const prev = layouted[index - 1].layer;
    const { x1, x2, y1, y2 } = prev.container;
    const gapX = this.getGapX();
    const gapY = this.getGapY();
    const dir = this.data.direction ?? "row";
    if (dir === "column") {
      candidateX = x1;
      candidateY = y2 + gapY;
      if (this.data.wrap && candidateY > containerBottom) {
        candidateX = lineState.lineRight + gapX;
        candidateY = this.data.y;
        lineState.lineStartX = candidateX;
        lineState.lineStartY = this.data.y;
        lineState.lineIndex += 1;
      }
    } else {
      candidateX = x2 + gapX;
      candidateY = y1;
      if (this.data.wrap && candidateX > containerRight) {
        candidateX = this.data.x;
        candidateY = lineState.lineBottom + gapY;
        lineState.lineStartX = this.data.x;
        lineState.lineStartY = candidateY;
        lineState.lineIndex += 1;
      }
    }
    layerX = isNumber(layerData.x) ? layerData.x + this.data.x : candidateX;
    layerY = isNumber(layerData.y) ? layerData.y + this.data.y : candidateY;
    return { layerX, layerY, lineIndex: lineState.lineIndex };
  }

  private updateLineStateAfterPlace(
    lineState: LineState,
    layer: LayoutedLayer,
  ): void {
    const { x2, y2 } = layer.container;
    lineState.lineRight = Math.max(lineState.lineRight, x2);
    lineState.lineBottom = Math.max(lineState.lineBottom, y2);
  }

  private applyItemAlignByLine(
    layoutedWithLineIndex: { layer: LayoutedLayer; lineIndex: number }[],
  ): void {
    if (this.data.itemAlign !== "center") return;
    const byLine = new Map<number, LayoutedLayer[]>();
    for (const { layer, lineIndex } of layoutedWithLineIndex) {
      const list = byLine.get(lineIndex) ?? [];
      list.push(layer);
      byLine.set(lineIndex, list);
    }
    const dir = this.data.direction ?? "row";
    for (const layers of byLine.values()) {
      const squares = layers.map((r) => {
        const { x1, x2, y1, y2 } = r.container;
        return {
          width: x2 - x1,
          height: y2 - y1,
          x1,
          y1,
          layer: r,
        };
      });
      const maxWidth = Math.max(...squares.map((s) => s.width));
      const maxHeight = Math.max(...squares.map((s) => s.height));
      for (const s of squares) {
        if (dir === "column") {
          const offset = (maxWidth - s.width) / 2;
          s.layer.setPosition(s.x1 + offset, s.y1);
        } else {
          const offset = (maxHeight - s.height) / 2;
          s.layer.setPosition(s.x1, s.y1 + offset);
        }
      }
    }
  }

  private applyContainerAlignment(layoutedLayers: LayoutedLayer[]): void {
    if (!layoutedLayers.length) return;
    let x1 = Infinity;
    let y1 = Infinity;
    let x2 = -Infinity;
    let y2 = -Infinity;
    for (const layer of layoutedLayers) {
      const c = layer.container;
      x1 = Math.min(x1, c.x1);
      y1 = Math.min(y1, c.y1);
      x2 = Math.max(x2, c.x2);
      y2 = Math.max(y2, c.y2);
    }
    const blockWidth = x2 - x1;
    const blockHeight = y2 - y1;
    const cx = this.data.x;
    const cy = this.data.y;
    const cw = this.data.width;
    const ch = this.data.height;
    const align = this.data.align ?? "left";
    const justify = this.data.justify ?? "top";
    let dx = 0;
    let dy = 0;
    if (align === "center") dx = cx + (cw - blockWidth) / 2 - x1;
    else if (align === "right") dx = cx + cw - blockWidth - x1;
    else dx = cx - x1;
    if (justify === "center") dy = cy + (ch - blockHeight) / 2 - y1;
    else if (justify === "bottom") dy = cy + ch - blockHeight - y1;
    else dy = cy - y1;
    for (const layer of layoutedLayers) {
      const { x1, y1 } = layer.container;
      layer.setPosition(x1 + dx, y1 + dy);
    }
  }

  public layout = async () => {
    const layoutedWithLineIndex: {
      layer: LayoutedLayer;
      lineIndex: number;
    }[] = [];
    const lineState: LineState = {
      lineStartX: this.data.x,
      lineStartY: this.data.y,
      lineBottom: this.data.y,
      lineRight: this.data.x,
      lineIndex: 0,
    };
    const containerRight = this.data.x + this.data.width;
    const containerBottom = this.data.y + this.data.height;

    for (let index = 0; index < this.data.layers.length; index++) {
      const layerData = cloneDeep(this.data.layers[index]) as
        | ImgRenderData
        | TextRenderData
        | ShapeRenderData
        | ContainerRenderData;

      const { layerX, layerY, lineIndex } = this.resolvePosition(
        index,
        layerData,
        layoutedWithLineIndex,
        lineState,
      );

      const maxWidth = Math.max(0, containerRight - layerX);
      const maxHeight = Math.max(0, containerBottom - layerY);
      let clampedData = layerData;
      if (isNumber(layerData.width) && layerData.width > maxWidth) {
        clampedData = { ...layerData, width: maxWidth };
      }
      if (isNumber(layerData.height) && layerData.height > maxHeight) {
        clampedData = { ...clampedData, height: maxHeight };
      }

      const currentLayer = this.createLayer({
        ...clampedData,
        x: layerX,
        y: layerY,
      }) as LayoutedLayer;

      await currentLayer.layout();

      this.updateLineStateAfterPlace(lineState, currentLayer);
      layoutedWithLineIndex.push({ layer: currentLayer, lineIndex });
    }

    const layoutedLayers = layoutedWithLineIndex.map((e) => e.layer);
    this.applyItemAlignByLine(layoutedWithLineIndex);
    this.applyContainerAlignment(layoutedLayers);

    this.layers = layoutedLayers;
    return this;
  };

  // TODO rotate the whole layer
  public draw = async () => {
    if (!this.layers.length) {
      return this;
    }

    const pickedOne = this.layers.shift()!;
    await pickedOne.draw();

    await this.draw();

    return this;
  };

  private getContainerCoordinates = () => {
    if (!this.layers.length)
      throw new Error("can not get container coordinates before layouted");
    let x1 = Infinity;
    let y1 = Infinity;
    let x2 = -Infinity;
    let y2 = -Infinity;
    for (const layer of this.layers) {
      const c = layer.container;
      x1 = Math.min(x1, c.x1);
      y1 = Math.min(y1, c.y1);
      x2 = Math.max(x2, c.x2);
      y2 = Math.max(y2, c.y2);
    }
    return { x1, y1, x2, y2 };
  };
}
