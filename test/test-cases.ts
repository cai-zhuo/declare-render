/**
 * Shared test case data for Node.js and browser tests.
 * Covers text, image, container, and shape renderers with real-world samples.
 */

import type { RenderData } from "../src/types.js";

const TAU = 2 * Math.PI;

// ----- 1. Process Flowchart: Start → Process → Decision → Process → End -----

export const processFlowchartData: RenderData = {
  id: "process-flowchart",
  width: 620,
  height: 280,
  layers: [
    // Start node (ellipse + text)
    {
      id: "start-shape",
      type: "shape",
      x: 30,
      y: 100,
      shapes: [
        {
          type: "ellipse",
          x: 45,
          y: 40,
          radiusX: 45,
          radiusY: 35,
          rotation: 0,
          startAngle: 0,
          endAngle: TAU,
          style: { fillStyle: "#E8F5E9", strokeStyle: "#2E7D32", lineWidth: 2 },
        },
        { type: "fillAndStroke" },
      ],
    },
    {
      id: "start-text",
      type: "text",
      x: 30,
      y: 107,
      width: 90,
      height: 66,
      content: "Start",
      style: {
        fontName: "sans-serif",
        fontSize: 16,
        color: "#1B5E20",
        align: "center",
        verticalAlign: "center",
      },
    },
    // Arrow: Start → Process (line + arrowhead)
    {
      id: "arrow-1",
      type: "shape",
      x: 0,
      y: 0,
      shapes: [
        { type: "moveTo", x: 120, y: 135 },
        { type: "lineTo", x: 160, y: 135 },
        {
          type: "stroke",
          style: { strokeStyle: "#1a1a1a", lineWidth: 3, lineCap: "round", lineJoin: "round" },
        },
        { type: "moveTo", x: 165, y: 135 },
        { type: "lineTo", x: 155, y: 130 },
        { type: "lineTo", x: 155, y: 140 },
        { type: "closePath" },
        { type: "fill", style: { fillStyle: "#1a1a1a" } },
      ],
    },
    // Process 1
    {
      id: "process1-shape",
      type: "shape",
      x: 165,
      y: 105,
      shapes: [
        {
          type: "rect",
          x: 0,
          y: 0,
          width: 100,
          height: 60,
          rx: 6,
          ry: 6,
          style: { fillStyle: "#E3F2FD", strokeStyle: "#1565C0", lineWidth: 2 },
        },
        { type: "fillAndStroke" },
      ],
    },
    {
      id: "process1-text",
      type: "text",
      x: 165,
      y: 105,
      width: 100,
      height: 60,
      content: "Process 1",
      style: {
        fontName: "sans-serif",
        fontSize: 14,
        color: "#0D47A1",
        align: "center",
        verticalAlign: "center",
      },
    },
    // Arrow: Process → Decision (line + arrowhead)
    {
      id: "arrow-2",
      type: "shape",
      x: 0,
      y: 0,
      shapes: [
        { type: "moveTo", x: 265, y: 135 },
        { type: "lineTo", x: 288, y: 135 },
        {
          type: "stroke",
          style: { strokeStyle: "#1a1a1a", lineWidth: 3, lineCap: "round", lineJoin: "round" },
        },
        { type: "moveTo", x: 295, y: 135 },
        { type: "lineTo", x: 285, y: 130 },
        { type: "lineTo", x: 285, y: 140 },
        { type: "closePath" },
        { type: "fill", style: { fillStyle: "#1a1a1a" } },
      ],
    },
    // Decision diamond
    {
      id: "decision-shape",
      type: "shape",
      x: 295,
      y: 95,
      shapes: [
        { type: "moveTo", x: 35, y: 0 },
        { type: "lineTo", x: 70, y: 40 },
        { type: "lineTo", x: 35, y: 80 },
        { type: "lineTo", x: 0, y: 40 },
        { type: "closePath" },
        {
          type: "fillAndStroke",
          style: { fillStyle: "#FFF3E0", strokeStyle: "#E65100", lineWidth: 2 },
        },
      ],
    },
    {
      id: "decision-text",
      type: "text",
      x: 295,
      y: 95,
      width: 70,
      height: 80,
      content: "Decision?",
      style: {
        fontName: "sans-serif",
        fontSize: 12,
        color: "#BF360C",
        align: "center",
        verticalAlign: "center",
      },
    },
    // Arrow: Decision → Process 2 (line + arrowhead)
    {
      id: "arrow-3",
      type: "shape",
      x: 0,
      y: 0,
      shapes: [
        { type: "moveTo", x: 395, y: 135 },
        { type: "lineTo", x: 418, y: 135 },
        {
          type: "stroke",
          style: { strokeStyle: "#1a1a1a", lineWidth: 3, lineCap: "round", lineJoin: "round" },
        },
        { type: "moveTo", x: 425, y: 135 },
        { type: "lineTo", x: 415, y: 130 },
        { type: "lineTo", x: 415, y: 140 },
        { type: "closePath" },
        { type: "fill", style: { fillStyle: "#1a1a1a" } },
      ],
    },
    // Process 2
    {
      id: "process2-shape",
      type: "shape",
      x: 425,
      y: 105,
      shapes: [
        {
          type: "rect",
          x: 0,
          y: 0,
          width: 100,
          height: 60,
          rx: 6,
          ry: 6,
          style: { fillStyle: "#E3F2FD", strokeStyle: "#1565C0", lineWidth: 2 },
        },
        { type: "fillAndStroke" },
      ],
    },
    {
      id: "process2-text",
      type: "text",
      x: 425,
      y: 105,
      width: 100,
      height: 60,
      content: "Process 2",
      style: {
        fontName: "sans-serif",
        fontSize: 14,
        color: "#0D47A1",
        align: "center",
        verticalAlign: "center",
      },
    },
    // Arrow: Process 2 → End (line + arrowhead)
    {
      id: "arrow-4",
      type: "shape",
      x: 0,
      y: 0,
      shapes: [
        { type: "moveTo", x: 525, y: 135 },
        { type: "lineTo", x: 548, y: 135 },
        {
          type: "stroke",
          style: { strokeStyle: "#1a1a1a", lineWidth: 3, lineCap: "round", lineJoin: "round" },
        },
        { type: "moveTo", x: 555, y: 135 },
        { type: "lineTo", x: 545, y: 130 },
        { type: "lineTo", x: 545, y: 140 },
        { type: "closePath" },
        { type: "fill", style: { fillStyle: "#1a1a1a" } },
      ],
    },
    // End node
    {
      id: "end-shape",
      type: "shape",
      x: 555,
      y: 100,
      shapes: [
        {
          type: "ellipse",
          x: 32,
          y: 40,
          radiusX: 32,
          radiusY: 35,
          rotation: 0,
          startAngle: 0,
          endAngle: TAU,
          style: { fillStyle: "#FFEBEE", strokeStyle: "#C62828", lineWidth: 2 },
        },
        { type: "fillAndStroke" },
      ],
    },
    {
      id: "end-text",
      type: "text",
      x: 555,
      y: 100,
      width: 65,
      height: 70,
      content: "End",
      style: {
        fontName: "sans-serif",
        fontSize: 14,
        color: "#B71C1C",
        align: "center",
        verticalAlign: "center",
      },
    },
  ],
};

