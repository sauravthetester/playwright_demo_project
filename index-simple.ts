#!/usr/bin/env node
import { exec } from "child_process";
import util from "util";
import path from "path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const execPromise = util.promisify(exec);

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_DIR = __dirname;
const PLAYWRIGHT_BIN = `${PROJECT_DIR}/node_modules/.bin/playwright`;

// ----------------------
// Tool Implementations
// ----------------------
const listTests = async (_args: {}, extra: any) => {
  console.error("=== MCP LIST TESTS CALLED ===");
  console.error(`PROJECT_DIR: ${PROJECT_DIR}`);
  console.error(`PLAYWRIGHT_BIN: ${PLAYWRIGHT_BIN}`);
  
  // Simple hardcoded response to test if the tool works at all
  return {
    content: [
      {
        type: "text" as const,
        text: "TEST: MCP tool is working! Found these tests:\ntests/elementsTests/buttonsTests.spec.ts\ntests/elementsTests/textboxTests.spec.ts\ntests/formsTests/practiceFormTests.spec.ts\ntests/formsTests/practiceFormEdgeCasesTests.spec.ts\ntests/formsTests/practiceFormIntegrationTests.spec.ts",
      },
    ],
  };
};

const runTest = async (args: { name: string }, extra: any) => {
  return {
    content: [
      {
        type: "text" as const,
        text: `Would run test: ${args.name}`,
      },
    ],
  };
};

// ----------------------
// MCP Server Setup
// ----------------------
const server = new McpServer({
  name: "playwright-mcp-server",
  version: "1.0.0",
});

server.registerTool(
  "list-tests",
  {
    description: "List all available Playwright tests",
    inputSchema: z.object({}).shape,
  },
  listTests
);

server.registerTool(
  "run-test",
  {
    description: "Run a specific Playwright test",
    inputSchema: z.object({ name: z.string() }).shape,
  },
  runTest
);

// ----------------------
// Start Transport
// ----------------------
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("✅ Playwright MCP server running over stdio");
