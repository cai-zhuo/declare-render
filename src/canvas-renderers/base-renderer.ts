import type {
  ContainerRenderData,
  ImgRenderData,
  TextRenderData,
} from "../types";

export abstract class BaseRender<
  T extends TextRenderData | ImgRenderData | ContainerRenderData,
> {
  protected data!: T;
  abstract get container(): { x1: number; x2: number; y1: number; y2: number };
  abstract layout(): Promise<this>;
  public setPosition = (x: number, y: number) => {
    this.data.x = x;
    this.data.y = y;
    return this.layout();
  };
}
