import { BaseRender } from "../base-renderer";
import type { ShapeRenderData, ShapeCommand, ShapeStyle } from "../../types";
import { cloneDeep, isNumber } from "lodash-es";
import { type CanvasRenderingContext2D } from "canvas";

export type { ShapeRenderData } from "../../types";

export class ShapeRender extends BaseRender<ShapeRenderData> {
  private ctx: CanvasRenderingContext2D;
  private computedWidth: number = 0;
  private computedHeight: number = 0;

  constructor(ctx: CanvasRenderingContext2D, data: ShapeRenderData) {
    super();
    this.ctx = ctx;
    this.data = cloneDeep(data);
  }

  get container() {
    return this.getContainerCoordinates();
  }

  /** Apply style to ctx. Used for layer style (inherit) and per-command override. */
  private applyStyle(style: ShapeStyle | undefined) {
    if (!style) return;

    if (style.fillStyle) {
      this.ctx.fillStyle = style.fillStyle;
    }
    if (style.strokeStyle) {
      this.ctx.strokeStyle = style.strokeStyle;
    }
    if (isNumber(style.lineWidth)) {
      this.ctx.lineWidth = style.lineWidth;
    }
    if (style.lineCap) {
      this.ctx.lineCap = style.lineCap;
    }
    if (style.lineJoin) {
      this.ctx.lineJoin = style.lineJoin;
    }
    if (isNumber(style.miterLimit)) {
      this.ctx.miterLimit = style.miterLimit;
    }
    if (style.lineDash) {
      this.ctx.setLineDash(style.lineDash);
    }
    if (isNumber(style.lineDashOffset)) {
      this.ctx.lineDashOffset = style.lineDashOffset;
    }
    if (isNumber(style.globalAlpha)) {
      this.ctx.globalAlpha = style.globalAlpha;
    }
  }

  private applyShadow() {
    if (this.data.shadow) {
      this.ctx.shadowBlur = this.data.shadow.blur;
      this.ctx.shadowColor = this.data.shadow.color;
      this.ctx.shadowOffsetX = this.data.shadow.X;
      this.ctx.shadowOffsetY = this.data.shadow.Y;
    }
  }

  private executeCommand(cmd: ShapeCommand, offsetX: number, offsetY: number) {
    // Track if we're in a path (set by beginPath, cleared by fill/stroke/fillAndStroke)
    // We'll use a simple heuristic: if this is a path-building command and the previous
    // command wasn't beginPath, we need to call beginPath
    // For simplicity, we'll ensure beginPath is called before path-building commands
    // unless the previous command was beginPath or a rendering command (which clears the path)
    
    switch (cmd.type) {
      case "rect":
        this.ctx.beginPath(); // Ensure new path for rect
        this.ctx.rect(cmd.x + offsetX, cmd.y + offsetY, cmd.width, cmd.height);
        break;
      case "fillRect":
        this.ctx.fillRect(
          cmd.x + offsetX,
          cmd.y + offsetY,
          cmd.width,
          cmd.height,
        );
        break;
      case "strokeRect":
        this.ctx.strokeRect(
          cmd.x + offsetX,
          cmd.y + offsetY,
          cmd.width,
          cmd.height,
        );
        break;
      case "clearRect":
        this.ctx.clearRect(
          cmd.x + offsetX,
          cmd.y + offsetY,
          cmd.width,
          cmd.height,
        );
        break;
      case "beginPath":
        this.ctx.beginPath();
        break;
      case "closePath":
        this.ctx.closePath();
        break;
      case "moveTo":
        this.ctx.beginPath(); // Ensure new path
        this.ctx.moveTo(cmd.x + offsetX, cmd.y + offsetY);
        break;
      case "lineTo":
        this.ctx.lineTo(cmd.x + offsetX, cmd.y + offsetY);
        break;
      case "arc":
        this.ctx.beginPath(); // Ensure new path for each arc
        this.ctx.arc(
          cmd.x + offsetX,
          cmd.y + offsetY,
          cmd.radius,
          cmd.startAngle,
          cmd.endAngle,
          cmd.counterclockwise || false,
        );
        break;
      case "arcTo":
        this.ctx.arcTo(
          cmd.x1 + offsetX,
          cmd.y1 + offsetY,
          cmd.x2 + offsetX,
          cmd.y2 + offsetY,
          cmd.radius,
        );
        break;
      case "quadraticCurveTo":
        this.ctx.quadraticCurveTo(
          cmd.cp1x + offsetX,
          cmd.cp1y + offsetY,
          cmd.x + offsetX,
          cmd.y + offsetY,
        );
        break;
      case "bezierCurveTo":
        this.ctx.bezierCurveTo(
          cmd.cp1x + offsetX,
          cmd.cp1y + offsetY,
          cmd.cp2x + offsetX,
          cmd.cp2y + offsetY,
          cmd.x + offsetX,
          cmd.y + offsetY,
        );
        break;
      case "fill":
        // Ensure fillStyle is set (should already be set via applyStyle, but double-check)
        this.ctx.fill();
        break;
      case "stroke":
        // Ensure strokeStyle is set (should already be set via applyStyle, but double-check)
        this.ctx.stroke();
        break;
      case "fillAndStroke":
        this.ctx.fill();
        this.ctx.stroke();
        break;
    }
  }

