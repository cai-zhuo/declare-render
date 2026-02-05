import { ContainerRenderData } from "./canvas-renderers/container-renderer";
import { ImgRenderData } from "./canvas-renderers/img-renderer";
import { TextRenderData } from "./canvas-renderers/text-renderer/types";
import type { TextMetrics } from "canvas";

export type { ContainerRenderData, ImgRenderData, TextRenderData };

export interface RenderData {
  id: string;
  width: number;
  height: number;
  renderers: (ImgRenderData | TextRenderData | ContainerRenderData)[];
  output?: {
    type?: "png" | "jpg";
  };
}

export enum RendererType {
  CONTAINER = "container",
  TEXT = "text",
  IMG = "img",
}

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

export type ChildRenderers = (ImgRenderData | TextRenderData | ContainerRenderData)[];
