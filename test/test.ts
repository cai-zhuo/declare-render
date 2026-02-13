/**
 * Node.js test suite for declare-render.
 * Tests text, image, container, and shape renderers with real-world samples.
 */

import { Renderer } from "../src/node.js";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  processFlowchartData,
  knowledgeCardData,
  imageRendererData,
  shapeSanityData,
} from "./test-cases.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_DIR = join(__dirname, "output");

const TEST_CASES = [
  { name: "Process Flowchart", data: processFlowchartData },
  { name: "Knowledge Card", data: knowledgeCardData },
  { name: "Image Renderer", data: imageRendererData },
  { name: "Shape Sanity", data: shapeSanityData },
] as const;

async function runTests(): Promise<boolean> {
  console.log("🧪 Testing declare-render (Node.js)...\n");
  mkdirSync(OUTPUT_DIR, { recursive: true });

  let allPassed = true;

  for (const { name, data } of TEST_CASES) {
    try {
      console.log(`▶ ${name} (${data.id})`);
      const renderer = new Renderer(data);
      const result = await renderer.draw();

      const buffer =
        Buffer.isBuffer(result) ? result : Buffer.from(await result.arrayBuffer());
      const outputPath = join(OUTPUT_DIR, `${data.id}.png`);
      writeFileSync(outputPath, buffer);
      console.log(`   ✅ Rendered (${buffer.length} bytes) → ${outputPath}\n`);
    } catch (error) {
      console.error(`   ❌ Failed:`, error instanceof Error ? error.message : String(error));
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log("✅ All tests passed!");
    console.log("\nTest coverage:");
    console.log("  - Text renderer (labels, body copy)");
    console.log("  - Image renderer (color placeholder, data URI, rotate)");
    console.log("  - Container renderer (row/column layout, flex flow)");
    console.log("  - Shape renderer (rect, ellipse, arc, path)");
  }

  return allPassed;
}

runTests()
  .then((success) => process.exit(success ? 0 : 1))
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
