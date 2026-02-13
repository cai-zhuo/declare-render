# Testing Guide

This guide explains how to run tests and view results for the `declare-render` package.

## Node.js Tests

### Running Tests

**Option 1: Using npm scripts**
```bash
# Run main test suite
pnpm test
```

**Option 2: Direct execution**
```bash
# Run any test file directly
tsx test/test.ts
```

### Viewing Results

Node.js tests:
1. **Console Output**: Results are printed to the terminal showing:
   - ✅ Test status (pass/fail)
   - Buffer size information
   - File paths where images are saved

2. **Image Files**: Generated images are saved to `test/output/`:
   - `process-flowchart.png` - Process flowchart (text, shape, container)
   - `knowledge-card.png` - Knowledge card infographic (text, image, container, shape)
   - `image-test.png` - Image renderer (color placeholder, data URI, rotate)
   - `shape-sanity.png` - Shape sanity check (rect, ellipse, arc, path)

**To view the images:**
```bash
# Open the output directory
open test/output/

# Or view a specific file
open test/output/process-flowchart.png
```

## Browser Tests

### Running Browser Tests

**Using Vite Dev Server (Recommended)**
```bash
# Start the Vite dev server
pnpm test:browser

# The server will automatically open test-browser.html in your browser
# Or manually navigate to: http://localhost:8001/test-browser.html
```

The Vite dev server:
- Automatically handles TypeScript imports
- Provides hot module replacement
- Serves files from the `test/` directory
- Opens `test-browser.html` automatically when started

### Viewing Browser Test Results

The browser test page (`test-browser.html`) provides:

1. **Visual Results**: 
   - Canvas elements showing rendered output
   - Each test section displays a canvas with the rendered image

2. **Status Indicators**:
   - ✅ Green status boxes for passed tests
   - ❌ Red status boxes for failed tests
   - Test information (buffer size, type, etc.)

3. **Interactive Features**:
   - "🔄 Run All Tests" button to re-run tests
   - "💾 Download All Images" button to save rendered images

4. **Console Output**: 
   - Open browser DevTools (F12) to see detailed console logs
   - Errors and warnings are logged to the console

## Test Files Overview

All test files are located in the `test/` directory:

| File | Purpose | Output Location |
|------|---------|----------------|
| `test/test.ts` | Node.js test suite (text, image, container, shape) | `test/output/*.png` |
| `test/test-cases.ts` | Shared test data (flowchart, knowledge card, etc.) | - |
| `test/test-browser.html` | Browser engine visual test | Browser canvas elements |
| `test/output/` | Generated test images | Various PNG files |

## Quick Start

**Test Node.js engine:**
```bash
pnpm test
# Check: test/output/process-flowchart.png, knowledge-card.png, etc.
```

**Test Browser engine:**
```bash
pnpm test:browser
# Opens automatically at: http://localhost:8001/test-browser.html
```

## Troubleshooting

**Node.js tests fail:**
- Ensure `node-canvas` is installed: `pnpm install`
- Check that you're in the project root directory

**Browser tests don't work:**
- Use a local server instead of opening file directly
- Check browser console for errors (F12)
- Ensure you're using a modern browser with ES modules support

**Images not generating:**
- Check file permissions on `test/output/` directory
- Verify the directory exists: `mkdir -p test/output`

**Vite server issues:**
- Ensure Vite is installed: `pnpm install`
- Check if port 8001 is already in use
- Review `vite.config.ts` for configuration issues
