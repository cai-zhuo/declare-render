import type { TextMetrics } from "canvas";

export enum RendererType {
  CONTAINER = "container",
  TEXT = "text",
  IMG = "img",
  SHAPE = "shape",
}

// ----- TypeScript types (primitives only) -----

export interface TextRenderData {
  id: string | number;
  type: "text";
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  rotate?: number;
  style: {
    align?: "center" | "right";
    verticalAlign?: "center" | "top" | "bottom";
    fontName: string;
    fontSize: number | { max: number; min: number };
    backgroundColor?: string;
    padding?: number | { x: number; y: number };
    border?: { color: string; width?: number };
    color: string;
    radius?: number;
    verticalGap?: number;
    horizonalGap?: number;
    fontWeight?: string;
    highlight?: {
      logics?: string;
      color?: string;
      content?: string;
      type?: string;
      style?: { height?: number; offsetY?: number; coverText?: boolean; url: string };
    };
  };
}

export interface ImgRenderData {
  id: string;
  type: "img";
  x: number;
  y: number;
  width?: number;
  height?: number;
  url?: string;
  color?: string;
  objectFit: "contain" | "cover";
  radius?: number;
  rotate?: number;
  globalAlpha?: number;
  shadow?: { color: string; blur: number; X: number; Y: number };
}

export interface ContainerRenderData {
  id: string | number;
  type: "container";
  x: number;
  y: number;
  width: number;
  height: number;
  direction?: "row" | "column";
  itemAlign?: "center";
  gap?: number | { x: number; y: number };
  wrap?: boolean;
  renderers: ChildRenderers;
}

export interface ShapeRenderData {
  id: string | number;
  type: "shape";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotate?: number;
  style?: {
    fillStyle?: string;
    strokeStyle?: string;
    lineWidth?: number;
    lineCap?: "butt" | "round" | "square";
    lineJoin?: "bevel" | "round" | "miter";
    miterLimit?: number;
    lineDash?: number[];
    lineDashOffset?: number;
    globalAlpha?: number;
  };
  shadow?: {
    color: string;
    blur: number;
    X: number;
    Y: number;
  };
  shapes: ShapeCommand[];
}

export type ShapeCommand =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "fillRect"; x: number; y: number; width: number; height: number }
  | { type: "strokeRect"; x: number; y: number; width: number; height: number }
  | { type: "clearRect"; x: number; y: number; width: number; height: number }
  | { type: "beginPath" }
  | { type: "closePath" }
  | { type: "moveTo"; x: number; y: number }
  | { type: "lineTo"; x: number; y: number }
  | {
      type: "arc";
      x: number;
      y: number;
      radius: number;
      startAngle: number;
      endAngle: number;
      counterclockwise?: boolean;
    }
  | {
      type: "arcTo";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      radius: number;
    }
  | {
      type: "quadraticCurveTo";
      cp1x: number;
      cp1y: number;
      x: number;
      y: number;
    }
  | {
      type: "bezierCurveTo";
      cp1x: number;
      cp1y: number;
      cp2x: number;
      cp2y: number;
      x: number;
      y: number;
    }
  | { type: "fill" }
  | { type: "stroke" }
  | { type: "fillAndStroke" };

export type ChildRenderers = (
  | ImgRenderData
  | TextRenderData
  | ContainerRenderData
  | ShapeRenderData
)[];

export interface RenderData {
  id: string;
  width: number;
  height: number;
  layers: (
    | ImgRenderData
    | TextRenderData
    | ContainerRenderData
    | ShapeRenderData
  )[];
  output?: {
    type?: "png" | "jpg";
  };
}

// ----- String schema for AI (readable as string) -----

export const RENDER_DATA_SCHEMA = `
RenderData: { "id": string, "width": number, "height": number, "layers": Array<TextRenderData | ImgRenderData | ContainerRenderData | ShapeRenderData>, "output"?: { "type"?: "png" | "jpg" } }

TextRenderData: { "id": string|number, "type": "text", "x": number, "y": number, "width": number, "height": number, "content": string, "style": { "fontName": string, "fontSize": number | { "max": number, "min": number }, "color": string, "align"?: "center"|"right", "verticalAlign"?: "center"|"top"|"bottom", "fontWeight"?: string, "verticalGap"?: number, "backgroundColor"?: string, "padding"?: number|{ "x": number, "y": number }, "border"?: { "color": string, "width"?: number }, "radius"?: number }, "rotate"?: number }

ImgRenderData: { "id": string, "type": "img", "x": number, "y": number, "width"?: number, "height"?: number, "url"?: string, "color"?: string, "objectFit": "contain"|"cover", "radius"?: number, "rotate"?: number, "globalAlpha"?: number, "shadow"?: { "color": string, "blur": number, "X": number, "Y": number } }

ContainerRenderData: { "id": string|number, "type": "container", "x": number, "y": number, "width": number, "height": number, "renderers": ChildRenderers[], "direction"?: "row"|"column", "gap"?: number|{ "x": number, "y": number }, "itemAlign"?: "center", "wrap"?: boolean }

ShapeRenderData: { "id": string|number, "type": "shape", "x": number, "y": number, "width"?: number, "height"?: number, "rotate"?: number, "style"?: { "fillStyle"?: string, "strokeStyle"?: string, "lineWidth"?: number, "lineCap"?: "butt"|"round"|"square", "lineJoin"?: "bevel"|"round"|"miter", "miterLimit"?: number, "lineDash"?: number[], "lineDashOffset"?: number, "globalAlpha"?: number }, "shadow"?: { "color": string, "blur": number, "X": number, "Y": number }, "shapes": Array<ShapeCommand> }

ShapeCommand: { "type": "rect"|"fillRect"|"strokeRect"|"clearRect"|"beginPath"|"closePath"|"moveTo"|"lineTo"|"arc"|"arcTo"|"quadraticCurveTo"|"bezierCurveTo"|"fill"|"stroke"|"fillAndStroke", ...additional properties based on type }
`.trim();

// ----- Metrics (canvas-dependent) -----

export interface MetricsChar {
  char: string;
  index: number;
  emHeight: number;
  fontSize: number;
  metrics: TextMetrics & {
    alphabeticBaseline: number;
    emHeightAscent: number;
    emHeightDescent: number;
  };
  boundingHeight: number;
}

export interface MetricsCharWithCoordinates extends MetricsChar {
  X: number;
  Y: number;
}
