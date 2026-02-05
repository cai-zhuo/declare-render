import { BaseRender } from "../base-renderer";
import type { ImgRenderData } from "../../types";
import { cloneDeep, isNumber } from "lodash-es";
import { loadImage, Image, type CanvasRenderingContext2D } from "canvas";
import { getImageHeight, getImageRatio, getImageWidth } from "./utils";

export type { ImgRenderData } from "../../types";

export class ImgRender extends BaseRender<ImgRenderData> {
  ctx: CanvasRenderingContext2D;
  width: number = 0;
  height: number = 0;
  imageWidth: number = 0;
  imageHeight: number = 0;
  data: ImgRenderData;

  private image?: Image;

  constructor(ctx: CanvasRenderingContext2D, data: ImgRenderData) {
    super();
    this.ctx = ctx;
    this.data = cloneDeep(data);
  }

  get container() {
    return this.getContainerCoordinates();
  }

  private async drawImage(x: number, y: number, image: Image) {
    const marginX = this.width - this.imageWidth;
    const marginY = this.height - this.imageHeight;

    this.ctx.save();

    if (isNumber(this.data.globalAlpha)) {
      this.ctx.globalAlpha = this.data.globalAlpha;
    }

    if (this.data.shadow) {
      this.ctx.shadowBlur = this.data.shadow.blur;
      this.ctx.shadowColor = this.data.shadow.color;
      this.ctx.shadowOffsetX = this.data.shadow.X || 0;
      this.ctx.shadowOffsetY = this.data.shadow.Y || 0;
    }

    this.ctx.drawImage(
      image,
      x + marginX / 2,
      y + marginY / 2,
      this.imageWidth,
      this.imageHeight,
    );
    this.ctx.restore();
  }

  private drawColor(x: number, y: number) {
    const { width, height } = this;
    this.ctx.save();

    if (!this.data.color) return;

    this.ctx.fillStyle = this.data.color;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, width, height, this.data.radius || 0);
    this.ctx.fill();
    this.ctx.restore();
  }

  layout = async () => {
    const { url, width, height } = this.data;
    const image = url ? await loadImage(url) : null;

    if (!image) {
      if (!width || !height) {
        throw new Error("img renderer without url should specify size");
      }
      this.width = width;
      this.height = height;
      this.imageWidth = 0;
      this.imageHeight = 0;
      return this;
    }

    this.image = image;

    if (!width) {
      if (!height) {
        this.imageWidth = image.naturalWidth;
        this.imageHeight = image.naturalHeight;
        this.width = this.imageWidth;
        this.height = this.imageHeight;
      } else {
        this.imageWidth = getImageWidth(image, height);
        this.imageHeight = height;
        this.width = this.imageWidth;
        this.height = this.imageHeight;
      }
    } else {
      if (!height) {
        this.imageWidth = width;
        this.imageHeight = getImageHeight(image, width);
        this.width = this.imageWidth;
        this.height = this.imageHeight;
      } else {
        const ratio = getImageRatio(image);
        const objectFit = this.data.objectFit || "contain";

        if (objectFit === "cover" ? ratio > 1 : ratio <= 1) {
          this.imageWidth = getImageWidth(image, height);
          this.imageHeight = height;
        } else {
          this.imageWidth = width;
          this.imageHeight = getImageHeight(image, width);
        }
        this.width = width;
        this.height = height;
      }
    }
    return this;
  };

  draw = async () => {
    const { x, y, rotate } = this.data;
    const drawImpl = async (x: number, y: number) => {
      if (this.data.color) {
        this.drawColor(x, y);
      }

      if (this.image) {
        await this.drawImage(x, y, this.image);
      }
    };

    if (!rotate) {
      await drawImpl(x, y);
    } else {
      const { width, height } = this;

      this.ctx.save();

      const actualHeight = height
        ? height
        : !this.image
          ? 0
          : (this.image.naturalHeight / this.image.naturalWidth) * width;

      this.ctx.translate(x + width / 2, y + actualHeight / 2);

      this.ctx.rotate((rotate * Math.PI) / 180);

      this.ctx.translate(-(x + width / 2), -(y + actualHeight / 2));

      await drawImpl(x, y);
      
      this.ctx.restore();
    }

    return this;
  };

  public getContainerCoordinates = () => {
    const { x, y } = this.data;

    const { width, height } = this;
    return {
      x1: x,
      y1: y,

      x2: x + width,

      y2: y + height!,
    };
  };
}
