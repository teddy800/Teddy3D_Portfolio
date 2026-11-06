// scripts/update-version.js
// Automatically increments build version for cache-busting

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, '../package.json');
const mainJsxPath = path.join(__dirname, '../src/main.jsx');

try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const currentVersion = packageJson.version;
  
  // Increment patch version
  const versionParts = currentVersion.split('.');
  versionParts[2] = (parseInt(versionParts[2]) + 1).toString();
  const newVersion = versionParts.join('.');
  
  // Update package.json
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  
  // Update main.jsx with new version
  let mainJsx = fs.readFileSync(mainJsxPath, 'utf8');
  mainJsx = mainJsx.replace(
    /const APP_VERSION = '[^']+';/,
    `const APP_VERSION = '${newVersion}';`
  );
  fs.writeFileSync(mainJsxPath, mainJsx);
  
  console.log(`✅ Version updated: ${currentVersion} → ${newVersion}`);
  console.log('🔄 This will force cache refresh for all users');
} catch (error) {
  console.error('❌ Error updating version:', error);
  process.exit(1);
}
