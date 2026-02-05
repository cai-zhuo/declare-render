import { Renderer } from "../src/index";
import { RenderData, RendererType, type ShapeRenderData } from "../src/types";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create an arrow shape
function createArrow(
  id: string | number,
  x: number,
  y: number,
  endX: number,
  endY: number,
  arrowLength: number = 20,
  arrowAngle: number = Math.PI / 6, // 30 degrees
): ShapeRenderData {
  // Calculate arrow direction
  const dx = endX - x;
  const dy = endY - y;
  const angle = Math.atan2(dy, dx);

  // Calculate arrowhead points
  const arrowX1 = endX - arrowLength * Math.cos(angle - arrowAngle);
  const arrowY1 = endY - arrowLength * Math.sin(angle - arrowAngle);
  const arrowX2 = endX - arrowLength * Math.cos(angle + arrowAngle);
  const arrowY2 = endY - arrowLength * Math.sin(angle + arrowAngle);

  // Calculate bounds
  const minX = Math.min(x, endX, arrowX1, arrowX2);
  const minY = Math.min(y, endY, arrowY1, arrowY2);
  const maxX = Math.max(x, endX, arrowX1, arrowX2);
  const maxY = Math.max(y, endY, arrowY1, arrowY2);

  // Normalize coordinates relative to shape position
  const normalizedX = x - minX;
  const normalizedY = y - minY;
  const normalizedEndX = endX - minX;
  const normalizedEndY = endY - minY;
  const normalizedArrowX1 = arrowX1 - minX;
  const normalizedArrowY1 = arrowY1 - minY;
  const normalizedArrowX2 = arrowX2 - minX;
  const normalizedArrowY2 = arrowY2 - minY;

  return {
    id,
    type: RendererType.SHAPE,
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    style: {
      strokeStyle: "#000000",
      fillStyle: "#000000",
      lineWidth: 3,
      lineCap: "round",
      lineJoin: "round",
    },
    shapes: [
      { type: "beginPath" },
      { type: "moveTo", x: normalizedX, y: normalizedY },
      { type: "lineTo", x: normalizedEndX, y: normalizedEndY },
      { type: "stroke" },
      // Arrowhead
      { type: "beginPath" },
      { type: "moveTo", x: normalizedEndX, y: normalizedEndY },
      { type: "lineTo", x: normalizedArrowX1, y: normalizedArrowY1 },
      { type: "lineTo", x: normalizedArrowX2, y: normalizedArrowY2 },
      { type: "closePath" },
      { type: "fill" },
    ],
  };
}

// Test file with black shapes including arrows
const arrowTestSchema: RenderData = {
  id: "arrow-test",
  width: 800,
  height: 600,
  layers: [
    // Horizontal arrow pointing right
    createArrow("arrow1", 50, 100, 200, 100, 25),

    // Vertical arrow pointing down
    createArrow("arrow2", 250, 50, 250, 200, 25),

    // Diagonal arrow pointing up-right
    createArrow("arrow3", 50, 300, 200, 200, 30),

    // Diagonal arrow pointing down-right
    createArrow("arrow4", 50, 400, 200, 500, 30),

    // Curved arrow (using bezier curve)
    {
      id: "curved-arrow",
      type: RendererType.SHAPE,
      x: 300,
      y: 100,
      width: 200,
      height: 200,
      style: {
        strokeStyle: "#000000",
        fillStyle: "#000000",
        lineWidth: 3,
        lineCap: "round",
      },
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 0, y: 0 },
        {
          type: "bezierCurveTo",
          cp1x: 50,
          cp1y: 0,
          cp2x: 150,
          cp2y: 200,
          x: 200,
          y: 200,
        },
        { type: "stroke" },
        // Arrowhead at end
        { type: "beginPath" },
        { type: "moveTo", x: 200, y: 200 },
        { type: "lineTo", x: 180, y: 185 },
        { type: "lineTo", x: 185, y: 195 },
        { type: "closePath" },
        { type: "fill" },
      ],
    } as ShapeRenderData,

    // Simple black circle
    {
      id: "circle1",
      type: RendererType.SHAPE,
      x: 550,
      y: 50,
      width: 100,
      height: 100,
      style: {
        fillStyle: "#000000",
        strokeStyle: "#000000",
        lineWidth: 2,
      },
      shapes: [
        { type: "beginPath" },
        {
          type: "arc",
          x: 50,
          y: 50,
          radius: 45,
          startAngle: 0,
          endAngle: Math.PI * 2,
          counterclockwise: false,
        },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,

    // Black rectangle
    {
      id: "rect1",
      type: RendererType.SHAPE,
      x: 550,
      y: 200,
      width: 150,
      height: 100,
      style: {
        fillStyle: "#000000",
        strokeStyle: "#000000",
        lineWidth: 2,
      },
      shapes: [
        { type: "fillRect", x: 0, y: 0, width: 150, height: 100 },
        { type: "strokeRect", x: 0, y: 0, width: 150, height: 100 },
      ],
    } as ShapeRenderData,

    // Black triangle
    {
      id: "triangle1",
      type: RendererType.SHAPE,
      x: 550,
      y: 350,
      width: 150,
      height: 150,
      style: {
        fillStyle: "#000000",
        strokeStyle: "#000000",
        lineWidth: 2,
      },
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 75, y: 0 },
        { type: "lineTo", x: 150, y: 150 },
        { type: "lineTo", x: 0, y: 150 },
        { type: "closePath" },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,

    // Arrow pointing to the circle
    createArrow("arrow-to-circle", 300, 350, 550, 100, 30),

    // Arrow pointing to the rectangle
    createArrow("arrow-to-rect", 300, 400, 550, 250, 30),

    // Arrow pointing to the triangle
    createArrow("arrow-to-triangle", 300, 450, 550, 425, 30),

    // Multiple arrows forming a flow diagram
    createArrow("flow1", 50, 550, 150, 550, 20),
    createArrow("flow2", 150, 550, 250, 550, 20),
    createArrow("flow3", 250, 550, 350, 550, 20),
    createArrow("flow4", 350, 550, 450, 550, 20),
  ],
  output: {
    type: "png",
  },
};

async function main() {
  try {
    console.log("Creating renderer...");
    const renderer = new Renderer(arrowTestSchema);
    console.log("Drawing shapes...");
    const buffer = await renderer.draw();
    const outputPath = path.join(__dirname, "output", "arrow-test.png");

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log("Writing file...");
    fs.writeFileSync(outputPath, buffer);
    console.log(`Arrow test rendered successfully: ${outputPath}`);
  } catch (error) {
    console.error("Error rendering arrow test:");
    console.error(error);
    if (error instanceof Error) {
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
