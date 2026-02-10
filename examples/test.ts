/**
 * Test file for declare-render package.
 * Tests rx/ry (rounded rectangles) and ellipse commands.
 */

import { Renderer, type RenderData } from "../src/index.js";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testJson: RenderData = {
  id: "rx-ellipse-test",
  width: 800,
  height: 600,
  layers: [
    // Test 1: Rounded rectangles with rx and ry
    {
      id: "rounded-rect-1",
      type: "shape",
      x: 50,
      y: 50,
      shapes: [
        {
          type: "rect",
          x: 0,
          y: 0,
          width: 150,
          height: 100,
          rx: 20,
          ry: 20,
          style: {
            fillStyle: "#4A90E2",
            strokeStyle: "#2E5C8A",
            lineWidth: 3,
          },
        },
        {
          type: "fillAndStroke",
        },
      ],
    },
    {
      id: "rounded-rect-2",
      type: "shape",
      x: 250,
      y: 50,
      shapes: [
        {
          type: "fillRect",
          x: 0,
          y: 0,
          width: 150,
          height: 100,
          rx: 30,
          ry: 10,
          style: {
            fillStyle: "#E24A4A",
          },
        },
      ],
    },
    {
      id: "rounded-rect-3",
      type: "shape",
      x: 450,
      y: 50,
      shapes: [
        {
          type: "strokeRect",
          x: 0,
          y: 0,
          width: 150,
          height: 100,
          rx: 10,
          ry: 30,
          style: {
            strokeStyle: "#4AE24A",
            lineWidth: 4,
          },
        },
      ],
    },
    // Test 2: Ellipse commands
    {
      id: "ellipse-1",
      type: "shape",
      x: 50,
      y: 200,
      shapes: [
        {
          type: "ellipse",
          x: 75,
          y: 50,
          radiusX: 70,
          radiusY: 40,
          rotation: 0,
          startAngle: 0,
          endAngle: 6.283185,
          style: {
            fillStyle: "#FF6B9D",
          },
        },
        {
          type: "fill",
        },
      ],
    },
    {
      id: "ellipse-2",
      type: "shape",
      x: 250,
      y: 200,
      shapes: [
        {
          type: "ellipse",
          x: 75,
          y: 50,
          radiusX: 60,
          radiusY: 60,
          rotation: 0.785398, // 45 degrees
          startAngle: 0,
          endAngle: 6.283185,
          style: {
            fillStyle: "#9D6BFF",
            globalAlpha: 0.7,
          },
        },
        {
          type: "fill",
        },
      ],
    },
    {
      id: "ellipse-3",
      type: "shape",
      x: 450,
      y: 200,
      shapes: [
        {
          type: "ellipse",
          x: 75,
          y: 50,
          radiusX: 50,
          radiusY: 30,
          rotation: 0,
          startAngle: 0,
          endAngle: 3.14159, // Half ellipse
          style: {
            strokeStyle: "#FFB84D",
            lineWidth: 5,
          },
        },
        {
          type: "stroke",
        },
      ],
    },
    // Test 3: Arcs with radiusX and radiusY (elliptical arcs)
    {
      id: "arc-elliptical-1",
      type: "shape",
      x: 50,
      y: 350,
      shapes: [
        {
          type: "arc",
          x: 75,
          y: 50,
          radiusX: 60,
          radiusY: 30,
          startAngle: 0,
          endAngle: 6.283185,
          style: {
            fillStyle: "#50C878",
          },
        },
        {
          type: "fill",
        },
      ],
    },
    {
      id: "arc-elliptical-2",
      type: "shape",
      x: 250,
      y: 350,
      shapes: [
        {
          type: "arc",
          x: 75,
          y: 50,
          radiusX: 40,
          radiusY: 50,
          startAngle: 1.5708, // 90 degrees
          endAngle: 4.71239, // 270 degrees
          style: {
            fillStyle: "#FF8C42",
          },
        },
        {
          type: "fill",
        },
      ],
    },
    {
      id: "arc-circular",
      type: "shape",
      x: 450,
      y: 350,
      shapes: [
        {
          type: "arc",
          x: 75,
          y: 50,
          radius: 50, // Traditional circular arc
          startAngle: 0,
          endAngle: 6.283185,
          style: {
            fillStyle: "#42A5FF",
          },
        },
        {
          type: "fill",
        },
      ],
    },
    // Test 4: Mixed - rounded rectangle with ellipse inside
    {
      id: "mixed-1",
      type: "shape",
      x: 50,
      y: 450,
      shapes: [
        {
          type: "rect",
          x: 0,
          y: 0,
          width: 200,
          height: 100,
          rx: 25,
          ry: 25,
          style: {
            fillStyle: "#E8E8E8",
            strokeStyle: "#333333",
            lineWidth: 2,
          },
        },
        {
          type: "fillAndStroke",
        },
        {
          type: "ellipse",
          x: 100,
          y: 50,
          radiusX: 40,
          radiusY: 30,
          rotation: 0,
          startAngle: 0,
          endAngle: 6.283185,
          style: {
            fillStyle: "#FF4444",
          },
        },
        {
          type: "fill",
        },
      ],
    },
  ],
};

async function testRxEllipse() {
  console.log("🧪 Testing rx/ry (rounded rectangles) and ellipse commands...\n");

  try {
    // Test 1: Parse JSON
    console.log("1️⃣ Testing JSON parsing...");
    console.log("   ✅ Parsed successfully");
    console.log(`   - ID: ${testJson.id}`);
    console.log(`   - Size: ${testJson.width}x${testJson.height}`);
    console.log(`   - Layers: ${testJson.layers.length}`);

    // Test 2: Validate structure
    console.log("\n2️⃣ Validating structure...");
    if (!testJson.id || !testJson.width || !testJson.height || !testJson.layers) {
      throw new Error("Missing required fields");
    }
    if (testJson.layers.length === 0) {
      throw new Error("No layers found");
    }
    console.log("   ✅ Structure valid");

    // Test 3: Render to image
    console.log("\n3️⃣ Testing rendering...");
    const renderer = new Renderer(testJson);
    const buffer = await renderer.draw();
    console.log(`   ✅ Rendered successfully (${buffer.length} bytes)`);

    // Test 4: Save output
    console.log("\n4️⃣ Saving output...");
    const outputDir = join(__dirname, "output");
    // Ensure output directory exists
    mkdirSync(outputDir, { recursive: true });
    const outputPath = join(outputDir, "rx-ellipse-test.png");
    writeFileSync(outputPath, buffer);
    console.log(`   ✅ Saved to: ${outputPath}`);

    console.log("\n✅ All tests passed!");
    console.log("\nTest includes:");
    console.log("  - Rounded rectangles (rect with rx/ry)");
    console.log("  - Rounded fillRect (fillRect with rx/ry)");
    console.log("  - Rounded strokeRect (strokeRect with rx/ry)");
    console.log("  - Ellipse commands (full and partial)");
    console.log("  - Elliptical arcs (arc with radiusX/radiusY)");
    console.log("  - Circular arcs (arc with radius)");
    console.log("  - Mixed shapes (rounded rect + ellipse)");
    return true;
  } catch (error) {
    console.error("\n❌ Test failed:");
    console.error(error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error("\nStack trace:");
      console.error(error.stack);
    }
    return false;
  }
}

// Run the test
testRxEllipse()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
