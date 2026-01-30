import { Renderer } from "../src/index";
import { RenderData, RendererType } from "../src/types";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Content data in JSON format for easy reading and maintenance
const contentData = {
  title: "防晒指南",
  sections: [
    {
      question: "该不该防晒：",
      answer: "适度防晒"
    },
    {
      question: "怎么防晒：",
      answer: "做好物理防晒，选适配防晒霜（矿物款更安全，适合敏感肌/儿童，化学款慎选成分），避开正午强紫外线，早晚适度日晒。"
    },
    {
      question: "为什么适度：",
      answer: "紫外线会致皮肤DNA突变、加速老化，防晒对护肤和防病至关重要；但完全避光不利健康，且长波长光能穿透防晒和衣物，足够满足合成需求，不用刻意不防晒。维生素D能够调节激素，还与更好的生活质量和寿命相关。"
    }
  ]
};

// Dark & Elegant theme canvas configuration (4:3 aspect ratio)
const CANVAS_CONFIG = {
  width: 1200,
  height: 900, // 4:3 ratio
  padding: 50,
  colors: {
    background: "#121212",  // Deep black
    title: "#FFD700",       // Gold
    question: "#FFFFFF",    // White
    answer: "#B0B0B0",      // Light Gray
    cardBg: "#1E1E1E",      // Dark Gray Card
    accent: "#FFD700",      // Gold
    highlight: "#333333"    // Subtle Dark Circle
  },
  fonts: {
    title: "PingFang SC",
    body: "PingFang SC"
  }
};

// Calculate text height based on content and width
function calcTextHeight(text: string, fontSize: number, containerWidth: number, lineGap = 8): number {
  // CJK characters are roughly square (width ≈ fontSize)
  const charsPerLine = Math.floor(containerWidth / fontSize);
  const lines = Math.ceil(text.length / charsPerLine);
  return lines * (fontSize + lineGap);
}

// Build renderers from content data
function buildRenderers() {
  const renderers: RenderData["renderers"] = [];
  const contentWidth = CANVAS_CONFIG.width - CANVAS_CONFIG.padding * 2;
  let currentY = CANVAS_CONFIG.padding;

  // 1. Background
  renderers.push({
    id: "background",
    type: RendererType.IMG,
    x: 0,
    y: 0,
    width: CANVAS_CONFIG.width,
    height: CANVAS_CONFIG.height,
    color: CANVAS_CONFIG.colors.background,
    objectFit: "cover"
  });

  // 2. Decorative Dark Sun Circle (top right)
  renderers.push({
    id: "sun-circle",
    type: RendererType.IMG,
    x: CANVAS_CONFIG.width - 180,
    y: -60,
    width: 240,
    height: 240,
    color: CANVAS_CONFIG.colors.highlight,
    radius: 120,
    objectFit: "cover"
  });

  // 3. Title
  const titleHeight = 80;
  renderers.push({
    id: "title",
    type: RendererType.TEXT,
    x: CANVAS_CONFIG.padding,
    y: currentY,
    width: contentWidth,
    height: titleHeight,
    content: "☀️ " + contentData.title,
    style: {
      fontName: CANVAS_CONFIG.fonts.title,
      fontSize: 48,
      color: CANVAS_CONFIG.colors.title,
      fontWeight: "bold",
      verticalAlign: "center"
    }
  });
  currentY += titleHeight + 20;

  // 4. Content Sections
  const questionFontSize = 24;
  const answerFontSize = 20;
  const cardPadding = 24;

  contentData.sections.forEach((section, index) => {
    // Card background first (dark rounded rectangle)
    const answerTextWidth = contentWidth - cardPadding * 2;
    const textHeight = calcTextHeight(section.answer, answerFontSize, answerTextWidth, 12);
    const cardHeight = textHeight + cardPadding * 2 + 50; // Extra space for question

    renderers.push({
      id: `card-bg-${index}`,
      type: RendererType.IMG,
      x: CANVAS_CONFIG.padding,
      y: currentY,
      width: contentWidth,
      height: cardHeight,
      color: CANVAS_CONFIG.colors.cardBg,
      radius: 16,
      objectFit: "cover"
    });

    // Question label inside card
    const questionY = currentY + cardPadding;
    renderers.push({
      id: `q-${index}`,
      type: RendererType.TEXT,
      x: CANVAS_CONFIG.padding + cardPadding,
      y: questionY,
      width: contentWidth - cardPadding * 2,
      height: 32,
      content: "▸ " + section.question,
      style: {
        fontName: CANVAS_CONFIG.fonts.body,
        fontSize: questionFontSize,
        color: CANVAS_CONFIG.colors.question,
        fontWeight: "bold",
        verticalAlign: "center"
      }
    });

    // Answer text inside card
    const answerY = questionY + 40;
    renderers.push({
      id: `a-${index}`,
      type: RendererType.TEXT,
      x: CANVAS_CONFIG.padding + cardPadding,
      y: answerY,
      width: answerTextWidth,
      height: textHeight + 20,
      content: section.answer,
      style: {
        fontName: CANVAS_CONFIG.fonts.body,
        fontSize: answerFontSize,
        color: CANVAS_CONFIG.colors.answer,
        verticalGap: 12,
        verticalAlign: "top"
      }
    });

    currentY += cardHeight + 24;
  });

  return renderers;
}

// Create canvas schema
const schema: RenderData = {
  id: "sunscreen-guide",
  width: CANVAS_CONFIG.width,
  height: CANVAS_CONFIG.height,
  renderers: buildRenderers(),
  output: {
    type: "png"
  }
};

// Main execution
async function main() {
  console.log("Generating fresh sunscreen guide image...");
  console.log("Content:", JSON.stringify(contentData, null, 2));

  const renderer = new Renderer(schema);
  const buffer = await renderer.draw();

  // Ensure output directory exists
  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "sunscreen-guide.png");
  fs.writeFileSync(outputPath, buffer);

  console.log(`Image saved to: ${outputPath}`);
}

main().catch(console.error);
