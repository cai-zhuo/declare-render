import { RenderData, RendererType } from "./types";
import { ContainerRenderer } from "./canvas-renderers/container-renderer/index";
import type { CanvasLike, CanvasEngine, CanvasRenderingContext2D } from "./engine/types";

export type {
  ContainerRenderData,
  ImgRenderData,
  ShapeRenderData,
  ShapeStyle,
  ShapeCommand,
  TextRenderData,
  RenderData,
} from "./types";
export { RendererType, RENDER_DATA_SCHEMA as RENDER_DATA_SCHEMA_FOR_AI } from "./types";
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

  draw = async () => {
    if (!this.schema.layers.length) {
      throw new Error("[Renderer] empty canvas with no layers");
    }
    
    // // Fill canvas with white background for visibility
    // this.ctx.fillStyle = "#FFFFFF";
    // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const container = new ContainerRenderer(this.ctx, this.engine, {
      id: this.schema.id,
      type: RendererType.CONTAINER,
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
      layers: this.schema.layers,
    });
    await container.layout().then((d) => d.draw());
    return this.toBuffer();
  };

  private async toBuffer(): Promise<Buffer | Blob> {
    const type = this.schema.output?.type || "png";
    return this.engine.toBuffer(this.canvas, type);
  }
}
