import {
  ChildRenderers,
  ImgRenderData,
  RendererType,
  ShapeRenderData,
  TextRenderData,
} from "../../types";
import type { ContainerRenderData } from "../../types";
import { type CanvasRenderingContext2D } from "canvas";
import { cloneDeep, isNumber, isObject, isUndefined } from "lodash-es";
import { BaseRender } from "../base-renderer";
import { ImgRender } from "../img-renderer/index";
import { TextRender } from "../text-renderer/index";
import { ShapeRender } from "../shape-render/index";

export type { ContainerRenderData } from "../../types";

export class ContainerRenderer extends BaseRender<ContainerRenderData> {
  private ctx: CanvasRenderingContext2D
  private renderers: Array<ImgRender | TextRender | ShapeRender | ContainerRenderer> = []

  constructor(ctx: CanvasRenderingContext2D, data: ContainerRenderData) {
    super()
    this.ctx = ctx
    this.data = cloneDeep(data)
    this.ctx.patternQuality = 'best'
    this.ctx.quality = 'best'
  }

  get container() {
    return this.getContainerCoordinates()
  }

  private createRenderer = (renderData: ImgRenderData | TextRenderData | ShapeRenderData | ContainerRenderData) => {
    switch (renderData.type) {
      case RendererType.TEXT: {
        return new TextRender(this.ctx, renderData, { inFlexFlow: isUndefined(renderData.x) || isUndefined(renderData.y) })
      }
      case RendererType.IMG:
        return new ImgRender(this.ctx, renderData)
      case RendererType.SHAPE:
        return new ShapeRender(this.ctx, renderData)
      case RendererType.CONTAINER:
        return new ContainerRenderer(this.ctx, renderData)
      default:
        throw new Error("[Renderer] unknown renderer type")
    }
  }

  // TODO center the renderers, vertical center, left align, wrap the renderers;
  public layout = async () => {
    const layoutedRenderers = [] as Array<ImgRender | TextRender | ShapeRender | ContainerRenderer>

    for (const index in this.data.renderers) {
      const renderData = cloneDeep(this.data.renderers[index]) as ImgRenderData | TextRenderData | ShapeRenderData | ContainerRenderData

      let renderX = renderData.x
      let renderY = renderData.y
      // 子 renderer 的 x、y 相对容器的 x、y 进行定位
      if (isNumber(renderX)) {
        renderX += this.data.x
      }

      if (isNumber(renderY)) {
        renderY += this.data.y
      }

      // justify
      if (isUndefined(renderX) || isUndefined(renderY)) {
        const preRenderer = layoutedRenderers.at(-1) as undefined | ImgRender | TextRender | ShapeRender | ContainerRenderer
        const { x2, y1, x1, y2 } = preRenderer?.container || { x1: this.data.x, x2: this.data.x, y1: this.data.y, y2: this.data.y }

        const gapX = !preRenderer ?
          0 : isObject(this.data.gap) ?
            this.data.gap.x : (this.data.gap || 0)

        const gapY = !preRenderer ?
          0 : isObject(this.data.gap) ?
            this.data.gap.y : (this.data.gap || 0)

        if (this.data.direction === 'column') {
          renderX = renderX || x1
          renderY = renderY || (y2 + gapY)
        } else {
          renderX = renderX || (x2 + gapX)
          renderY = renderY || y1
        }
      }

      const currentRenderer = this.createRenderer({ ...renderData, x: renderX, y: renderY })

      await currentRenderer.layout()
      
      layoutedRenderers.push(currentRenderer)
    }

    // align items
    if (this.data.itemAlign === 'center') {
      const squares = layoutedRenderers.map(r => {
        const { x1, x2, y1, y2 } = r.container
        return { ...r.container, width: x2 - x1, height: y2 - y1, renderer: r }
      })

      const maxWidth = Math.max(...squares.map(s => s.width))
      const maxHeight = Math.max(...squares.map(s => s.height))

      squares.forEach(s => {
        if (this.data.direction === 'column') {
          const offset = (maxWidth - s.width) / 2
          s.renderer.setPosition(s.x1 + offset, s.y1)
        } else {
          const offset = (maxHeight - s.height) / 2
          s.renderer.setPosition(s.x1, s.y1 + offset)
        }
      })
    }

    this.renderers = layoutedRenderers
    return this
  }

  // TODO rotate the whole renderer
  public draw = async() => {
    if (!this.renderers.length) {
      return this
    }

    const pickedOne = this.renderers.shift()!
    await pickedOne.draw()

    await this.draw()

    return this
  }

  // TODO handle the renderers wrapping, add gap;
  private getContainerCoordinates = () => {
    if (!this.renderers.length) throw new Error("can not get container coordinates before layouted")
    const firstChild = this.renderers.at(0) as ImgRender | TextRender | ShapeRender
    const lastChild = this.renderers.at(-1) as ImgRender | TextRender | ShapeRender
    return {
      x1: firstChild.container.x1,
      y1: firstChild.container.y1,
      x2: lastChild.container.x2,
      y2: lastChild.container.y2,
    }
  }
}