  private computeBounds(): { width: number; height: number } {
    if (this.data.width && this.data.height) {
      return { width: this.data.width, height: this.data.height };
    }

    if (!this.data.shapes || this.data.shapes.length === 0) {
      return { width: 0, height: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const cmd of this.data.shapes) {
      switch (cmd.type) {
        case "rect":
        case "fillRect":
        case "strokeRect":
        case "clearRect":
          minX = Math.min(minX, cmd.x);
          minY = Math.min(minY, cmd.y);
          maxX = Math.max(maxX, cmd.x + cmd.width);
          maxY = Math.max(maxY, cmd.y + cmd.height);
          break;
        case "moveTo":
        case "lineTo":
          minX = Math.min(minX, cmd.x);
          minY = Math.min(minY, cmd.y);
          maxX = Math.max(maxX, cmd.x);
          maxY = Math.max(maxY, cmd.y);
          break;
        case "arc":
          minX = Math.min(minX, cmd.x - cmd.radius);
          minY = Math.min(minY, cmd.y - cmd.radius);
          maxX = Math.max(maxX, cmd.x + cmd.radius);
          maxY = Math.max(maxY, cmd.y + cmd.radius);
          break;
        case "arcTo":
          minX = Math.min(minX, cmd.x1, cmd.x2);
          minY = Math.min(minY, cmd.y1, cmd.y2);
          maxX = Math.max(maxX, cmd.x1, cmd.x2);
          maxY = Math.max(maxY, cmd.y1, cmd.y2);
          break;
        case "quadraticCurveTo":
        case "bezierCurveTo":
          minX = Math.min(minX, cmd.cp1x, cmd.x);
          minY = Math.min(minY, cmd.cp1y, cmd.y);
          maxX = Math.max(maxX, cmd.cp1x, cmd.x);
          maxY = Math.max(maxY, cmd.cp1y, cmd.y);
          if (cmd.type === "bezierCurveTo") {
            minX = Math.min(minX, cmd.cp2x);
            minY = Math.min(minY, cmd.cp2y);
            maxX = Math.max(maxX, cmd.cp2x);
            maxY = Math.max(maxY, cmd.cp2y);
          }
          break;
      }
    }

    if (minX === Infinity) {
      return { width: 0, height: 0 };
    }

    return {
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  public layout = async () => {
    const bounds = this.computeBounds();
    this.computedWidth = this.data.width ?? bounds.width;
    this.computedHeight = this.data.height ?? bounds.height;
    return this;
  };

  public draw = async () => {
    const { x, y, rotate } = this.data;
    const offsetX = x;
    const offsetY = y;

    const drawImpl = () => {
      this.applyShadow();

      // Save state once for the entire shape layer
      this.ctx.save();
      
      // Apply layer-level style as base
      this.applyStyle(this.data.style);
      
      // Commands that complete a drawing operation
      const renderingCommands = new Set(["fill", "stroke", "fillAndStroke"]);
      // Commands that build paths
      const pathBuildingCommands = new Set(["arc", "arcTo", "moveTo", "lineTo", "quadraticCurveTo", "bezierCurveTo", "rect"]);
      
      // Track the last style applied (for fill/stroke commands that don't have their own style)
      let lastAppliedStyle: ShapeStyle | undefined = this.data.style;
      
      for (let i = 0; i < this.data.shapes.length; i++) {
        const cmd = this.data.shapes[i];
        const prevCmd = i > 0 ? this.data.shapes[i - 1] : null;
        
        // For rendering commands (fill/stroke) without their own style,
        // use the style from the previous path-building command
        if (renderingCommands.has(cmd.type) && !("style" in cmd && cmd.style)) {
          if (prevCmd && pathBuildingCommands.has(prevCmd.type) && "style" in prevCmd && prevCmd.style) {
            this.applyStyle(prevCmd.style);
            lastAppliedStyle = prevCmd.style;
          } else if (lastAppliedStyle) {
            // Fallback to last applied style
            this.applyStyle(lastAppliedStyle);
          }
        }
        // Apply command-specific style if present
        else if ("style" in cmd && cmd.style) {
          this.applyStyle(cmd.style);
          lastAppliedStyle = cmd.style;
        } else if (pathBuildingCommands.has(cmd.type)) {
          // For path-building commands without style, ensure we have a base style
          if (lastAppliedStyle) {
            this.applyStyle(lastAppliedStyle);
          }
        }
        
        // Execute the command
        this.executeCommand(cmd, offsetX, offsetY);
        
        // After rendering commands, reset to layer style for next command
        if (renderingCommands.has(cmd.type)) {
          this.applyStyle(this.data.style);
          lastAppliedStyle = this.data.style;
        }
      }
      
      // Restore to state before this shape layer
      this.ctx.restore();
    };

    if (!rotate) {
      drawImpl();
    } else {
      const { computedWidth, computedHeight } = this;
      const centerX = x + computedWidth / 2;
      const centerY = y + computedHeight / 2;

      this.ctx.save();
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate((rotate * Math.PI) / 180);
      this.ctx.translate(-centerX, -centerY);

      drawImpl();

      this.ctx.restore();
    }

    return this;
  };

  public getContainerCoordinates = () => {
    const { x, y } = this.data;
    return {
      x1: x,
      y1: y,
      x2: x + this.computedWidth,
      y2: y + this.computedHeight,
    };
  };
}
