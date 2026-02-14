import { RenderData, RendererType } from "./types";
import type { LayerBounds } from "./types";
import { ContainerRenderer } from "./canvas-renderers/container-renderer/index";
import type { CanvasLike, CanvasEngine, CanvasRenderingContext2D } from "./engine/types";

export type {
  ChildRenderers,
  ContainerRenderData,
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
    const { width, height } = schema;
    this.schema = schema;
    this.engine = engine;
    this.canvas = this.engine.createCanvas(width, height);
    this.ctx = this.engine.getContext(this.canvas);
  }

  private createContainer(): ContainerRenderer {
    return new ContainerRenderer(this.ctx, this.engine, {
      id: this.schema.id,
      type: RendererType.CONTAINER,
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
      layers: this.schema.layers,
    });
  }

  /**
   * Run layout (no draw) and return layer bounds for hit testing.
   * Caller must ensure canvas dimensions match schema before calling.
   */
  layoutAndGetLayerBounds = async (): Promise<LayerBounds[]> => {
    if (!this.schema.layers.length) {
      return [];
    }
    const container = this.createContainer();
    await container.layout();
    return container.collectLayerBounds([]);
  };

  /**
   * Render to the internal canvas. Does not convert to buffer.
   * Returns this for chaining (e.g. to call getCanvasElement).
   */
  render = async (): Promise<this> => {
    if (!this.schema.layers.length) {
      throw new Error("[Renderer] empty canvas with no layers");
    }
    const container = this.createContainer();
    await container.layout().then((d) => d.draw());
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
