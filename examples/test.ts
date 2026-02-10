/**
 * Test file for declare-render package.
 * Tests parsing and rendering of RenderData JSON (Mickey Mouse avatar example).
 */

import { Renderer, type RenderData } from "../src/index.js";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mickeyMouseJson = `{
  "id": "mickey-mouse-avatar",
  "width": 1400,
  "height": 1400,
  "layers": [
    {
      "id": "left-ear",
      "type": "shape",
      "x": 0,
      "y": 0,
      "shapes": [
        {
          "type": "arc",
          "x": 100,
          "y": 100,
          "radius": 55,
          "startAngle": 0,
          "endAngle": 6.283185,
          "style": {
            "fillStyle": "#1a1a1a"
          }
        },
        {
          "type": "fill"
        }
      ]
    },
    {
      "id": "right-ear",
      "type": "shape",
      "x": 0,
      "y": 0,
      "shapes": [
        {
          "type": "arc",
          "x": 300,
          "y": 100,
          "radius": 55,
          "startAngle": 0,
          "endAngle": 6.283185,
          "style": {
            "fillStyle": "#1a1a1a"
          }
        },
        {
          "type": "fill"
        }
      ]
    },
    {
      "id": "head",
      "type": "shape",
      "x": 0,
      "y": 0,
      "shapes": [
        {
          "type": "arc",
          "x": 200,
          "y": 220,
          "radius": 100,
          "startAngle": 0,
          "endAngle": 6.283185,
          "style": {
            "fillStyle": "#1a1a1a"
          }
        },
        {
          "type": "fill"
        }
      ]
    },
    {
      "id": "left-eye",
      "type": "shape",
      "x": 0,
      "y": 0,
      "shapes": [
        {
          "type": "arc",
          "x": 165,
          "y": 180,
          "radius": 28.5,
          "startAngle": 0,
          "endAngle": 6.283185,
          "style": {
            "fillStyle": "#ffffff"
          }
        },
        {
          "type": "fill"
        },
        {
          "type": "arc",
          "x": 165,
          "y": 185,
          "radius": 13.5,
          "startAngle": 0,
          "endAngle": 6.283185,
          "style": {
            "fillStyle": "#000000"
          }
        },
        {
          "type": "fill"
        }
      ]
    },
    {
      "id": "right-eye",
      "type": "shape",
      "x": 0,
      "y": 0,
      "shapes": [
        {
          "type": "arc",
          "x": 235,
          "y": 180,
          "radius": 28.5,
          "startAngle": 0,
          "endAngle": 6.283185,
          "style": {
            "fillStyle": "#ffffff"
          }
        },
        {
          "type": "fill"
        },
        {
          "type": "arc",
          "x": 235,
          "y": 185,
          "radius": 13.5,
          "startAngle": 0,
          "endAngle": 6.283185,
          "style": {
            "fillStyle": "#000000"
          }
        },
        {
          "type": "fill"
        }
      ]
    },
    {
      "id": "nose",
      "type": "shape",
      "x": 0,
      "y": 0,
      "shapes": [
        {
          "type": "arc",
          "x": 200,
          "y": 225,
          "radius": 27.5,
          "startAngle": 0,
          "endAngle": 6.283185,
          "style": {
            "fillStyle": "#e63946"
          }
        },
        {
          "type": "fill"
        }
      ]
    },
    {
      "id": "mouth",
      "type": "shape",
      "x": 0,
      "y": 0,
      "shapes": [
        {
          "type": "beginPath",
          "style": {
            "strokeStyle": "#000000",
            "lineWidth": 3,
            "lineCap": "round"
          }
        },
        {
          "type": "moveTo",
          "x": 200,
          "y": 250
        },
        {
          "type": "quadraticCurveTo",
          "cp1x": 200,
          "cp1y": 290,
          "x": 200,
          "y": 250
        },
        {
          "type": "stroke"
        },
        {
          "type": "beginPath",
          "style": {
            "strokeStyle": "#000000",
            "lineWidth": 3,
            "lineCap": "round"
          }
        },
        {
          "type": "moveTo",
          "x": 200,
          "y": 250
        },
        {
          "type": "bezierCurveTo",
          "cp1x": 170,
          "cp1y": 280,
          "cp2x": 140,
          "cp2y": 265,
          "x": 130,
          "y": 240
        },
        {
          "type": "stroke"
        },
        {
          "type": "beginPath",
          "style": {
            "strokeStyle": "#000000",
            "lineWidth": 3,
            "lineCap": "round"
          }
        },
        {
          "type": "moveTo",
          "x": 200,
          "y": 250
        },
        {
          "type": "bezierCurveTo",
          "cp1x": 230,
          "cp1y": 280,
          "cp2x": 260,
          "cp2y": 265,
          "x": 270,
          "y": 240
        },
        {
          "type": "stroke"
        }
      ]
    },
    {
      "id": "blush-left",
      "type": "shape",
      "x": 0,
      "y": 0,
      "shapes": [
        {
          "type": "arc",
          "x": 135,
          "y": 220,
          "radius": 12.5,
          "startAngle": 0,
          "endAngle": 6.283185,
          "style": {
            "fillStyle": "#ffb5c5",
            "globalAlpha": 0.6
          }
        },
        {
          "type": "fill"
        }
      ]
    },
    {
      "id": "blush-right",
      "type": "shape",
      "x": 0,
      "y": 0,
      "shapes": [
        {
          "type": "arc",
          "x": 265,
          "y": 220,
          "radius": 12.5,
          "startAngle": 0,
          "endAngle": 6.283185,
          "style": {
            "fillStyle": "#ffb5c5",
            "globalAlpha": 0.6
          }
        },
        {
          "type": "fill"
        }
      ]
    }
  ]
}`;

async function testMickeyMouse() {
  console.log("🧪 Testing Mickey Mouse avatar JSON...\n");

  try {
    // Test 1: Parse JSON
    console.log("1️⃣ Testing JSON parsing...");
    const renderData: RenderData = JSON.parse(mickeyMouseJson);
    console.log("   ✅ Parsed successfully");
    console.log(`   - ID: ${renderData.id}`);
    console.log(`   - Size: ${renderData.width}x${renderData.height}`);
    console.log(`   - Layers: ${renderData.layers.length}`);

    // Test 2: Validate structure
    console.log("\n2️⃣ Validating structure...");
    if (!renderData.id || !renderData.width || !renderData.height || !renderData.layers) {
      throw new Error("Missing required fields");
    }
    if (renderData.layers.length === 0) {
      throw new Error("No layers found");
    }
    console.log("   ✅ Structure valid");

    // Test 3: Render to image
    console.log("\n3️⃣ Testing rendering...");
    const renderer = new Renderer(renderData);
    const buffer = await renderer.draw();
    console.log(`   ✅ Rendered successfully (${buffer.length} bytes)`);

    // Test 4: Save output
    console.log("\n4️⃣ Saving output...");
    const outputDir = join(__dirname, "output");
    // Ensure output directory exists
    mkdirSync(outputDir, { recursive: true });
    const outputPath = join(outputDir, "mickey-mouse-test.png");
    writeFileSync(outputPath, buffer);
    console.log(`   ✅ Saved to: ${outputPath}`);

    console.log("\n✅ All tests passed!");
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
testMickeyMouse()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
