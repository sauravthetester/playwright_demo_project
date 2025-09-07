#!/usr/bin/env node
import { exec } from "child_process";
import util from "util";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const execPromise = util.promisify(exec);
const PROJECT_DIR = "/Users/bidyashreepaul/Documents/GitHub/playwright_demo_project";
// const PROJECT_DIR = process.cwd();
const PLAYWRIGHT_BIN = `${PROJECT_DIR}/node_modules/.bin/playwright`;
// ----------------------
// Tool Implementations
// ----------------------
const listTests = async (_args: {}, extra: any) => {
  extra.log?.info("Listing Playwright tests...");
  try {
    const { stdout } = await execPromise(`${PLAYWRIGHT_BIN} test --list --config=playwright.config.ts --reporter=list`, {
      cwd: PROJECT_DIR,
    });
    const tests = stdout.split("\n").map(l => l.trim()).filter(Boolean);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ tests }),
        },
      ],
    };
  } catch (_error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ tests: [] }),
        },
      ],
    };
  }
};

const runTest = async (args: { name: string }, extra: any) => {
  const testName = args.name;
  extra.log?.info(`Running test: ${testName}`);
  try {
    const { stdout, stderr } = await execPromise(`${PLAYWRIGHT_BIN} test ${testName} --config=playwright.config.ts --reporter=list`, {
      cwd: PROJECT_DIR,
    });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: true,
            testName,
            output: stdout || stderr || "",
          }),
        },
      ],
      structuredContent: {
        success: true,
        testName,
        output: stdout || stderr || "",
      },
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            testName,
            error: error.stderr || error.message || "Unknown error",
          }),
        },
      ],
      structuredContent: {
        success: true,
        testName,
        output: error.stderr || error.message || "Unknown error",
      },
    };
  }
};

const getLastCommit = async (_args: {}, extra: any) => {
  extra.log?.info("Getting last commit diff from git...");
  try {
    const { stdout } = await execPromise("git diff HEAD~1 HEAD", {
      cwd: PROJECT_DIR,
    });
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ success: true, diff: stdout }),
        },
      ],
      structuredContent: { success: true, diff: stdout },
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            success: false,
            diff: error.stderr || error.message || "",
          }),
        },
      ],
      structuredContent: { success: true, diff: error.stderr || error.message || "" },
    };
  }
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
    inputSchema: z.object({}).shape, // ✅ no .shape
    outputSchema: z.object({ tests: z.array(z.string()) }).shape,
  },
  listTests
);

server.registerTool(
  "run-test",
  {
    description: "Run a specific Playwright test",
    inputSchema: z.object({ name: z.string() }).shape,
    outputSchema: z.object({
      success: z.boolean(),
      testName: z.string(),
      output: z.string().optional(),
      error: z.string().optional(),
    }).shape,
  },
  runTest
);

// server.registerTool(
//   "git-diff",
//   {
//     description: "Get the difference of the last git commit",
//     inputSchema: z.object({}).shape,
//     outputSchema: z.object({
//       success: z.boolean(),
//       diff: z.string(),
//     }).shape,
//   },
//   getLastCommit
// );

// ----------------------
// Start Transport
// ----------------------
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("✅ Playwright MCP server running over stdio");
