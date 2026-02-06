/**
 * Declare-render examples: all test schemas in one file.
 * Each schema is commented with what it demonstrates and which output file it produces.
 */
import { Renderer } from "../src/index";
import { RenderData, RendererType, type ShapeRenderData } from "../src/types";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Helper: create an arrow shape (used by arrow-test schema)
// ---------------------------------------------------------------------------
function createArrow(
  id: string | number,
  x: number,
  y: number,
  endX: number,
  endY: number,
  arrowLength: number = 20,
  arrowAngle: number = Math.PI / 6,
): ShapeRenderData {
  const dx = endX - x;
  const dy = endY - y;
  const angle = Math.atan2(dy, dx);
  const arrowX1 = endX - arrowLength * Math.cos(angle - arrowAngle);
  const arrowY1 = endY - arrowLength * Math.sin(angle - arrowAngle);
  const arrowX2 = endX - arrowLength * Math.cos(angle + arrowAngle);
  const arrowY2 = endY - arrowLength * Math.sin(angle + arrowAngle);
  const minX = Math.min(x, endX, arrowX1, arrowX2);
  const minY = Math.min(y, endY, arrowY1, arrowY2);
  const maxX = Math.max(x, endX, arrowX1, arrowX2);
  const maxY = Math.max(y, endY, arrowY1, arrowY2);
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
      { type: "beginPath" },
      { type: "moveTo", x: normalizedEndX, y: normalizedEndY },
      { type: "lineTo", x: normalizedArrowX1, y: normalizedArrowY1 },
      { type: "lineTo", x: normalizedArrowX2, y: normalizedArrowY2 },
      { type: "closePath" },
      { type: "fill" },
    ],
  };
}

