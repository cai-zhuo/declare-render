// TextMetrics interface compatible with both node-canvas and browser
export interface TextMetrics {
  width: number;
  actualBoundingBoxLeft?: number;
  actualBoundingBoxRight?: number;
  actualBoundingBoxAscent?: number;
  actualBoundingBoxDescent?: number;
  emHeightAscent?: number;
  emHeightDescent?: number;
  alphabeticBaseline?: number;
  hangingBaseline?: number;
  ideographicBaseline?: number;
}

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
  layers: ChildRenderers;
}

/** Style for shape layer or per-command override. Commands inherit layer style; command.style overrides for that command only. */
export interface ShapeStyle {
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
  lineCap?: "butt" | "round" | "square";
  lineJoin?: "bevel" | "round" | "miter";
  miterLimit?: number;
  lineDash?: number[];
  lineDashOffset?: number;
  globalAlpha?: number;
}

export interface ShapeRenderData {
  id: string | number;
  type: "shape";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotate?: number;
  style?: ShapeStyle;
  shadow?: {
    color: string;
    blur: number;
    X: number;
    Y: number;
  };
  shapes: ShapeCommand[];
}

export type ShapeCommand =
  | { type: "rect"; x: number; y: number; width: number; height: number; rx?: number; ry?: number; style?: ShapeStyle }
  | { type: "fillRect"; x: number; y: number; width: number; height: number; rx?: number; ry?: number; style?: ShapeStyle }
  | { type: "strokeRect"; x: number; y: number; width: number; height: number; rx?: number; ry?: number; style?: ShapeStyle }
  | { type: "clearRect"; x: number; y: number; width: number; height: number; style?: ShapeStyle }
  | { type: "beginPath"; style?: ShapeStyle }
  | { type: "closePath"; style?: ShapeStyle }
  | { type: "moveTo"; x: number; y: number; style?: ShapeStyle }
  | { type: "lineTo"; x: number; y: number; style?: ShapeStyle }
  | {
      type: "arc";
      x: number;
      y: number;
      radius?: number;
      radiusX?: number;
      radiusY?: number;
      startAngle: number;
      endAngle: number;
      counterclockwise?: boolean;
      style?: ShapeStyle;
    }
  | {
      type: "ellipse";
      x: number;
      y: number;
      radiusX: number;
      radiusY: number;
      rotation: number;
      startAngle: number;
      endAngle: number;
      counterclockwise?: boolean;
      style?: ShapeStyle;
    }
  | {
      type: "arcTo";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      radius: number;
      style?: ShapeStyle;
    }
  | {
      type: "quadraticCurveTo";
      cp1x: number;
      cp1y: number;
      x: number;
      y: number;
      style?: ShapeStyle;
    }
  | {
      type: "bezierCurveTo";
      cp1x: number;
      cp1y: number;
      cp2x: number;
      cp2y: number;
      x: number;
      y: number;
      style?: ShapeStyle;
    }
  | { type: "fill"; style?: ShapeStyle }
  | { type: "stroke"; style?: ShapeStyle }
  | { type: "fillAndStroke"; style?: ShapeStyle };

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

ContainerRenderData: { "id": string|number, "type": "container", "x": number, "y": number, "width": number, "height": number, "layers": ChildRenderers[], "direction"?: "row"|"column", "gap"?: number|{ "x": number, "y": number }, "itemAlign"?: "center", "wrap"?: boolean }

ShapeRenderData: { "id": string|number, "type": "shape", "x": number, "y": number, "width"?: number, "height"?: number, "rotate"?: number, "style"?: { "fillStyle"?: string, "strokeStyle"?: string, "lineWidth"?: number, "lineCap"?: "butt"|"round"|"square", "lineJoin"?: "bevel"|"round"|"miter", "miterLimit"?: number, "lineDash"?: number[], "lineDashOffset"?: number, "globalAlpha"?: number }, "shadow"?: { "color": string, "blur": number, "X": number, "Y": number }, "shapes": Array<ShapeCommand> }

ShapeCommand: { "type": "rect"|"fillRect"|"strokeRect"|"clearRect"|"beginPath"|"closePath"|"moveTo"|"lineTo"|"arc"|"ellipse"|"arcTo"|"quadraticCurveTo"|"bezierCurveTo"|"fill"|"stroke"|"fillAndStroke", "style"?: ShapeStyle (optional; overrides layer style for this command), ...additional properties based on type }
- rect: { "type": "rect", "x": number, "y": number, "width": number, "height": number, "rx"?: number (horizontal border radius), "ry"?: number (vertical border radius), "style"?: ShapeStyle }
- arc: { "type": "arc", "x": number, "y": number, "radius"?: number (for circles), "radiusX"?: number (for ellipses), "radiusY"?: number (for ellipses), "startAngle": number, "endAngle": number, "counterclockwise"?: boolean, "style"?: ShapeStyle } (must have either radius OR both radiusX and radiusY)
- ellipse: { "type": "ellipse", "x": number, "y": number, "radiusX": number (horizontal radius), "radiusY": number (vertical radius), "rotation": number (rotation angle in radians), "startAngle": number, "endAngle": number, "counterclockwise"?: boolean, "style"?: ShapeStyle }
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
