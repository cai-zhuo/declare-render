import { RendererType } from "../../types";
import { HighlightType } from "./highlighter";

export enum highlightLogics {
  word = "word",
}

export interface TextRenderData {
  id: string | number;
  type: RendererType.TEXT; // Always "text"
  x: number; // The x-coordinate of the text container's starting point. As a child, 0 means relative to the container's origin. If not specified, the position depends on adjacent renderers and spacing.
  y: number; // The y-coordinate of the text container's starting point. As a child, 0 means relative to the container's origin. If not specified, the position depends on adjacent renderers and spacing.
  width: number; // The width of the text container. Exceeding text will wrap.
  height: number; // The height of the text container. Exceeding text will overflow.
  rotate?: number; // Rotation angle, calculated from the center of the object
  content: string; // Text content
  style: {
    // Text style customization
    /* This property should currently be disabled when under a container; */
    align?: "center" | "right"; // Text horizontal alignment
    /* This property should currently be disabled when under a container; */
    verticalAlign?: "center" | "top" | "bottom"; // Text vertical alignment
    fontName: string; // Font name. Supported fonts are:
    fontSize: number | { max: number; min: number }; // Font size. Supports objects for adaptive width to fill container.
    backgroundColor?: string; // Text background color
    padding?: number | { x: number; y: number }; // Text padding
    border?: { color: string; width?: number }; // Text border
    color: string; // Text color
    radius?: number; // Text background border radius
    verticalGap?: number; // Line gap
    horizonalGap?: number; // Gap between characters in the same line
    fontWeight?: string; // Font weight, same as CSS
    highlight?: {
      // Text highlight style
      logics: highlightLogics; // Highlight word logic
      color?: string; // Highlight color. When highlight type is not svg, this field is optional.
      content?: string; // Highlighted text content. When highlight type is not svg, this field is optional.
      type?: HighlightType; // Highlight style
      style?: {
        // When highlight type is not svg, this field should be empty
        height?: number; // Height of the highlight graphic
        offsetY?: number; // Vertical offset of the highlight graphic from the top, starting at the text rectangle point
        coverText?: boolean; // Whether the highlight should cover the text. If true, height is set to text height
        url: string; // Source of the highlight graphic
      };
    };
  };
}
