import type {
  ImgRenderData,
  ShapeRenderData,
  TextRenderData,
} from "../types";

export type LayerType = "text" | "img" | "shape";

export abstract class BaseRender<
  T extends
    | TextRenderData
    | ImgRenderData
    | ShapeRenderData,
> {
  protected data!: T;
  abstract get container(): { x1: number; x2: number; y1: number; y2: number };
  abstract layout(): Promise<this>;
  /** Expose id without exposing internal data. */
  getId(): string | number {
    return this.data.id;
  }
  /** Expose type without exposing internal data. */
  getLayerType(): LayerType {
    return this.data.type;
  }
  public setPosition = (x: number, y: number) => {
    this.data.x = x;
    this.data.y = y;
    return this.layout();
  };
}
