/**
 * Browser entry point
 * This file ensures DOM canvas is used when running in browser
 */
import { Renderer as BaseRenderer } from "./index";
import { BrowserCanvasEngine } from "./engine/browser-engine";
import type { RenderData } from "./types";

// Re-export types
export * from "./index";

/**
 * Renderer class for Browser environment
 * Automatically uses BrowserCanvasEngine
 */
export class Renderer extends BaseRenderer {
  constructor(schema: RenderData) {
    super(schema, new BrowserCanvasEngine());
  }
}
