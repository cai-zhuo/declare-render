import { RenderData, RendererType } from "./types";
import type { LayerBounds } from "./types";
import type { CanvasLike, CanvasEngine, CanvasRenderingContext2D } from "./engine/types";
import { normalizeSchema } from "./utils/normalize-schema";
import { ImgRender } from "./canvas-renderers/img-renderer/index";
import { TextRender } from "./canvas-renderers/text-renderer/index";
import { ShapeRender } from "./canvas-renderers/shape-render/index";

export type {
  ChildRenderers,
  ImgRenderData,
  ShapeRenderData,
  ShapeStyle,
  ShapeCommand,
  TextRenderData,
  RenderData,
  LayerBounds,
} from "./types";
export { RendererType, RENDER_DATA_SCHEMA as RENDER_DATA_SCHEMA_FOR_AI } from "./types";
export { getEditablePoints, updateShapePoint } from "./utils/shape-points";
export type { EditablePoint } from "./utils/shape-points";
export type { CanvasEngine } from "./engine/types";

export class Renderer {
  canvas: CanvasLike;
  schema: RenderData;
  ctx: CanvasRenderingContext2D;
  private engine: CanvasEngine;

  constructor(schema: RenderData, engine: CanvasEngine) {
    // Normalize schema to handle multiple input formats
    const normalizedSchema = normalizeSchema(schema);
    const { width, height } = normalizedSchema;
    this.schema = normalizedSchema;
    this.engine = engine;
    this.canvas = this.engine.createCanvas(width, height);
    this.ctx = this.engine.getContext(this.canvas);
    
    if ("patternQuality" in this.ctx) {
      (this.ctx as any).patternQuality = "best";
    }
    if ("quality" in this.ctx) {
      (this.ctx as any).quality = "best";
    }
  }

  private createLayer(layerData: any) {
    switch (layerData.type) {
      case RendererType.TEXT:
        return new TextRender(this.ctx, this.engine, layerData);
      case RendererType.IMG:
        return new ImgRender(this.ctx, this.engine, layerData);
      case RendererType.SHAPE:
        return new ShapeRender(this.ctx, layerData);
      default:
        throw new Error("[Renderer] unknown layer type");
    }
  }

  /**
   * Run layout (no draw) and return layer bounds for hit testing.
   * Caller must ensure canvas dimensions match schema before calling.
   */
  layoutAndGetLayerBounds = async (): Promise<LayerBounds[]> => {
    if (!this.schema.layers.length) {
      return [];
    }
    const bounds: LayerBounds[] = [];
    for (let i = 0; i < this.schema.layers.length; i++) {
      const layerData = this.schema.layers[i];
      const layer = this.createLayer(layerData);
      await layer.layout();
      bounds.push({
        id: layer.getId(),
        type: layer.getLayerType() as "text" | "img" | "shape",
        bounds: { ...layer.container },
        path: [i],
      });
    }
    return bounds;
  };

  /**
   * Render to the internal canvas. Does not convert to buffer.
   * Returns this for chaining (e.g. to call getCanvasElement).
   */
  render = async (): Promise<this> => {
    if (!this.schema.layers.length) {
      throw new Error("[Renderer] empty canvas with no layers");
    }
    
    for (const layerData of this.schema.layers) {
      const layer = this.createLayer(layerData);
      await layer.layout();
      await layer.draw();
    }
    
    return this;
  };

  draw = async () => {
    await this.render();
    return this.toBuffer();
  };

  /**
   * Return the canvas as HTMLCanvasElement when running in browser.
   * Returns null in Node.js.
   */
  getCanvasElement(): HTMLCanvasElement | null {
    if (typeof document !== "undefined" && this.canvas && "nodeName" in this.canvas) {
      return this.canvas as HTMLCanvasElement;
    }
    return null;
  }

  private async toBuffer(): Promise<Buffer | Blob> {
    const type = this.schema.output?.type || "png";
    return this.engine.toBuffer(this.canvas, type);
  }
}
