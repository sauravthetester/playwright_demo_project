#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const path = require('path');

const execPromise = util.promisify(exec);

async function testListCommand() {
  const PROJECT_DIR = __dirname;
  const PLAYWRIGHT_BIN = `${PROJECT_DIR}/node_modules/.bin/playwright`;
  
  console.log('Project directory:', PROJECT_DIR);
  console.log('Playwright binary:', PLAYWRIGHT_BIN);
  
  try {
    const command = `${PLAYWRIGHT_BIN} test --list --config=playwright.config.ts --reporter=list`;
    console.log('Running command:', command);
    
    const { stdout, stderr } = await execPromise(command, { cwd: PROJECT_DIR });
    
    console.log('\n--- STDOUT ---');
    console.log(stdout);
    console.log('\n--- STDERR ---');
    console.log(stderr);
    
    const tests = stdout
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .filter(l => !l.startsWith('Listing tests:'))
      .filter(l => !l.startsWith('Total:'));
    
    console.log('\n--- PARSED TESTS ---');
    console.log(tests);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stderr:', error.stderr);
  }
}

testListCommand();
