/**
 * Engine abstraction for canvas operations
 * Supports both Node.js (node-canvas) and Browser (DOM canvas) environments
 */

// CanvasRenderingContext2D type - compatible with both node-canvas and DOM canvas
// Reference the global DOM type which is compatible with node-canvas
export type CanvasRenderingContext2D = globalThis.CanvasRenderingContext2D;

export interface CanvasEngine {
  /**
   * Creates a new canvas with specified dimensions
   */
  createCanvas(width: number, height: number): CanvasLike;

  /**
   * Loads an image from a URL or data URI
   */
  loadImage(src: string): Promise<ImageLike>;

  /**
   * Gets the 2D rendering context from a canvas
   */
  getContext(canvas: CanvasLike): CanvasRenderingContext2D;

  /**
   * Converts canvas to buffer (Node.js) or blob (Browser)
   */
  toBuffer(canvas: CanvasLike, type: "png" | "jpg"): Promise<Buffer | Blob>;
}

/**
 * Canvas-like interface that works with both node-canvas and DOM canvas
 */
export interface CanvasLike {
  width: number;
  height: number;
  getContext(contextId: "2d"): CanvasRenderingContext2D | null;
}

/**
 * Image-like interface that works with both node-canvas Image and DOM HTMLImageElement
 */
export interface ImageLike {
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}