// ----- 2. Knowledge Card (Infographic) -----

export const knowledgeCardData: RenderData = {
  id: "knowledge-card",
  width: 360,
  height: 240,
  layers: [
    {
      id: "card",
      type: "container",
      x: 20,
      y: 20,
      width: 320,
      height: 200,
      direction: "column",
      gap: 12,
      layers: [
        // Header row: icon + title (flex flow: undefined x,y triggers flow layout)
        {
          id: "header",
          type: "container",
          x: 0,
          y: 0,
          width: 280,
          height: 36,
          direction: "row",
          gap: 12,
          itemAlign: "center",
          layers: [
            {
              id: "icon",
              type: "img",
              x: undefined!,
              y: undefined!,
              width: 32,
              height: 32,
              color: "#5C6BC0",
              objectFit: "contain",
              radius: 8,
            },
            {
              id: "title",
              type: "text",
              x: undefined!,
              y: undefined!,
              width: 220,
              height: 36,
              content: "Machine Learning",
              style: {
                fontName: "sans-serif",
                fontSize: 18,
                color: "#1A237E",
                fontWeight: "bold",
              },
            },
          ],
        },
        // Body text (flex flow)
        {
          id: "body",
          type: "text",
          x: undefined!,
          y: undefined!,
          width: 280,
          height: 80,
          content:
            "Supervised learning uses labeled data to train models. The algorithm learns from input-output pairs and generalizes to new examples.",
          style: {
            fontName: "sans-serif",
            fontSize: 13,
            color: "#37474F",
            verticalGap: 4,
          },
        },
        // Diagram area: center node (ellipse) (flex flow)
        {
          id: "diagram",
          type: "shape",
          x: undefined!,
          y: undefined!,
          shapes: [
            {
              type: "ellipse",
              x: 140,
              y: 50,
              radiusX: 20,
              radiusY: 20,
              rotation: 0,
              startAngle: 0,
              endAngle: TAU,
              style: { fillStyle: "#7986CB", strokeStyle: "#3F51B5", lineWidth: 2 },
            },
            { type: "fillAndStroke" },
          ],
        },
      ],
    },
    // Card border
    {
      id: "card-border",
      type: "shape",
      x: 18,
      y: 18,
      shapes: [
        {
          type: "rect",
          x: 0,
          y: 0,
          width: 324,
          height: 204,
          rx: 12,
          ry: 12,
          style: { strokeStyle: "#B0BEC5", lineWidth: 2 },
        },
        { type: "stroke" },
      ],
    },
  ],
};

// ----- 3. Image Renderer Tests -----

