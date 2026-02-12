# Engine Architecture

This document explains how the engine abstraction works in `declare-render`.

## Overview

The library uses an engine abstraction layer to support both Node.js and Browser environments. This allows the same codebase to work seamlessly in both environments without mixing dependencies.

## Engine Interface

All engines implement the `CanvasEngine` interface:

```typescript
interface CanvasEngine {
  createCanvas(width: number, height: number): CanvasLike;
  loadImage(src: string): Promise<ImageLike>;
  getContext(canvas: CanvasLike): CanvasRenderingContext2D;
  toBuffer(canvas: CanvasLike, type: "png" | "jpg"): Promise<Buffer | Blob>;
}
```

## Implementations

### Node.js Engine (`node-engine.ts`)

- Uses `node-canvas` package
- Returns `Buffer` from `toBuffer()`
- Supports server-side image loading from URLs and file paths
- Entry point: `declare-render/node`

### Browser Engine (`browser-engine.ts`)

- Uses DOM `HTMLCanvasElement` and `HTMLImageElement`
- Returns `Blob` from `toBuffer()`
- Supports browser image loading (URLs, data URIs, blob URLs)
- Entry point: `declare-render/browser`

## Entry Points

### Node.js Entry Point (`src/node.ts`)

```typescript
import { NodeCanvasEngine } from "./engine/node-engine";
import { setEngine } from "./engine";
setEngine(new NodeCanvasEngine());
export * from "./index";
```

### Browser Entry Point (`src/browser.ts`)

```typescript
import { BrowserCanvasEngine } from "./engine/browser-engine";
import { setEngine } from "./engine";
setEngine(new BrowserCanvasEngine());
export * from "./index";
```

## Usage

### Explicit Entry Points (Recommended)

```typescript
// Node.js
import { Renderer } from 'declare-render/node';

// Browser
import { Renderer } from 'declare-render/browser';
```

### Auto-detection (Fallback)

The default entry point (`src/index.ts`) attempts to auto-detect the environment, but explicit entry points are recommended for better tree-shaking and bundle size.

## Type Compatibility

The engine uses type aliases (`CanvasLike`, `ImageLike`) to ensure compatibility between:
- Node.js: `Canvas` from `node-canvas` and `Image` from `node-canvas`
- Browser: `HTMLCanvasElement` and `HTMLImageElement`

Both implementations provide the same interface, ensuring consistent behavior.

## Benefits

1. **No Mixed Dependencies**: Node.js code doesn't bundle browser APIs, and browser code doesn't bundle node-canvas
2. **Tree-shaking**: Bundlers can eliminate unused code paths
3. **Type Safety**: TypeScript ensures correct usage across environments
4. **Consistent API**: Same API works identically in both environments
