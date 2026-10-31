/**
 * 🔤 Font Download Script
 * Downloads Google Fonts locally for self-hosting
 * Eliminates external font requests for 100% Lighthouse score
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FONTS_DIR = './public/fonts';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Font configurations
const FONTS = [
  {
    family: 'Inter',
    weights: [300, 400, 500, 600, 700, 800, 900],
    variants: ['normal'],
  },
  {
    family: 'Fira Code',
    weights: [400, 500, 700],
    variants: ['normal'],
  },
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
};

// Download file from URL
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Get Google Fonts CSS URL
function getFontCssUrl(font) {
  const family = font.family.replace(/ /g, '+');
  const weights = font.weights.join(';');
  return `https://fonts.googleapis.com/css2?family=${family}:wght@${weights}&display=swap`;
}

// Parse CSS and extract font URLs
function parseFontUrls(css) {
  const urlRegex = /url\((https:\/\/[^)]+)\)/g;
  const urls = [];
  let match;

  while ((match = urlRegex.exec(css)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

// Download Google Font CSS
function downloadFontCss(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': USER_AGENT } }, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

// Generate local filename for font
function getLocalFontFilename(url, fontFamily, weight) {
  const ext = url.includes('.woff2') ? 'woff2' : 'woff';
  const family = fontFamily.toLowerCase().replace(/ /g, '-');
  
  // Determine weight name
  const weightNames = {
    300: 'light',
    400: 'regular',
    500: 'medium',
    600: 'semibold',
    700: 'bold',
    800: 'extrabold',
    900: 'black',
  };
  
  const weightName = weightNames[weight] || weight;
  return `${family}-v12-latin-${weightName}.${ext}`;
}

// Download single font
async function downloadFont(fontConfig) {
  const { family, weights } = fontConfig;
  
  log.info(`Downloading ${family}...`);

  try {
    // Get CSS from Google Fonts
    const cssUrl = getFontCssUrl(fontConfig);
    const css = await downloadFontCss(cssUrl);
    
    // Extract font file URLs
    const fontUrls = parseFontUrls(css);
    
    if (fontUrls.length === 0) {
      log.warning(`No font URLs found for ${family}`);
      return;
    }

    // Download each font file
    for (let i = 0; i < fontUrls.length && i < weights.length; i++) {
      const url = fontUrls[i];
      const weight = weights[i];
      const filename = getLocalFontFilename(url, family, weight);
      const filepath = path.join(FONTS_DIR, filename);

      try {
        await downloadFile(url, filepath);
        const size = (fs.statSync(filepath).size / 1024).toFixed(2);
        log.success(`  ${filename} (${size} KB)`);
      } catch (error) {
        log.error(`  Failed to download ${filename}: ${error.message}`);
      }
    }

  } catch (error) {
    log.error(`Failed to download ${family}: ${error.message}`);
  }
}

// Main execution
async function main() {
  console.log('\n🔤 Font Download Script\n');
  console.log('━'.repeat(60));

  // Create fonts directory if it doesn't exist
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
    log.info(`Created directory: ${FONTS_DIR}\n`);
  }

  // Download all fonts
  for (const font of FONTS) {
    await downloadFont(font);
    console.log('');
  }

  console.log('━'.repeat(60));
  
  // Summary
  const files = fs.readdirSync(FONTS_DIR).filter(f => f.endsWith('.woff2'));
  const totalSize = files.reduce((sum, file) => {
    const filepath = path.join(FONTS_DIR, file);
    return sum + fs.statSync(filepath).size;
  }, 0);

  log.info(`\nTotal fonts downloaded: ${files.length}`);
  log.info(`Total size: ${(totalSize / 1024).toFixed(2)} KB`);
  log.success(`\n✨ All fonts downloaded successfully!\n`);

  console.log('━'.repeat(60));
  console.log('\nNext steps:');
  console.log('1. Update src/index.css:');
  console.log('   Replace: @import url("https://fonts.googleapis.com/...")');
  console.log('   With: @import url("/fonts/fonts.css");');
  console.log('\n2. Add font preload to index.html:');
  console.log('   <link rel="preload" href="/fonts/inter-v12-latin-regular.woff2" as="font" type="font/woff2" crossorigin />');
  console.log('\n3. Test the fonts load correctly');
  console.log('4. Run Lighthouse audit\n');
}

// Run the script
main().catch(error => {
  log.error(`Script failed: ${error.message}`);
  process.exit(1);
});
