/**
 * Browser engine implementation using DOM canvas
 */
import type { CanvasEngine, CanvasLike, ImageLike } from "./types";

export class BrowserCanvasEngine implements CanvasEngine {
  createCanvas(width: number, height: number): CanvasLike {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas as CanvasLike;
  }

  async loadImage(src: string): Promise<ImageLike> {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => resolve(img as ImageLike);
      img.onerror = reject;
      img.src = src;
    });
  }

  getContext(canvas: CanvasLike): CanvasRenderingContext2D {
    const htmlCanvas = canvas as HTMLCanvasElement;
    const ctx = htmlCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2d context from canvas");
    }
    return ctx;
  }

  async toBuffer(canvas: CanvasLike, type: "png" | "jpg"): Promise<Blob> {
    const htmlCanvas = canvas as HTMLCanvasElement;
    const mimeType = type === "jpg" ? "image/jpeg" : "image/png";
    return new Promise((resolve, reject) => {
      htmlCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        },
        mimeType,
        1.0
      );
    });
  }
}
