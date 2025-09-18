#!/usr/bin/env node
import { exec } from "child_process";
import util from "util";
import path from "path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";

const execPromise = util.promisify(exec);

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_DIR = __dirname;
const PLAYWRIGHT_BIN = `${PROJECT_DIR}/node_modules/.bin/playwright`;
// ----------------------
// Tool Implementations
// ----------------------
const listTests = async (_args: {}, extra: any) => {
  extra.log?.info("Listing Playwright tests...");
  console.error(`DEBUG: PROJECT_DIR = ${PROJECT_DIR}`);
  console.error(`DEBUG: PLAYWRIGHT_BIN = ${PLAYWRIGHT_BIN}`);
  
  try {
    const command = `${PLAYWRIGHT_BIN} test --list --config=playwright.config.ts --reporter=list`;
    console.error(`DEBUG: Running command: ${command}`);
    
    const { stdout, stderr } = await execPromise(command, { cwd: PROJECT_DIR });
    console.error(`DEBUG: stdout length: ${stdout.length}`);
    console.error(`DEBUG: stderr: ${stderr}`);
    console.error(`DEBUG: stdout preview: ${stdout.substring(0, 200)}...`);

    const tests = stdout
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .filter(l => !l.startsWith("Listing tests:"))
      .filter(l => !l.startsWith("Total:"));

    // Return as proper MCP response
    const testList = tests.length > 0 ? tests.join('\n') : 'No tests found';
    
    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${tests.length} tests:\n\n${testList}`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error listing tests: ${error.message || error}\nStderr: ${error.stderr || 'none'}`,
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
        success: false,
        testName,
        output: error.stderr || error.message || "Unknown error",
      },
    };
  }
};

const searchInRepo = async (args: { query: string }, extra: any) => {
  const query = args.query;
  extra.log?.info(`Searching repo for: ${query}`);

  const results: { file: string; line: number; text: string }[] = [];

  const walk = (dir: string) => {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (!file.startsWith(".") && file !== "node_modules") {
          walk(full);
        }
      } else {
        const content = fs.readFileSync(full, "utf-8");
        const lines = content.split("\n");
        lines.forEach((line, i) => {
          if (line.includes(query)) {
            results.push({ file: full, line: i + 1, text: line.trim() });
          }
        });
      }
    }
  };

  walk(PROJECT_DIR);

  if (results.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: `No matches found for "${query}"`,
        },
      ],
    };
  }

  const matchText = results
    .map(r => `${r.file}:${r.line}  ${r.text}`)
    .join("\n");

  return {
    content: [
      {
        type: "text" as const,
        text: `Found ${results.length} matches for "${query}":\n\n${matchText}`,
      },
    ],
    structuredContent: {
      matches: results,
    },
  };
};


