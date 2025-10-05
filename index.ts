#!/usr/bin/env node

// ═════════════════════════════════════════════════════════════════════════════
// Playwright MCP Server
// ═════════════════════════════════════════════════════════════════════════════
// MCP server for Playwright testing with Git
// integration and dynamic test file handling
// ═════════════════════════════════════════════════════════════════════════════

import { exec } from "child_process";
import util from "util";
import path from "path";
import fs from "fs";
import os from "os";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ═════════════════════════════════════════════════════════════════════════════
// Configuration Constants
// ═════════════════════════════════════════════════════════════════════════════

const execPromise = util.promisify(exec);
const shellCommand = os.platform() === "win32" ? "cmd.exe" : "/bin/sh";

// Timeout configurations for different operations
const TIMEOUTS = {
  SHORT: 10000,   // 10 seconds
  MEDIUM: 15000,  // 15 seconds
  LONG: 25000     // 25 seconds
} as const;

// Project directory setup
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_DIR = __dirname;
const PLAYWRIGHT_BIN = path.join(
  PROJECT_DIR,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "playwright.cmd" : "playwright"
);

// ═════════════════════════════════════════════════════════════════════════════
// Utility Functions
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Execute a command safely with stdout/stderr and timeout
 */
const runCommand = async (command: string, args: string[] = [], extra: any, timeout: number = TIMEOUTS.MEDIUM) => {
  extra.log?.info(`Executing command: ${command} ${args.join(" ")}`);
  try {
    const { stdout, stderr } = await execPromise(`${command} ${args.join(" ")}`, {
      cwd: PROJECT_DIR,
      timeout,
      shell: shellCommand
    });
    return { stdout, stderr };
  } catch (error: any) {
    throw error;
  }
};

/**
 * Execute git command safely
 */
const runGitCommand = async (command: string, extra: any) => {
  extra.log?.info(`Running git command: ${command}`);
  try {
    const { stdout, stderr } = await execPromise(command, {
      cwd: PROJECT_DIR,
      timeout: TIMEOUTS.MEDIUM,
      shell: shellCommand
    });
    return {
      content: [{ type: "text" as const, text: stderr || stdout || "No output" }],
    };
  } catch (error: any) {
    const errorMessage = error.message.includes("not a git repository")
      ? `The directory ${PROJECT_DIR} is not a Git repository.`
      : error.message || error;
    return { content: [{ type: "text" as const, text: `Error: ${errorMessage}` }] };
  }
};

/**
 * Detect test file extensions dynamically (.ts or .js)
 */
const detectTestExtensions = async (): Promise<string[]> => {
  const exts = new Set<string>();
  const walk = async (dir: string) => {
    const files = await fs.promises.readdir(dir);
    for (const file of files) {
      const full = path.join(dir, file);
      const stat = await fs.promises.stat(full);
      if (stat.isDirectory() && file !== "node_modules" && !file.startsWith(".")) await walk(full);
      else if (/\.(spec|test)\.(ts|js)$/.test(file)) exts.add(path.extname(file));
    }
  };
  await walk(PROJECT_DIR);
  return Array.from(exts);
};

// ═════════════════════════════════════════════════════════════════════════════
// Playwright Tool Implementations
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Initialize Playwright project
 */
const initPlaywright = async (args: { lang?: "ts" | "js" }, extra: any) => {
  const language = args.lang || "ts";
  extra.log?.info(`Initializing Playwright project with language: ${language}`);
  try {
    const { stdout, stderr } = await runCommand(
      "npm",
      ["init", "playwright@latest", "--", "--yes", "--quiet", "--install-deps=false", `--lang=${language}`],
      extra,
      TIMEOUTS.LONG
    );
    return {
      content: [{ type: "text" as const, text: `✅ Playwright project initialized with **${language}**.\n\n${stdout || stderr || "No output"}` }],
      structuredContent: { success: true, output: stdout || stderr || "" },
    };
  } catch (error: any) {
    return {
      content: [{ type: "text" as const, text: `❌ Error initializing Playwright project: ${error.stderr || error.message || error}` }],
      structuredContent: { success: false, error: error.stderr || error.message || "Unknown error" },
    };
  }
};

