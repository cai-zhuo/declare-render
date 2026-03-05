import type {
  RenderData,
  ContainerRenderData,
  TextRenderData,
  ShapeRenderData,
  ImgRenderData,
  ChildRenderers,
} from "../types";
import { cloneDeep } from "lodash-es";

/**
 * Normalizes incoming schema to internal format.
 * Handles multiple input formats:
 * - Containers: accepts both "children" and "layers"
 * - Text: accepts both "text" and "content"
 * - Text styles: accepts flat properties (fontSize, color, textAlign) or nested style object
 * - Shapes: accepts shape: "rect" with flat properties or shapes array
 * - Container background: converts to background shape layer
 */
export function normalizeSchema(schema: any): RenderData {
  if (!schema || typeof schema !== "object") {
    throw new Error("[normalizeSchema] schema must be an object");
  }

  const normalized = cloneDeep(schema);

  // Normalize the root schema
  if (normalized.layers) {
    normalized.layers = normalized.layers.map(normalizeChild);
  }

  return normalized as RenderData;
}

function normalizeChild(child: any): any {
  if (!child || typeof child !== "object") {
    return child;
  }

  const normalized = cloneDeep(child);

  // Handle containers
  if (normalized.type === "container") {
    // Convert children to layers
    if (normalized.children && !normalized.layers) {
      normalized.layers = normalized.children.map(normalizeChild);
      delete normalized.children;
    } else if (normalized.layers) {
      normalized.layers = normalized.layers.map(normalizeChild);
    }

    // Handle background property by adding a background shape layer
    if (normalized.background && normalized.layers) {
      normalized.layers.unshift({
        id: `${normalized.id}-bg`,
        type: "shape",
        x: 0,
        y: 0,
        shapes: [
          {
            type: "rect",
            x: 0,
            y: 0,
            width: normalized.width || 0,
            height: normalized.height || 0,
            style: {
              fillStyle: normalized.background,
            },
          },
        ],
      });
      delete normalized.background;
    }
  }

  // Handle text elements
  if (normalized.type === "text") {
    // Convert text property to content
    if (normalized.text !== undefined && normalized.content === undefined) {
      normalized.content = normalized.text;
      delete normalized.text;
    }

    // Ensure style object exists
    if (!normalized.style) {
      normalized.style = {};
    }

    // Convert flat style properties to nested style object
    if (normalized.fontSize !== undefined && normalized.style.fontSize === undefined) {
      normalized.style.fontSize = normalized.fontSize;
      delete normalized.fontSize;
    }
    if (normalized.color !== undefined && normalized.style.color === undefined) {
      normalized.style.color = normalized.color;
      delete normalized.color;
    }
    if (normalized.textAlign !== undefined && normalized.style.align === undefined) {
      normalized.style.align =
        normalized.textAlign === "center"
          ? "center"
          : normalized.textAlign === "right"
            ? "right"
            : undefined;
      delete normalized.textAlign;
    }
    if (normalized.fontWeight !== undefined && normalized.style.fontWeight === undefined) {
      normalized.style.fontWeight = normalized.fontWeight;
      delete normalized.fontWeight;
    }

    // Ensure fontName exists (required)
    if (!normalized.style.fontName) {
      normalized.style.fontName = "Arial";
    }
  }

  // Handle shape elements
  if (normalized.type === "shape") {
    // Normalize shape commands (quadraticCurveTo x1,y1,x2,y2 -> cp1x,cp1y,x,y; ellipse defaults)
    if (Array.isArray(normalized.shapes)) {
      normalized.shapes = normalized.shapes.map((cmd: any) => {
        if (!cmd || typeof cmd !== "object") return cmd;
        const c = { ...cmd };
        if (c.type === "quadraticCurveTo") {
          // Accept x1,y1,x2,y2 (Canvas API alternative) -> cp1x,cp1y,x,y
          if (c.x1 !== undefined && c.cp1x === undefined) {
            c.cp1x = c.x1;
            c.cp1y = c.y1;
            c.x = c.x2;
            c.y = c.y2;
            delete c.x1;
            delete c.y1;
            delete c.x2;
            delete c.y2;
          }
        }
        if (c.type === "ellipse") {
          // Default full ellipse when startAngle/endAngle omitted
          if (c.startAngle === undefined) c.startAngle = 0;
          if (c.endAngle === undefined) c.endAngle = 2 * Math.PI;
          if (c.rotation === undefined) c.rotation = 0;
        }
        return c;
      });
    }
    // Convert old format: shape: "rect" with flat properties to shapes array
    if (normalized.shape && !normalized.shapes) {
      const shapeType = normalized.shape;
      const shapes: any[] = [];

      if (shapeType === "rect") {
        // Shape commands use relative coordinates (0,0 relative to layer position)
        shapes.push({
          type: "rect",
          x: 0,
          y: 0,
          width: normalized.width || 0,
          height: normalized.height || 0,
          style: {
            fillStyle: normalized.fill,
            strokeStyle: normalized.stroke,
            lineWidth: normalized.strokeWidth,
          },
        });
      }

      normalized.shapes = shapes;

      // Remove old properties
      delete normalized.shape;
      if (normalized.fill !== undefined) delete normalized.fill;
      if (normalized.stroke !== undefined) delete normalized.stroke;
      if (normalized.strokeWidth !== undefined) delete normalized.strokeWidth;
    }
  }

  return normalized;
}
