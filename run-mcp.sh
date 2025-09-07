#!/bin/bash

echo "Starting Playwright MCP Server..."

# Set the project path environment variable
export PLAYWRIGHT_PROJECT_PATH="/Users/bidyashreepaul/Documents/GitHub/playwright_demo_project"

echo "Project path: $PLAYWRIGHT_PROJECT_PATH"

# Build the MCP server first
echo "Building MCP server..."
cd /Users/bidyashreepaul/Documents/GitHub/playwright-mcp-server
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful, starting server..."
    npm start
else
    echo "Build failed!"
    exit 1
fi
