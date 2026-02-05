# Declare Render

A TypeScript library for declaratively drawing canvas graphics using JSON schema.

## Installation

Install the library with pnpm:

```bash
pnpm add declare-render
```

## Usage

```typescript
import { Renderer } from 'declare-render';
import { RenderData } from 'declare-render';

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
// buffer is a PNG or JPG image buffer
```

## Features

- **Text Layers**: Render text with various styling options
- **Image Layers**: Render images or solid color rectangles
- **Container Layers**: Organize layers with flexbox-like layouts
- **Multiple Output Formats**: PNG and JPG support

