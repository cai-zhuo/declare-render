import { BaseRender } from "../base-renderer";
import { cloneDeep, isNumber } from "lodash-es";
import { loadImage, Image, type CanvasRenderingContext2D } from "canvas";
import { getImageHeight, getImageRatio, getImageWidth } from "./utils";

export type ImgRenderData = {
  id: string;
  type: "img";
  x: number; // The x-coordinate of the image container's starting point. When used as a child in a container renderer, 0 means positioned relative to the container's 0. If not specified, the position is determined by adjacent renderers and gap.
  y: number; // The y-coordinate of the image container's starting point. As a child, 0 means positioned relative to the container's 0. If not specified, the position is determined by adjacent renderers and gap.
  /*
  If both width and height are provided, they determine the image's width and height.
  If only width or height is provided, the other will be determined proportionally.
  If neither width nor height is provided, the image will be rendered at its original dimensions.
  */
  width?: number; // The width of the image container
  height?: number; // The height of the image container
  shadow?: {
    // The shadow of the image container. Can be added directly to the rendered shape, instead of rendering a separate renderer.
    color: string; // The shadow color
    blur: number; // Shadow blur
    X: number; // Shadow offset on the x-axis
    Y: number; // Shadow offset on the y-axis
  };
  radius?: number; // The corner radius of the image container
  url?: string; // Image source
  color?: string; // Background color. If url is not provided, a pure color block will be rendered.
  rotate?: number; // The angle, calculated from the center point
  globalAlpha?: number; // Opacity
  objectFit: "contain" | "cover"; // If both width and height are provided, determines how the image fits within the container
};

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
