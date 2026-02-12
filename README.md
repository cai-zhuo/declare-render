# Declare Render

A TypeScript library for declaratively drawing canvas graphics using JSON schema. Works in both Node.js and Browser environments.

## Installation

Install the library with pnpm:

```bash
pnpm add declare-render
```

## Usage

### Node.js

For Node.js environments, use the Node.js entry point which uses `node-canvas`:

```typescript
import { Renderer } from 'declare-render/node';
import type { RenderData } from 'declare-render';

const schema: RenderData = {
  id: "my-canvas",
  width: 800,
  height: 600,
  layers: [
    {
      id: "text-1",
      type: "text",
      x: 50,
      y: 50,
      width: 700,
      height: 100,
      content: "Hello, World!",
      style: {
        fontName: "Arial",
        fontSize: 32,
        color: "#000000",
      },
    },
  ],
};

const renderer = new Renderer(schema);
const buffer = await renderer.draw();
// buffer is a Buffer (Node.js)
```

### Browser

For browser environments, use the browser entry point which uses DOM canvas:

```typescript
import { Renderer } from 'declare-render/browser';
import type { RenderData } from 'declare-render';

const schema: RenderData = {
  id: "my-canvas",
  width: 800,
  height: 600,
  layers: [
    {
      id: "text-1",
      type: "text",
      x: 50,
      y: 50,
      width: 700,
      height: 100,
      content: "Hello, World!",
      style: {
        fontName: "Arial",
        fontSize: 32,
        color: "#000000",
      },
    },
  ],
};

const renderer = new Renderer(schema);
const blob = await renderer.draw();
// blob is a Blob (Browser)
```

### Auto-detection (Not Recommended)

You can also use the default entry point which auto-detects the environment:

```typescript
import { Renderer } from 'declare-render';
// Automatically uses node-canvas in Node.js, DOM canvas in browser
```

**Note:** For better tree-shaking and bundle size, explicitly use `/node` or `/browser` entry points.

## Features

- **Text Layers**: Render text with various styling options
- **Image Layers**: Render images or solid color rectangles
- **Container Layers**: Organize layers with flexbox-like layouts
- **Multiple Output Formats**: PNG and JPG support
- **Cross-platform**: Works in both Node.js and Browser environments
- **Engine Abstraction**: Automatically uses the appropriate canvas engine for your environment

## Architecture

The library uses an engine abstraction layer that automatically selects the appropriate canvas implementation:

- **Node.js Engine**: Uses `node-canvas` for server-side rendering
- **Browser Engine**: Uses DOM `HTMLCanvasElement` for client-side rendering

Both engines provide the same API, ensuring consistent behavior across environments.

