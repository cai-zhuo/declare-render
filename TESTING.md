# Testing Guide

This guide explains how to run tests and view results for the `declare-render` package.

## Node.js Tests

### Running Tests

**Option 1: Using npm scripts**
```bash
# Run main test suite
pnpm test

# Run Node.js specific test
tsx examples/test-node.ts
```

**Option 2: Direct execution**
```bash
# Run any test file directly
tsx examples/test.ts
tsx examples/test-node.ts
```

### Viewing Results

Node.js tests:
1. **Console Output**: Results are printed to the terminal showing:
   - ✅ Test status (pass/fail)
   - Buffer size information
   - File paths where images are saved

2. **Image Files**: Generated images are saved to `examples/output/`:
   - `rx-ellipse-test.png` - From `test.ts`
   - `node-test.png` - From `test-node.ts`
   - Other test outputs as configured

**To view the images:**
```bash
# Open the output directory
open examples/output/

# Or view a specific file
open examples/output/node-test.png
```

## Browser Tests

### Running Browser Tests

**Option 1: Open HTML file directly**
```bash
# Open the HTML test file in your browser
open examples/test-browser.html

# Or manually navigate to:
# file:///path/to/declare-renderer/examples/test-browser.html
```

**Option 2: Using a local server (recommended)**
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js http-server (if installed)
npx http-server -p 8000

# Then open: http://localhost:8000/examples/test-browser.html
```

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

| File | Purpose | Output Location |
|------|---------|----------------|
| `test.ts` | Main test suite (rx/ry, ellipses) | `examples/output/rx-ellipse-test.png` |
| `test-node.ts` | Node.js engine specific test | `examples/output/node-test.png` |
| `test-browser.html` | Browser engine visual test | Browser canvas elements |
| `test-browser.ts` | Browser test runner script | Creates instructions file |

## Quick Start

**Test Node.js engine:**
```bash
pnpm test
# Check: examples/output/rx-ellipse-test.png
```

**Test Browser engine:**
```bash
open examples/test-browser.html
# Or use a local server for better compatibility
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
- Check file permissions on `examples/output/` directory
- Verify the directory exists: `mkdir -p examples/output`
