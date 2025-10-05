#!/usr/bin/env node
/**
 * Upload LLMS.txt Content to KV Storage
 *
 * This script uploads llms.txt and llms-full.txt content to Cloudflare KV
 * for dynamic serving by the worker.
 *
 * Usage:
 *   node scripts/upload-content.js [environment]
 *
 * Environment can be: development, staging, production (default: development)
 *
 * Prerequisites:
 *   - Wrangler CLI installed and authenticated
 *   - KV namespace created and configured in wrangler.toml
 *
 * Example:
 *   node scripts/upload-content.js production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const REPO_ROOT = path.join(__dirname, '../..');
const LLMS_TXT_PATH = path.join(REPO_ROOT, 'llms.txt');
const LLMS_FULL_TXT_PATH = path.join(REPO_ROOT, 'llms-full.txt');

// Get environment from command line
const environment = process.argv[2] || 'development';
const validEnvironments = ['development', 'staging', 'production'];

if (!validEnvironments.includes(environment)) {
  console.error(`Error: Invalid environment "${environment}"`);
  console.error(`Valid environments: ${validEnvironments.join(', ')}`);
  process.exit(1);
}

console.log(`Uploading LLMS.txt content to ${environment} environment...\n`);

/**
 * Read file content
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Upload content to KV using wrangler
 */
function uploadToKV(key, value, env) {
  const kvNamespace = env === 'production' ? 'LLMS_CONTENT' : `LLMS_CONTENT_${env.toUpperCase()}`;

  try {
    // Create temporary file for content
    const tempFile = path.join(__dirname, '.temp-kv-content.txt');
    fs.writeFileSync(tempFile, value);

    // Upload using wrangler
    const command = `wrangler kv:key put --binding="${kvNamespace}" "${key}" --path="${tempFile}"`;

    console.log(`Uploading ${key} to ${kvNamespace}...`);
    execSync(command, { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

    // Clean up temp file
    fs.unlinkSync(tempFile);

    console.log(`✓ Successfully uploaded ${key}\n`);
    return true;
  } catch (error) {
    console.error(`✗ Error uploading ${key}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  // Read content files
  console.log('Reading content files...');

  const llmsTxt = readFile(LLMS_TXT_PATH);
  if (!llmsTxt) {
    console.error('Failed to read llms.txt');
    process.exit(1);
  }
  console.log(`✓ Read llms.txt (${llmsTxt.length} bytes)`);

  const llmsFullTxt = readFile(LLMS_FULL_TXT_PATH);
  if (!llmsFullTxt) {
    console.error('Failed to read llms-full.txt');
    process.exit(1);
  }
  console.log(`✓ Read llms-full.txt (${llmsFullTxt.length} bytes)\n`);

  // Upload to KV
  console.log(`Uploading to ${environment} KV namespace...\n`);

  const success1 = uploadToKV('llms-txt', llmsTxt, environment);
  const success2 = uploadToKV('llms-full-txt', llmsFullTxt, environment);

  if (success1 && success2) {
    console.log('✓ All content uploaded successfully!');
    console.log('\nContent is now available in KV storage.');
    console.log('The worker will use KV content instead of hardcoded fallback.');
  } else {
    console.error('\n✗ Some uploads failed. Check errors above.');
    process.exit(1);
  }
}

// Run main function
main();