/** 1x1 transparent PNG as data URI for tests that need a real image */
const TINY_PNG_DATA_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export const imageRendererData: RenderData = {
  id: "image-test",
  width: 400,
  height: 200,
  layers: [
    // Color placeholder (no url)
    {
      id: "color-placeholder",
      type: "img",
      x: 20,
      y: 20,
      width: 100,
      height: 80,
      color: "#E0E0E0",
      objectFit: "contain",
      radius: 8,
    },
    // Image with url (data URI), objectFit contain
    {
      id: "img-contain",
      type: "img",
      x: 140,
      y: 20,
      width: 100,
      height: 80,
      url: TINY_PNG_DATA_URI,
      objectFit: "contain",
      radius: 4,
    },
    // Image with rotation
    {
      id: "img-rotate",
      type: "img",
      x: 260,
      y: 20,
      width: 80,
      height: 80,
      color: "#BBDEFB",
      objectFit: "contain",
      radius: 40,
      rotate: 15,
    },
    // Label
    {
      id: "img-label",
      type: "text",
      x: 20,
      y: 120,
      width: 360,
      height: 60,
      content: "Image renderer: color placeholder, data URI, rotated circle",
      style: {
        fontName: "sans-serif",
        fontSize: 14,
        color: "#546E7A",
      },
    },
  ],
};

// ----- 4. Shape Sanity Check -----

export const shapeSanityData: RenderData = {
  id: "shape-sanity",
  width: 400,
  height: 320,
  layers: [
    {
      id: "rounded-rect",
      type: "shape",
      x: 20,
      y: 20,
      shapes: [
        {
          type: "fillRect",
          x: 0,
          y: 0,
          width: 100,
          height: 60,
          rx: 12,
          ry: 12,
          style: { fillStyle: "#4CAF50" },
        },
      ],
    },
    {
      id: "ellipse",
      type: "shape",
      x: 140,
      y: 20,
      shapes: [
        {
          type: "ellipse",
          x: 50,
          y: 30,
          radiusX: 45,
          radiusY: 25,
          rotation: 0,
          startAngle: 0,
          endAngle: TAU,
          style: { fillStyle: "#2196F3", globalAlpha: 0.7 },
        },
        { type: "fill" },
      ],
    },
    {
      id: "arc",
      type: "shape",
      x: 260,
      y: 20,
      shapes: [
        {
          type: "arc",
          x: 50,
          y: 30,
          radius: 40,
          startAngle: 0,
          endAngle: Math.PI * 1.5,
          style: { strokeStyle: "#FF9800", lineWidth: 4 },
        },
        { type: "stroke" },
      ],
    },
    {
      id: "path",
      type: "shape",
      x: 20,
      y: 120,
      shapes: [
        { type: "moveTo", x: 0, y: 40 },
        { type: "quadraticCurveTo", cp1x: 50, cp1y: 0, x: 100, y: 40 },
        {
          type: "stroke",
          style: { strokeStyle: "#9C27B0", lineWidth: 3 },
        },
      ],
    },
    // Curved arrows with arrowheads (arrowhead aligned to curve tangent at end)
    {
      id: "curved-arrow-1",
      type: "shape",
      x: 20,
      y: 120,
      shapes: [
        { type: "moveTo", x: 120, y: 20 },
        {
          type: "quadraticCurveTo",
          cp1x: 200,
          cp1y: 80,
          x: 250,
          y: 20,
          style: { strokeStyle: "#E91E63", lineWidth: 3 },
        },
        { type: "stroke" },
        // Tip extended forward to meet line end (stroke can extend past last point)
        { type: "moveTo", x: 252, y: 17 },
        { type: "lineTo", x: 240, y: 23 },
        { type: "lineTo", x: 249, y: 31 },
        { type: "closePath" },
        { type: "fill", style: { fillStyle: "#E91E63" } },
      ],
    },
    {
      id: "curved-arrow-2",
      type: "shape",
      x: 20,
      y: 120,
      shapes: [
        { type: "moveTo", x: 280, y: 100 },
        {
          type: "bezierCurveTo",
          cp1x: 350,
          cp1y: 60,
          cp2x: 320,
          cp2y: 140,
          x: 280,
          y: 120,
          style: { strokeStyle: "#00BCD4", lineWidth: 2 },
        },
        { type: "stroke" },
        // Tangent at end: curve flattens horizontally -> arrow points more left, less down
        { type: "moveTo", x: 280, y: 120 },
        { type: "lineTo", x: 293, y: 118 },
        { type: "lineTo", x: 291, y: 126 },
        { type: "closePath" },
        { type: "fill", style: { fillStyle: "#00BCD4" } },
      ],
    },
    {
      id: "label",
      type: "text",
      x: 20,
      y: 258,
      width: 360,
      height: 50,
      content: "Shape sanity: rect, ellipse (opacity), arc, path, curved arrows",
      style: {
        fontName: "sans-serif",
        fontSize: 14,
        color: "#455A64",
        verticalGap: 6,
      },
    },
  ],
};
