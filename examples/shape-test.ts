import { Renderer } from "../src/index";
import { RenderData, RendererType, type ShapeRenderData } from "../src/types";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test various canvas shapes
const shapeTestSchema: RenderData = {
  id: "shape-test",
  width: 800,
  height: 1200,
  layers: [
    // Rectangle shapes
    {
      id: "rect1",
      type: RendererType.SHAPE,
      x: 50,
      y: 50,
      width: 200,
      height: 150,
      style: {
        fillStyle: "#3498db",
        strokeStyle: "#2980b9",
        lineWidth: 3,
      },
      shapes: [
        { type: "fillRect", x: 0, y: 0, width: 200, height: 150 },
        { type: "strokeRect", x: 0, y: 0, width: 200, height: 150 },
      ],
    } as ShapeRenderData,

    // Circle using arc
    {
      id: "circle1",
      type: RendererType.SHAPE,
      x: 300,
      y: 50,
      width: 150,
      height: 150,
      style: {
        fillStyle: "#e74c3c",
        strokeStyle: "#c0392b",
        lineWidth: 2,
      },
      shapes: [
        { type: "beginPath" },
        {
          type: "arc",
          x: 75,
          y: 75,
          radius: 70,
          startAngle: 0,
          endAngle: Math.PI * 2,
          counterclockwise: false,
        },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,

    // Triangle using lines
    {
      id: "triangle1",
      type: RendererType.SHAPE,
      x: 500,
      y: 50,
      width: 200,
      height: 200,
      style: {
        fillStyle: "#2ecc71",
        strokeStyle: "#27ae60",
        lineWidth: 4,
      },
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 100, y: 0 },
        { type: "lineTo", x: 200, y: 200 },
        { type: "lineTo", x: 0, y: 200 },
        { type: "closePath" },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,

    // Star shape using lines
    {
      id: "star1",
      type: RendererType.SHAPE,
      x: 50,
      y: 250,
      width: 200,
      height: 200,
      style: {
        fillStyle: "#f39c12",
        strokeStyle: "#e67e22",
        lineWidth: 2,
      },
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

    // Heart shape using bezier curves
    {
      id: "heart1",
      type: RendererType.SHAPE,
      x: 300,
      y: 250,
      width: 200,
      height: 180,
      style: {
        fillStyle: "#e91e63",
        strokeStyle: "#c2185b",
        lineWidth: 2,
      },
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 100, y: 60 },
        {
          type: "bezierCurveTo",
          cp1x: 100,
          cp1y: 30,
          cp2x: 50,
          cp2y: 30,
          x: 50,
          y: 60,
        },
        {
          type: "bezierCurveTo",
          cp1x: 50,
          cp1y: 100,
          cp2x: 100,
          cp2y: 140,
          x: 100,
          y: 180,
        },
        {
          type: "bezierCurveTo",
          cp1x: 100,
          cp1y: 140,
          cp2x: 150,
          cp2y: 100,
          x: 150,
          y: 60,
        },
        {
          type: "bezierCurveTo",
          cp1x: 150,
          cp1y: 30,
          cp2x: 100,
          cp2y: 30,
          x: 100,
          y: 60,
        },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,

    // Smiley face using arcs
    {
      id: "smiley1",
      type: RendererType.SHAPE,
      x: 550,
      y: 250,
      width: 200,
      height: 200,
      style: {
        fillStyle: "#ffeb3b",
        strokeStyle: "#fbc02d",
        lineWidth: 3,
      },
      shapes: [
        { type: "beginPath" },
        {
          type: "arc",
          x: 100,
          y: 100,
          radius: 80,
          startAngle: 0,
          endAngle: Math.PI * 2,
          counterclockwise: false,
        },
        { type: "fill" },
        { type: "stroke" },
        // Left eye
        { type: "beginPath" },
        {
          type: "arc",
          x: 70,
          y: 80,
          radius: 10,
          startAngle: 0,
          endAngle: Math.PI * 2,
          counterclockwise: false,
        },
        { type: "fill" },
        // Right eye
        { type: "beginPath" },
        {
          type: "arc",
          x: 130,
          y: 80,
          radius: 10,
          startAngle: 0,
          endAngle: Math.PI * 2,
          counterclockwise: false,
        },
        { type: "fill" },
        // Mouth
        { type: "beginPath" },
        {
          type: "arc",
          x: 100,
          y: 100,
          radius: 50,
          startAngle: 0,
          endAngle: Math.PI,
          counterclockwise: false,
        },
        { type: "stroke" },
      ],
    } as ShapeRenderData,

    // Rotated rectangle
    {
      id: "rotated-rect",
      type: RendererType.SHAPE,
      x: 50,
      y: 500,
      width: 150,
      height: 100,
      rotate: 45,
      style: {
        fillStyle: "#9b59b6",
        strokeStyle: "#8e44ad",
        lineWidth: 2,
      },
      shapes: [
        { type: "fillRect", x: 0, y: 0, width: 150, height: 100 },
        { type: "strokeRect", x: 0, y: 0, width: 150, height: 100 },
      ],
    } as ShapeRenderData,

    // Shape with shadow
    {
      id: "shadow-shape",
      type: RendererType.SHAPE,
      x: 250,
      y: 500,
      width: 150,
      height: 150,
      style: {
        fillStyle: "#16a085",
        strokeStyle: "#138d75",
        lineWidth: 2,
      },
      shadow: {
        color: "rgba(0, 0, 0, 0.5)",
        blur: 10,
        X: 5,
        Y: 5,
      },
      shapes: [
        { type: "beginPath" },
        {
          type: "arc",
          x: 75,
          y: 75,
          radius: 60,
          startAngle: 0,
          endAngle: Math.PI * 2,
          counterclockwise: false,
        },
        { type: "fillAndStroke" },
      ],
    } as ShapeRenderData,

    // Complex path with quadratic curves
    {
      id: "curve-shape",
      type: RendererType.SHAPE,
      x: 450,
      y: 500,
      width: 200,
      height: 150,
      style: {
        fillStyle: "#34495e",
        strokeStyle: "#2c3e50",
        lineWidth: 3,
        lineCap: "round",
        lineJoin: "round",
      },
      shapes: [
        { type: "beginPath" },
        { type: "moveTo", x: 0, y: 75 },
        {
          type: "quadraticCurveTo",
          cp1x: 50,
          cp1y: 0,
          x: 100,
          y: 75,
        },
        {
          type: "quadraticCurveTo",
          cp1x: 150,
          cp1y: 150,
          x: 200,
          y: 75,
        },
        { type: "stroke" },
      ],
    } as ShapeRenderData,

    // Dashed line rectangle
    {
      id: "dashed-rect",
      type: RendererType.SHAPE,
      x: 50,
      y: 700,
      width: 200,
      height: 150,
      style: {
        strokeStyle: "#e74c3c",
        lineWidth: 4,
        lineDash: [10, 5],
        lineDashOffset: 0,
      },
      shapes: [
        { type: "strokeRect", x: 0, y: 0, width: 200, height: 150 },
      ],
    } as ShapeRenderData,

    // Multiple shapes in one renderer (same style)
    {
      id: "multi-shape",
      type: RendererType.SHAPE,
      x: 300,
      y: 700,
      width: 300,
      height: 200,
      style: {
        fillStyle: "#95a5a6",
        strokeStyle: "#7f8c8d",
        lineWidth: 2,
      },
      shapes: [
        // Background rectangle
        { type: "fillRect", x: 0, y: 0, width: 300, height: 200 },
        // Circle
        { type: "beginPath" },
        {
          type: "arc",
          x: 75,
          y: 75,
          radius: 50,
          startAngle: 0,
          endAngle: Math.PI * 2,
          counterclockwise: false,
        },
        { type: "fill" },
        // Square
        { type: "fillRect", x: 150, y: 25, width: 100, height: 100 },
        // Triangle
        { type: "beginPath" },
        { type: "moveTo", x: 275, y: 25 },
        { type: "lineTo", x: 300, y: 125 },
        { type: "lineTo", x: 250, y: 125 },
        { type: "closePath" },
        { type: "fill" },
      ],
    } as ShapeRenderData,
  ],
  output: {
    type: "png",
  },
};

async function main() {
  try {
    const renderer = new Renderer(shapeTestSchema);
    const buffer = await renderer.draw();
    const outputPath = path.join(__dirname, "output", "shape-test.png");
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, buffer);
    console.log(`Shape test rendered successfully: ${outputPath}`);
  } catch (error) {
    console.error("Error rendering shape test:", error);
    process.exit(1);
  }
}

main();