/**
 * List all Playwright tests
 */
const listTests = async (_args: {}, extra: any) => {
  extra.log?.info("Listing Playwright tests...");
  try {
    const { stdout, stderr } = await runCommand(
      PLAYWRIGHT_BIN,
      ["test", "--list", "--config=playwright.config.ts", "--reporter=list"],
      extra,
      TIMEOUTS.MEDIUM
    );
    const tests = stdout
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .filter(line => !line.startsWith("Listing tests:") && !line.startsWith("Total:"));
    const testList = tests.length > 0 ? tests.join("\n") : "No tests found";
    return { content: [{ type: "text" as const, text: `Found ${tests.length} tests:\n\n${testList}` }] };
  } catch (error: any) {
    return { content: [{ type: "text" as const, text: `Error listing tests: ${error.message || error}\nStderr: ${error.stderr || 'none'}` }] };
  }
};

/**
 * Run a specific Playwright test by name
 */
const runTest = async (args: { name: string }, extra: any) => {
  const testName = args.name;
  extra.log?.info(`Running test: ${testName}`);
  try {
    const { stdout, stderr } = await runCommand(
      PLAYWRIGHT_BIN,
      ["test", testName, "--config=playwright.config.ts", "--reporter=list"],
      extra,
      TIMEOUTS.MEDIUM
    );
    return {
      content: [{ type: "text" as const, text: JSON.stringify({ success: true, testName, output: stdout || stderr || "" }) }],
      structuredContent: { success: true, testName, output: stdout || stderr || "" },
    };
  } catch (error: any) {
    return {
      content: [{ type: "text" as const, text: JSON.stringify({ success: false, testName, error: error.stderr || error.message || "Unknown error" }) }],
      structuredContent: { success: false, testName, output: error.stderr || error.message || "Unknown error" },
    };
  }
};

const runtestSelfHeal = async (args: z.infer<typeof runtestSelfHeal>, extra) => {
  try {
    const result = await runCommand(PLAYWRIGHT_BIN, ["test", args.name], extra, TIMEOUTS.MEDIUM);
    return { success: true, output: result.stdout };
  } catch (error: any) {
    extra.log?.warn(`Test failed, retrying with trace/debug: ${args.name}`);
    const debugResult = await runCommand(
      PLAYWRIGHT_BIN, ["test", args.name, "--trace=on", "--debug"], extra, TIMEOUTS.LONG
    );
    return { success: false, output: debugResult.stdout || debugResult.stderr, error: "Test failed but trace/debug captured" };
  }
};

const runTestsReport = async (args: z.infer<typeof runTestsReport>, extra: any) => {
  const reporter = args.reporter || "list";
  const options = [`--reporter=${reporter}`];
  if (args.grep) options.push(`--grep=${args.grep}`);
  if (args.workers) options.push(`--workers=${args.workers}`);

  try {
    const result = await runCommand(
      PLAYWRIGHT_BIN,
      ["test", ...options],
      extra,
      TIMEOUTS.LONG
    );

    return {
      content: [{ type: "text", text: result.stdout || result.stderr || "No output" }],
      structuredContent: { success: true, output: result.stdout || result.stderr || "" }
    };
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `❌ Error: ${error.message || error}` }],
      structuredContent: { success: false, error: error.message || "Unknown error" }
    };
  }
};

/**
 * Search repository for a query string
 */
