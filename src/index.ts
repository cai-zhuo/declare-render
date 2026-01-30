import { Canvas, createCanvas, type CanvasRenderingContext2D } from "canvas";
import { RenderData, RendererType } from "./types";
import { ContainerRenderer } from "./canvas-renderers/container-renderer/index";

export class Renderer {
  canvas: Canvas;
  schema: RenderData;
  ctx: CanvasRenderingContext2D;

  constructor(schema: RenderData) {
    const { width, height } = schema;
    this.schema = schema;
    this.canvas = createCanvas(width, height);
    this.ctx = this.canvas.getContext("2d");
  }

  draw = async () => {
    if (!this.schema.renderers.length) {
      throw new Error("[Renderer] empty canvas with no renderers");
    }
    const container = new ContainerRenderer(this.ctx, {
      id: this.schema.id,
      type: RendererType.CONTAINER,
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
      renderers: this.schema.renderers,
    });
    await container.layout().then((d) => d.draw());
    return this.toBuffer();
  };

  private toBuffer() {
    const type = this.schema.output?.type || "png";
    switch (type) {
      case "jpg":
        // @ts-ignore
        return this.canvas.toBuffer("image/jpeg", { alpha: true });
      case "png":
        // @ts-ignore
        return this.canvas.toBuffer("image/png", { alpha: true });
      default:
        throw new Error("[Renderer] unknown output type");
    }
  }
}
