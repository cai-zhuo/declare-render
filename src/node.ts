/**
 * Node.js entry point
 * This file ensures node-canvas is used when running in Node.js
 */
import { Renderer as BaseRenderer } from "./index";
import { NodeCanvasEngine } from "./engine/node-engine";
import type { RenderData } from "./types";

// Re-export types
export * from "./index";

/**
 * Renderer class for Node.js environment
 * Automatically uses NodeCanvasEngine
 */
export class Renderer extends BaseRenderer {
  constructor(schema: RenderData) {
    super(schema, new NodeCanvasEngine());
  }
}
