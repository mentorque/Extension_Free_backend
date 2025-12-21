#!/usr/bin/env node

/**
 * Test script to verify NLP service is working
 * Run this to check if the NLP service can be started and used
 */

const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const NLP_SERVICE_URL = process.env.NLP_SERVICE_URL || 'http://127.0.0.1:8001';
const NLP_SERVICE_PORT = '8001';

console.log('========================================');
console.log('NLP Service Test');
console.log('========================================\n');

// Check if NLP service directory exists
const backendRoot = path.resolve(__dirname);
const nlpServiceDir = path.join(backendRoot, 'nlp_service');

console.log(`Checking NLP service directory: ${nlpServiceDir}`);

if (!fs.existsSync(nlpServiceDir)) {
  console.error('❌ NLP service directory not found!');
  console.error(`   Expected: ${nlpServiceDir}`);
  process.exit(1);
}

console.log('✓ NLP service directory found\n');

// Check if main.py exists
const mainPyPath = path.join(nlpServiceDir, 'main.py');
if (!fs.existsSync(mainPyPath)) {
  console.error('❌ main.py not found!');
  process.exit(1);
}

console.log('✓ main.py found\n');

// Check if service is already running
async function checkService() {
  try {
    const response = await axios.get(`${NLP_SERVICE_URL}/health`, { timeout: 2000 });
    if (response.data?.status === 'healthy') {
      console.log('✓ NLP service is already running');
      return true;
    }
  } catch (error) {
    console.log('ℹ NLP service is not running (this is OK, we will start it)');
    return false;
  }
}

// Start the service
async function startService() {
  return new Promise((resolve, reject) => {
    console.log('Starting NLP service...');
    
    // Find Python
    const pythonBin = process.env.PYTHON_BIN || 'python3';
    
    const args = [
      '-m', 'uvicorn',
      'main:app',
      '--host', '127.0.0.1',
      '--port', NLP_SERVICE_PORT
    ];
    
    console.log(`Command: ${pythonBin} ${args.join(' ')}`);
    console.log(`Working directory: ${nlpServiceDir}\n`);
    
    const process = spawn(pythonBin, args, {
      cwd: nlpServiceDir,
      stdio: 'inherit'
    });
    
    process.on('error', (error) => {
      console.error('❌ Failed to start NLP service:', error.message);
      reject(error);
    });
    
    // Wait a bit for service to start
    setTimeout(async () => {
      try {
        const response = await axios.get(`${NLP_SERVICE_URL}/health`, { timeout: 5000 });
        if (response.data?.status === 'healthy') {
          console.log('\n✓ NLP service started successfully!\n');
          resolve(process);
        } else {
          reject(new Error('Service started but health check failed'));
        }
      } catch (error) {
        reject(new Error('Service may have started but health check failed: ' + error.message));
      }
    }, 5000);
  });
}

// Test keyword extraction
async function testExtraction() {
  console.log('Testing keyword extraction...');
  console.log('Sample job description: "We are looking for a Python developer with SQL and AWS experience."\n');
  
  try {
    const response = await axios.post(
      `${NLP_SERVICE_URL}/extract`,
      { text: 'We are looking for a Python developer with SQL and AWS experience.' },
      { timeout: 30000, headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log('✓ Keyword extraction successful!');
    console.log(`  Extracted ${response.data.keywords?.length || 0} keywords:`);
    if (response.data.keywords && response.data.keywords.length > 0) {
      console.log(`  Sample: ${response.data.keywords.slice(0, 5).join(', ')}`);
    }
    console.log('\n✅ NLP service is working correctly!\n');
    return true;
  } catch (error) {
    console.error('❌ Keyword extraction failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
    return false;
  }
}

// Main test
async function main() {
  let serviceProcess = null;
  
  try {
    const isRunning = await checkService();
    
    if (!isRunning) {
      serviceProcess = await startService();
    }
    
    const success = await testExtraction();
    
    if (serviceProcess) {
      console.log('Stopping test service...');
      serviceProcess.kill();
    }
    
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (serviceProcess) {
      serviceProcess.kill();
    }
    process.exit(1);
  }
}

main();