const runTestsChanged = async (_args: {}, extra: any) => {
  extra.log?.info("Running Playwright tests for changed files...");

  try {
    // 1️⃣ Get changed files from Git
    const { stdout: changedFilesStdout } = await execPromise(
      "git diff --name-only HEAD",
      { cwd: PROJECT_DIR }
    );
    const changedFiles = changedFilesStdout
      .split("\n")
      .map(f => f.trim())
      .filter(Boolean);

    if (changedFiles.length === 0) {
      return {
        content: [
          { type: "text" as const, text: "No changed files found." },
        ],
      };
    }

    // 2️⃣ Filter test files (adjust patterns if needed)
    const testFiles = changedFiles.filter(
      f => f.endsWith(".spec.ts") || f.endsWith(".test.ts")
    );

    if (testFiles.length === 0) {
      return {
        content: [
          { type: "text" as const, text: "No test files changed." },
        ],
      };
    }

    extra.log?.info(`Found ${testFiles.length} changed test files: ${testFiles.join(", ")}`);

    // 3️⃣ Run Playwright tests on these files
    const command = `${PLAYWRIGHT_BIN} test ${testFiles.join(
      " "
    )} --config=playwright.config.ts --reporter=list`;
    extra.log?.info(`Running command: ${command}`);

    const { stdout, stderr } = await execPromise(command, { cwd: PROJECT_DIR });

    return {
      content: [
        {
          type: "text" as const,
          text: stderr || stdout || "No output",
        },
      ],
      structuredContent: {
        files: testFiles,
        output: stdout || stderr || "",
      },
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error running tests on changed files: ${error.stderr || error.message || error}`,
        },
      ],
      structuredContent: {
        files: [],
        output: error.stderr || error.message || "Unknown error",
      },
    };
  }
};


const runGitCommand = async (command: string, extra: any) => {
  extra.log?.info(`Running git command: ${command}`);
  try {
    const { stdout, stderr } = await execPromise(command, { cwd: PROJECT_DIR });
    return {
      content: [
        {
          type: "text" as const,
          text: stderr || stdout || "No output",
        },
      ],
    };
  } catch (error: any) {
    const msg = error.message.includes("not a git repository")
      ? `The directory ${PROJECT_DIR} is not a Git repository.`
      : error.message || error;
    return {
      content: [
        { type: "text" as const, text: `Error: ${msg}` },
      ],
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
    inputSchema: {}, // <-- empty ZodRawShape
  },
  listTests
);

server.registerTool(
  "run-test",
  {
    description: "Run a specific Playwright test",
    inputSchema: {
      name: z.string(),
    },
    outputSchema: {
      success: z.boolean(),
      testName: z.string(),
      output: z.string().optional(),
      error: z.string().optional(),
    },
  },
  runTest
);

server.registerTool(
  "search-in-repo",
  {
    description: "Search for any text in the repository",
    inputSchema: {
      query: z.string(),
    },
    outputSchema: {
      matches: z.array(
        z.object({
          file: z.string(),
          line: z.number(),
          text: z.string(),
        })
      ),
    },
  },
  searchInRepo
);

server.registerTool(
  "run-tests-changed",
  {
    description: "Run Playwright tests only on files changed in the current branch",
    inputSchema: {},
    outputSchema: {
      files: z.array(z.string()),
      output: z.string(),
    },
  },
  runTestsChanged
);


server.registerTool(
  "git-status",
  {
    description: "Show current Git branch and status",
    inputSchema: {},
  },
  async (_args, extra) => runGitCommand("git status --short --branch", extra)
);

server.registerTool(
  "git-add",
  {
    description: "Stage a file for commit",
    inputSchema: { filename: z.string() },
  },
  async (args, extra) => runGitCommand(`git add ${args.filename}`, extra)
);

server.registerTool(
  "git-commit",
  {
    description: "Commit staged changes with a message",
    inputSchema: { message: z.string() },
  },
  async (args, extra) => {
    const safeMessage = args.message.replace(/"/g, '\\"');
    return runGitCommand(`git commit -m "${safeMessage}"`, extra);
  }
);

server.registerTool(
  "git-push",
  {
    description: "Push to a branch",
    inputSchema: { branch: z.string() },
  },
  async (args, extra) => runGitCommand(`git push origin ${args.branch}`, extra)
);

server.registerTool(
  "git-checkout",
  {
    description: "Checkout existing branch",
    inputSchema: { branch: z.string() },
  },
  async (args, extra) => runGitCommand(`git checkout ${args.branch}`, extra)
);

server.registerTool(
  "git-checkout-new",
  {
    description: "Create and checkout a new branch",
    inputSchema: { branch: z.string() },
  },
  async (args, extra) => runGitCommand(`git checkout -b ${args.branch}`, extra)
);

server.registerTool(
  "git-stash",
  {
    description: "Stash changes",
    inputSchema: {},
  },
  async (_args, extra) => runGitCommand("git stash", extra)
);

server.registerTool(
  "git-branch",
  {
    description: "Show current branch",
    inputSchema: {},
  },
  async (_args, extra) => runGitCommand("git branch", extra)
);

server.registerTool(
  "git-stash-pop",
  {
    description: "Apply a stash by index",
    inputSchema: { index: z.number() },
  },
  async (args, extra) => runGitCommand(`git stash pop stash@{${args.index}}`, extra)
);

server.registerTool(
  "git-log",
  {
    description: "Show git log oneline",
    inputSchema: {},
  },
  async (_args, extra) => runGitCommand("git log --oneline", extra)
);


// ----------------------
// Start Transport
// ----------------------
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("✅ Playwright MCP server running over stdio");
