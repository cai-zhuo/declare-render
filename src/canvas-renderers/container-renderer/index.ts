import {
  ChildRenderers,
  ImgRenderData,
  RendererType,
  ShapeRenderData,
  TextRenderData,
} from "../../types";
import type { ContainerRenderData } from "../../types";
import type { CanvasRenderingContext2D, CanvasEngine } from "../../engine/types";
import { cloneDeep, isNumber, isObject, isUndefined } from "lodash-es";
import { BaseRender } from "../base-renderer";
import { ImgRender } from "../img-renderer/index";
import { TextRender } from "../text-renderer/index";
import { ShapeRender } from "../shape-render/index";

export type { ContainerRenderData } from "../../types";

export class ContainerRenderer extends BaseRender<ContainerRenderData> {
  private ctx: CanvasRenderingContext2D;
  private engine: CanvasEngine;
  private layers: Array<
    ImgRender | TextRender | ShapeRender | ContainerRenderer
  > = [];

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

  // TODO center the layers, vertical center, left align, wrap the layers;
  public layout = async () => {
    const layoutedLayers = [] as Array<
      ImgRender | TextRender | ShapeRender | ContainerRenderer
    >;

    for (const index in this.data.layers) {
      const layerData = cloneDeep(this.data.layers[index]) as
        | ImgRenderData
        | TextRenderData
        | ShapeRenderData
        | ContainerRenderData;

      let layerX = layerData.x;
      let layerY = layerData.y;
      // 子 layer 的 x、y 相对容器的 x、y 进行定位
      if (isNumber(layerX)) {
        layerX += this.data.x;
      }

      if (isNumber(layerY)) {
        layerY += this.data.y;
      }

      // justify
      if (isUndefined(layerX) || isUndefined(layerY)) {
        const preLayer = layoutedLayers.at(-1) as
          | undefined
          | ImgRender
          | TextRender
          | ShapeRender
          | ContainerRenderer;
        const { x2, y1, x1, y2 } = preLayer?.container || {
          x1: this.data.x,
          x2: this.data.x,
          y1: this.data.y,
          y2: this.data.y,
        };

        const gapX = !preLayer
          ? 0
          : isObject(this.data.gap)
            ? this.data.gap.x
            : this.data.gap || 0;

        const gapY = !preLayer
          ? 0
          : isObject(this.data.gap)
            ? this.data.gap.y
            : this.data.gap || 0;

        if (this.data.direction === "column") {
          layerX = layerX || x1;
          layerY = layerY || y2 + gapY;
        } else {
          layerX = layerX || x2 + gapX;
          layerY = layerY || y1;
        }
      }

      const currentLayer = this.createLayer({
        ...layerData,
        x: layerX,
        y: layerY,
      });

      await currentLayer.layout();

      layoutedLayers.push(currentLayer);
    }

    // align items
    if (this.data.itemAlign === "center") {
      const squares = layoutedLayers.map((r) => {
        const { x1, x2, y1, y2 } = r.container;
        return { ...r.container, width: x2 - x1, height: y2 - y1, layer: r };
      });

      const maxWidth = Math.max(...squares.map((s) => s.width));
      const maxHeight = Math.max(...squares.map((s) => s.height));

      squares.forEach((s) => {
        if (this.data.direction === "column") {
          const offset = (maxWidth - s.width) / 2;
          s.layer.setPosition(s.x1 + offset, s.y1);
        } else {
          const offset = (maxHeight - s.height) / 2;
          s.layer.setPosition(s.x1, s.y1 + offset);
        }
      });
    }

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

  // TODO handle the layers wrapping, add gap;
  private getContainerCoordinates = () => {
    if (!this.layers.length)
      throw new Error("can not get container coordinates before layouted");
    const firstChild = this.layers.at(0) as
      | ImgRender
      | TextRender
      | ShapeRender;
    const lastChild = this.layers.at(-1) as
      | ImgRender
      | TextRender
      | ShapeRender;
    return {
      x1: firstChild.container.x1,
      y1: firstChild.container.y1,
      x2: lastChild.container.x2,
      y2: lastChild.container.y2,
    };
  };
}
