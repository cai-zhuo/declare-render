/**
 * Node.js engine implementation using node-canvas
 */
import {
  Canvas,
  createCanvas,
  loadImage,
  Image,
  type CanvasRenderingContext2D as NodeCanvasRenderingContext2D,
} from "canvas";
import type { CanvasEngine, CanvasLike, ImageLike, CanvasRenderingContext2D } from "./types";

export class NodeCanvasEngine implements CanvasEngine {
  createCanvas(width: number, height: number): CanvasLike {
    return createCanvas(width, height) as unknown as CanvasLike;
  }

  async loadImage(src: string): Promise<ImageLike> {
    return (await loadImage(src)) as unknown as ImageLike;
  }

  getContext(canvas: CanvasLike): CanvasRenderingContext2D {
    const ctx = (canvas as unknown as Canvas).getContext("2d") as NodeCanvasRenderingContext2D | null;
    if (!ctx) {
      throw new Error("Failed to get 2d context from canvas");
    }
    return ctx as unknown as CanvasRenderingContext2D;
  }

  async toBuffer(canvas: CanvasLike, type: "png" | "jpg"): Promise<Buffer> {
    const nodeCanvas = canvas as unknown as Canvas;
    if (type === "jpg") {
      return nodeCanvas.toBuffer("image/jpeg", { quality: 1.0 });
    } else {
      return nodeCanvas.toBuffer("image/png");
    }
  }
}
