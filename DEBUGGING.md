# Debugging and Testing Setup

This document explains how to use the debugging and testing setup for the Semantic Flow project.

## Debugging

### Understanding Breakpoint Behavior

**Important:** When debugging HTTP routes, place breakpoints **inside the handler functions**, not on the route definition lines:

```typescript
// ❌ This breakpoint hits during server startup (route registration)
app.get("/openapi.json", async () => ({  // <- Don't put breakpoint here
  
// ✅ This breakpoint hits when the route is actually called
app.get("/openapi.json", async () => ({
  "openapi": "3.0.3",  // <- Put breakpoint here instead
  "info": { "title": "SFLO API", "version": "0.0.0" },
  "paths": {}
}));
```

### Primary Workflow: Attach to Running Process

1. **Start the development server with debug support:**
   ```bash
   pnpm dev:debug
   ```
   This starts `sflo-host` with the `--inspect` flag on port 9229.

2. **Set breakpoints** inside handler functions (not on route definition lines).

3. **Attach the debugger:**
   - Open the Run and Debug panel (Ctrl+Shift+D)
   - Select "Attach to sflo-host" configuration
   - Click the play button or press F5

4. **Make HTTP requests** to trigger your breakpoints (e.g., visit http://127.0.0.1:8787/openapi.json)

### Alternative: Launch from VSCode

**Option 1: Standard Launch**
1. **Set breakpoints** inside handler functions
2. **Select "Launch sflo-host"** configuration
3. **Press F5** to start debugging

**Option 2: Launch with Break (for startup debugging)**
1. **Select "Launch sflo-host (wait for attach)"** configuration
2. **Press F5** - server will pause before starting
3. **Set breakpoints** and continue execution
4. **Useful for debugging server initialization**

## Testing