const searchInRepo = async (args: { query: string }, extra: any) => {
  const query = args.query;
  extra.log?.info(`Searching repository for: ${query}`);
  const results: { file: string; line: number; text: string }[] = [];

  const walkDirectory = async (dir: string) => {
    try {
      const files = await fs.promises.readdir(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = await fs.promises.stat(fullPath);
        if (stat.isDirectory() && file !== "node_modules" && !file.startsWith(".")) await walkDirectory(fullPath);
        else {
          try {
            const content = await fs.promises.readFile(fullPath, "utf-8");
            content.split("\n").forEach((line, i) => {
              if (line.includes(query)) results.push({ file: fullPath, line: i + 1, text: line.trim() });
            });
          } catch {}
        }
      }
    } catch {}
  };

  await walkDirectory(PROJECT_DIR);

  if (results.length === 0) return { content: [{ type: "text" as const, text: `No matches found for "${query}"` }] };
  const matchText = results.map(r => `${r.file}:${r.line}  ${r.text}`).join("\n");
  return { content: [{ type: "text" as const, text: `Found ${results.length} matches for "${query}":\n\n${matchText}` }], structuredContent: { matches: results } };
};

/**
 * Run Playwright tests on changed files (auto .ts/.js detection)
 */
const runTestsChanged = async (_args: { extensions?: string[] }, extra: any) => {
  const extensions = _args.extensions || await detectTestExtensions();
  extra.log?.info(`Running tests for changed files. Extensions: ${extensions.join(", ")}`);

  try {
    const { stdout } = await runCommand("git", ["diff", "--name-only", "HEAD"], extra, TIMEOUTS.MEDIUM);
    const changedFiles = stdout.split("\n").map(f => f.trim()).filter(Boolean);
    if (!changedFiles.length) return { content: [{ type: "text" as const, text: "No changed files found." }] };

    const testFiles = changedFiles.filter(f => extensions.some(ext => f.endsWith(ext)));
    if (!testFiles.length) return { content: [{ type: "text" as const, text: "No test files changed." }] };

    const result = await runCommand(PLAYWRIGHT_BIN, ["test", ...testFiles, "--config=playwright.config.ts", "--reporter=list"], extra, TIMEOUTS.LONG);
    return { content: [{ type: "text" as const, text: result.stderr || result.stdout || "No output" }], structuredContent: { files: testFiles, output: result.stdout || result.stderr || "" } };
  } catch (error: any) {
    return { content: [{ type: "text" as const, text: `Error running tests: ${error.message}` }], structuredContent: { files: [], output: error.message } };
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// MCP Server Setup
// ═════════════════════════════════════════════════════════════════════════════

const server = new McpServer({ name: "playwright-mcp-server", version: "1.0.0" });

// ═════════════════════════════════════════════════════════════════════════════
// Playwright Tools Registration
// ═════════════════════════════════════════════════════════════════════════════

server.registerTool("init-playwright", {
  description: "Initialize Playwright project with JS/TS support",
  inputSchema: { lang: z.enum(["ts", "js"]).optional() },
  outputSchema: { success: z.boolean(), output: z.string().optional(), error: z.string().optional() },
}, initPlaywright);

server.registerTool("list-tests", {
  description: "List all available Playwright tests in project",
  inputSchema: {},
}, listTests);

server.registerTool("run-test", {
  description: "Run a specific Playwright test by name",
  inputSchema: { name: z.string() },
  outputSchema: { success: z.boolean(), testName: z.string(), output: z.string().optional(), error: z.string().optional() },
}, runTest);

server.registerTool("search-text-in-file", {
  description: "Search for any text in repository files",
  inputSchema: { query: z.string() },
  outputSchema: { matches: z.array(z.object({ file: z.string(), line: z.number(), text: z.string() })) },
}, searchInRepo);

server.registerTool("run-tests-changed", {
  description: "Run Playwright tests on changed files dynamically",
  inputSchema: { extensions: z.array(z.string()).optional() },
  outputSchema: { files: z.array(z.string()), output: z.string() },
}, runTestsChanged);

server.registerTool("run-tests-report", {
  description: "Run Playwright tests with a custom reporter",
  inputSchema: { 
    reporter: z.enum(["list","dot","json","junit","html"]).optional(),
    grep: z.string().optional(),
    workers: z.number().optional()
  },
  outputSchema: { 
    success: z.boolean(),
    output: z.string().optional(),
    error: z.string().optional()
  },
}, runTestsReport);

server.registerTool("run-test-selfheal", {
  description: "Run test, if fails retry with trace/debug",
  inputSchema: { name: z.string() },
}, runtestSelfHeal);

// ═════════════════════════════════════════════════════════════════════════════
// Git Tools Registration
// ═════════════════════════════════════════════════════════════════════════════

server.registerTool("git-init", { 
  description: "Initialize git repository", 
  inputSchema: {} 
}, async (_args, extra) => runGitCommand("git init", extra));

server.registerTool("git-status", { 
  description: "Show current git status and branch", 
  inputSchema: {} 
}, async (_args, extra) => runGitCommand("git status --short --branch", extra));

server.registerTool("git-add", { 
  description: "Stage file for commit", 
  inputSchema: { filename: z.string() } 
}, async (args, extra) => runGitCommand(`git add ${args.filename}`, extra));

server.registerTool("git-restore", { 
  description: "Restore staged file in git", 
  inputSchema: { filename: z.string() } 
}, async (args, extra) => runGitCommand(`git restore --staged ${args.filename}`, extra));

server.registerTool("git-remove", { 
  description: "Remove file from git tracking", 
  inputSchema: { filename: z.string() } 
}, async (args, extra) => runGitCommand(`git rm ${args.filename}`, extra));

server.registerTool("git-commit", { 
  description: "Commit staged files with message", 
  inputSchema: { message: z.string() } 
}, async (args, extra) => runGitCommand(`git commit -m "${args.message.replace(/"/g, '\\"')}"`, extra));

server.registerTool("git-push", { 
  description: "Push branch to remote", 
  inputSchema: { branch: z.string() } 
}, async (args, extra) => runGitCommand(`git push origin ${args.branch}`, extra));

server.registerTool("git-checkout", { 
  description: "Checkout existing branch", 
  inputSchema: { branch: z.string() } 
}, async (args, extra) => runGitCommand(`git checkout ${args.branch}`, extra));

server.registerTool("git-checkout-new", { 
  description: "Create and checkout new branch", 
  inputSchema: { branch: z.string() } 
}, async (args, extra) => runGitCommand(`git checkout -b ${args.branch}`, extra));

server.registerTool("git-stash", { 
  description: "Stash current changes", 
  inputSchema: {} 
}, async (_args, extra) => runGitCommand("git stash", extra));

server.registerTool("git-branch", { 
  description: "Show current git branch", 
  inputSchema: {} 
}, async (_args, extra) => runGitCommand("git branch", extra));

server.registerTool("git-stash-pop", { 
  description: "Apply stash by index", 
  inputSchema: { index: z.number() } 
}, async (args, extra) => runGitCommand(`git stash pop stash@{${args.index}}`, extra));

server.registerTool("git-log", { 
  description: "Show git commit history oneline", 
  inputSchema: {} 
}, async (_args, extra) => runGitCommand("git log --oneline", extra));

server.registerTool("git-config", { 
  description: "Show git config list", 
  inputSchema: {} 
}, async (_args, extra) => runGitCommand("git config --list", extra));

server.registerTool("git-diff", {
  description: "Show git diff for working directory or specific file",
  inputSchema: { filename: z.string().optional() },
}, async (args, extra) => {
  const cmd = args.filename ? `git diff ${args.filename}` : "git diff";
  return runGitCommand(cmd, extra);
});

server.registerTool("git-blame", {
  description: "Show git blame for a file",
  inputSchema: { filename: z.string() },
}, async (args, extra) => runGitCommand(`git blame ${args.filename}`, extra));


// ═════════════════════════════════════════════════════════════════════════════
// Start MCP Transport
// ═════════════════════════════════════════════════════════════════════════════

const transport = new StdioServerTransport();
await server.connect(transport);

console.error("✅ Playwright MCP server running over stdio");