// ---------------------------------------------------------------------------
// Schema 1: Shape test
// Purpose: Rectangles, circles (arc), triangles (lines), star, heart (bezier),
//   smiley (multiple arcs), rotated rect, shadow, quadratic curves, dashed line,
//   multiple shapes in one layer. Output: shape-test.png
// ---------------------------------------------------------------------------
const shapeTestSchema: RenderData = {
  id: "shape-test",
  width: 800,
  height: 1200,
  layers: [
    {
      id: "rect1",
      type: RendererType.SHAPE,
      x: 50,
      y: 50,
      width: 200,
      height: 150,
      style: { fillStyle: "#3498db", strokeStyle: "#2980b9", lineWidth: 3 },
      shapes: [
        { type: "fillRect", x: 0, y: 0, width: 200, height: 150 },
        { type: "strokeRect", x: 0, y: 0, width: 200, height: 150 },
      ],
    } as ShapeRenderData,
    {
      id: "circle1",
      type: RendererType.SHAPE,
      x: 300,
      y: 50,
      width: 150,
      height: 150,
      style: { fillStyle: "#e74c3c", strokeStyle: "#c0392b", lineWidth: 2 },
      shapes: [
        { type: "beginPath" },
        { type: "arc", x: 75, y: 75, radius: 70, startAngle: 0, endAngle: Math.PI * 2, counterclockwise: false },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,
    {
      id: "triangle1",
      type: RendererType.SHAPE,
      x: 500,
      y: 50,
      width: 200,
      height: 200,
      style: { fillStyle: "#2ecc71", strokeStyle: "#27ae60", lineWidth: 4 },
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 100, y: 0 },
        { type: "lineTo", x: 200, y: 200 },
        { type: "lineTo", x: 0, y: 200 },
        { type: "closePath" },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,
    {
      id: "star1",
      type: RendererType.SHAPE,
      x: 50,
      y: 250,
      width: 200,
      height: 200,
      style: { fillStyle: "#f39c12", strokeStyle: "#e67e22", lineWidth: 2 },
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 100, y: 0 },
        { type: "lineTo", x: 120, y: 70 },
        { type: "lineTo", x: 200, y: 70 },
        { type: "lineTo", x: 135, y: 115 },
        { type: "lineTo", x: 160, y: 200 },
        { type: "lineTo", x: 100, y: 150 },
        { type: "lineTo", x: 40, y: 200 },
        { type: "lineTo", x: 65, y: 115 },
        { type: "lineTo", x: 0, y: 70 },
        { type: "lineTo", x: 80, y: 70 },
        { type: "closePath" },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,
    {
      id: "heart1",
      type: RendererType.SHAPE,
      x: 300,
      y: 250,
      width: 200,
      height: 180,
      style: { fillStyle: "#e91e63", strokeStyle: "#c2185b", lineWidth: 2 },
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 100, y: 60 },
        { type: "bezierCurveTo", cp1x: 100, cp1y: 30, cp2x: 50, cp2y: 30, x: 50, y: 60 },
        { type: "bezierCurveTo", cp1x: 50, cp1y: 100, cp2x: 100, cp2y: 140, x: 100, y: 180 },
        { type: "bezierCurveTo", cp1x: 100, cp1y: 140, cp2x: 150, cp2y: 100, x: 150, y: 60 },
        { type: "bezierCurveTo", cp1x: 150, cp1y: 30, cp2x: 100, cp2y: 30, x: 100, y: 60 },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,
    {
      id: "smiley1",
      type: RendererType.SHAPE,
      x: 550,
      y: 250,
      width: 200,
      height: 200,
      style: { fillStyle: "#ffeb3b", strokeStyle: "#fbc02d", lineWidth: 3 },
      shapes: [
        { type: "beginPath" },
        { type: "arc", x: 100, y: 100, radius: 80, startAngle: 0, endAngle: Math.PI * 2, counterclockwise: false },
        { type: "fill" },
        { type: "stroke" },
        { type: "beginPath" },
        { type: "arc", x: 70, y: 80, radius: 10, startAngle: 0, endAngle: Math.PI * 2, counterclockwise: false },
        { type: "fill" },
        { type: "beginPath" },
        { type: "arc", x: 130, y: 80, radius: 10, startAngle: 0, endAngle: Math.PI * 2, counterclockwise: false },
        { type: "fill" },
        { type: "beginPath" },
        { type: "arc", x: 100, y: 100, radius: 50, startAngle: 0, endAngle: Math.PI, counterclockwise: false },
        { type: "stroke" },
      ],
    } as ShapeRenderData,
    {
      id: "rotated-rect",
      type: RendererType.SHAPE,
      x: 50,
      y: 500,
      width: 150,
      height: 100,
      rotate: 45,
      style: { fillStyle: "#9b59b6", strokeStyle: "#8e44ad", lineWidth: 2 },
      shapes: [
        { type: "fillRect", x: 0, y: 0, width: 150, height: 100 },
        { type: "strokeRect", x: 0, y: 0, width: 150, height: 100 },
      ],
    } as ShapeRenderData,
    {
      id: "shadow-shape",
      type: RendererType.SHAPE,
      x: 250,
      y: 500,
      width: 150,
      height: 150,
      style: { fillStyle: "#16a085", strokeStyle: "#138d75", lineWidth: 2 },
      shadow: { color: "rgba(0, 0, 0, 0.5)", blur: 10, X: 5, Y: 5 },
      shapes: [
        { type: "beginPath" },
        { type: "arc", x: 75, y: 75, radius: 60, startAngle: 0, endAngle: Math.PI * 2, counterclockwise: false },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,
    {
      id: "curve-shape",
      type: RendererType.SHAPE,
      x: 450,
      y: 500,
      width: 200,
      height: 150,
      style: { fillStyle: "#34495e", strokeStyle: "#2c3e50", lineWidth: 3, lineCap: "round", lineJoin: "round" },
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 0, y: 75 },
        { type: "quadraticCurveTo", cp1x: 50, cp1y: 0, x: 100, y: 75 },
        { type: "quadraticCurveTo", cp1x: 150, cp1y: 150, x: 200, y: 75 },
        { type: "stroke" },
      ],
    } as ShapeRenderData,
    {
      id: "dashed-rect",
      type: RendererType.SHAPE,
      x: 50,
      y: 700,
      width: 200,
      height: 150,
      style: { strokeStyle: "#e74c3c", lineWidth: 4, lineDash: [10, 5], lineDashOffset: 0 },
      shapes: [{ type: "strokeRect", x: 0, y: 0, width: 200, height: 150 }],
    } as ShapeRenderData,
    {
      id: "multi-shape",
      type: RendererType.SHAPE,
      x: 300,
      y: 700,
      width: 300,
      height: 200,
      style: { fillStyle: "#95a5a6", strokeStyle: "#7f8c8d", lineWidth: 2 },
      shapes: [
        { type: "fillRect", x: 0, y: 0, width: 300, height: 200 },
        { type: "beginPath" },
        { type: "arc", x: 75, y: 75, radius: 50, startAngle: 0, endAngle: Math.PI * 2, counterclockwise: false },
        { type: "fill" },
        { type: "fillRect", x: 150, y: 25, width: 100, height: 100 },
        { type: "beginPath" },
        { type: "moveTo", x: 275, y: 25 },
        { type: "lineTo", x: 300, y: 125 },
        { type: "lineTo", x: 250, y: 125 },
        { type: "closePath" },
        { type: "fill" },
      ],
    } as ShapeRenderData,
  ],
  output: { type: "png" },
};

// ---------------------------------------------------------------------------
// Schema 2: Arrow test
// Purpose: Directional arrows (createArrow), curved arrow, circles/rects/triangles,
//   arrows pointing to shapes, flow diagram. Output: arrow-test.png
// ---------------------------------------------------------------------------
const arrowTestSchema: RenderData = {
  id: "arrow-test",
  width: 800,
  height: 600,
  layers: [
    createArrow("arrow1", 50, 100, 200, 100, 25),
    createArrow("arrow2", 250, 50, 250, 200, 25),
    createArrow("arrow3", 50, 300, 200, 200, 30),
    createArrow("arrow4", 50, 400, 200, 500, 30),
    {
      id: "curved-arrow",
      type: RendererType.SHAPE,
      x: 300,
      y: 100,
      width: 200,
      height: 200,
      style: { strokeStyle: "#000000", fillStyle: "#000000", lineWidth: 3, lineCap: "round" },
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 0, y: 0 },
        { type: "bezierCurveTo", cp1x: 50, cp1y: 0, cp2x: 150, cp2y: 200, x: 200, y: 200 },
        { type: "stroke" },
        { type: "beginPath" },
        { type: "moveTo", x: 200, y: 200 },
        { type: "lineTo", x: 180, y: 185 },
        { type: "lineTo", x: 185, y: 195 },
        { type: "closePath" },
        { type: "fill" },
      ],
    } as ShapeRenderData,
    {
      id: "circle1",
      type: RendererType.SHAPE,
      x: 550,
      y: 50,
      width: 100,
      height: 100,
      style: { fillStyle: "#000000", strokeStyle: "#000000", lineWidth: 2 },
      shapes: [
        { type: "beginPath" },
        { type: "arc", x: 50, y: 50, radius: 45, startAngle: 0, endAngle: Math.PI * 2, counterclockwise: false },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,
    {
      id: "rect1",
      type: RendererType.SHAPE,
      x: 550,
      y: 200,
      width: 150,
      height: 100,
      style: { fillStyle: "#000000", strokeStyle: "#000000", lineWidth: 2 },
      shapes: [
        { type: "fillRect", x: 0, y: 0, width: 150, height: 100 },
        { type: "strokeRect", x: 0, y: 0, width: 150, height: 100 },
      ],
    } as ShapeRenderData,
    {
      id: "triangle1",
      type: RendererType.SHAPE,
      x: 550,
      y: 350,
      width: 150,
      height: 150,
      style: { fillStyle: "#000000", strokeStyle: "#000000", lineWidth: 2 },
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 75, y: 0 },
        { type: "lineTo", x: 150, y: 150 },
        { type: "lineTo", x: 0, y: 150 },
        { type: "closePath" },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,
    createArrow("arrow-to-circle", 300, 350, 550, 100, 30),
    createArrow("arrow-to-rect", 300, 400, 550, 250, 30),
    createArrow("arrow-to-triangle", 300, 450, 550, 425, 30),
    createArrow("flow1", 50, 550, 150, 550, 20),
    createArrow("flow2", 150, 550, 250, 550, 20),
    createArrow("flow3", 250, 550, 350, 550, 20),
    createArrow("flow4", 350, 550, 450, 550, 20),
  ],
  output: { type: "png" },
};

// ---------------------------------------------------------------------------
// Schema 3: Canvas-1 test
// Purpose: Minimal agent-style layout: circle + square + arrow line, with
//   per-command style (fillStyle/strokeStyle on fill/stroke commands). Output: canvas-1-test.png
// ---------------------------------------------------------------------------
const canvas1Schema: RenderData = {
  id: "canvas-1",
  width: 400,
  height: 300,
  layers: [
    {
      id: "circle",
      type: "shape",
      x: 120,
      y: 150,
      shapes: [
        { type: "beginPath" },
        { type: "arc", x: 0, y: 0, radius: 40, startAngle: 0, endAngle: 6.283185307179586, counterclockwise: false },
        { type: "closePath" },
        { type: "fill", style: { fillStyle: "#4A90D9" } },
      ],
    },
    {
      id: "square",
      type: "shape",
      x: 280,
      y: 150,
      shapes: [
        { type: "beginPath" },
        { type: "rect", x: -40, y: -40, width: 80, height: 80 },
        { type: "closePath" },
        { type: "fill", style: { fillStyle: "#4A90D9" } },
      ],
    },
    {
      id: "arrow-line",
      type: "shape",
      x: 0,
      y: 0,
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 160, y: 150 },
        { type: "lineTo", x: 240, y: 150 },
        { type: "stroke", style: { strokeStyle: "#333333", lineWidth: 3 } },
        { type: "beginPath" },
        { type: "moveTo", x: 240, y: 150 },
        { type: "lineTo", x: 230, y: 140 },
        { type: "lineTo", x: 230, y: 160 },
        { type: "closePath" },
        { type: "fill", style: { strokeStyle: "#333333", lineWidth: 3 } },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Run all tests: render each schema and write to output/<name>.png
// ---------------------------------------------------------------------------
const TESTS: { name: string; schema: RenderData }[] = [
  { name: "shape-test", schema: shapeTestSchema },
  { name: "arrow-test", schema: arrowTestSchema },
  { name: "canvas-1-test", schema: canvas1Schema },
];

async function main() {
  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const { name, schema } of TESTS) {
    try {
      const renderer = new Renderer(schema);
      const buffer = await renderer.draw();
      const outputPath = path.join(outputDir, `${name}.png`);
      fs.writeFileSync(outputPath, buffer);
      console.log(`Rendered: ${outputPath}`);
    } catch (error) {
      console.error(`Error rendering ${name}:`, error);
      if (error instanceof Error) console.error(error.stack);
      process.exit(1);
    }
  }

  console.log("All tests passed.");
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
