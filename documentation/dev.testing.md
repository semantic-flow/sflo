---
id: 62h18teul646oikncjxli02
title: Testing
desc: ''
updated: 1755744030170
created: 1755743557585
---

## Available Scripts

- `pnpm test` - Run all tests once
- `pnpm test:watch` - Run tests in watch mode (automatically re-runs tests when files change)
- `pnpm test:ui` - Run tests with Vitest UI (visual interface in browser)
- `pnpm test:coverage` - Run tests with coverage report

## Watch Mode

Watch mode automatically re-runs your tests whenever you save changes to:
- Test files (`.test.ts`, `.spec.ts`)
- Source files being tested
- Dependencies of those files

This provides instant feedback during development - you can see test results immediately after making changes without manually re-running tests.

## Debugging Tests

1. **Open a test file** in VSCode
2. **Set breakpoints** in the test or source code
3. **Select "Debug Current Test File"** configuration
4. **Press F5** to debug the current test file

## Test Structure

Tests are located in `__tests__` directories within each package:
- `sflo-host/src/__tests__/` - Tests for the host service
- Add similar directories in other packages as needed
