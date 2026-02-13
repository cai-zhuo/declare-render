/**
 * Browser test runner for declare-render.
 * Renders test cases to canvas elements and provides download functionality.
 */

import { Renderer } from "@/browser";
import type { RenderData } from "@/types";
import {
  processFlowchartData,
  knowledgeCardData,
  imageRendererData,
  shapeSanityData,
} from "./test-cases";

const TEST_CASES: { name: string; data: RenderData }[] = [
  { name: "Process Flowchart", data: processFlowchartData },
  { name: "Knowledge Card", data: knowledgeCardData },
  { name: "Image Renderer", data: imageRendererData },
  { name: "Shape Sanity", data: shapeSanityData },
];

function createSection(name: string, data: RenderData): HTMLElement {
  const section = document.createElement("div");
  section.className = "section";
  section.id = `section-${data.id}`;
  section.innerHTML = `
    <h2>${name}</h2>
    <div class="status" id="status-${data.id}">Pending</div>
    <canvas id="canvas-${data.id}" width="${data.width}" height="${data.height}"></canvas>
  `;
  return section;
}

async function runTest(data: RenderData): Promise<Blob> {
  const renderer = new Renderer(data);
  const result = await renderer.draw();
  return result instanceof Blob ? result : new Blob([result]);
}

async function runAllTests(): Promise<void> {
  for (const { name, data } of TEST_CASES) {
    const statusEl = document.getElementById(`status-${data.id}`);
    const canvas = document.getElementById(`canvas-${data.id}`) as HTMLCanvasElement;
    if (!statusEl || !canvas) continue;

    try {
      statusEl.textContent = "Rendering...";
      statusEl.className = "status";

      const blob = await runTest(data);
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = data.width;
          canvas.height = data.height;
          ctx.drawImage(img, 0, 0);
        }
        URL.revokeObjectURL(url);
        statusEl.textContent = `✅ Pass (${(blob.size / 1024).toFixed(1)} KB)`;
        statusEl.className = "status pass";
        (canvas as HTMLCanvasElement & { _blob?: Blob })._blob = blob;
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        statusEl.textContent = "❌ Failed to load image";
        statusEl.className = "status fail";
      };
      img.src = url;
    } catch (err) {
      statusEl.textContent = `❌ ${err instanceof Error ? err.message : String(err)}`;
      statusEl.className = "status fail";
      console.error(`Test ${data.id} failed:`, err);
    }
  }
}

function downloadAll(): void {
  for (const { data } of TEST_CASES) {
    const canvas = document.getElementById(`canvas-${data.id}`) as
      | (HTMLCanvasElement & { _blob?: Blob })
      | null;
    if (!canvas?._blob) continue;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(canvas._blob);
    a.download = `${data.id}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}

function init(): void {
  const results = document.getElementById("results");
  if (!results) return;

  for (const { name, data } of TEST_CASES) {
    results.appendChild(createSection(name, data));
  }

  document.getElementById("runAll")?.addEventListener("click", runAllTests);
  document.getElementById("downloadAll")?.addEventListener("click", downloadAll);

  runAllTests();
}

init();
