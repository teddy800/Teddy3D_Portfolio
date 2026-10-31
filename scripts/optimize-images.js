/**
 * 🖼️ Image Optimization Script
 * Converts PNG/JPG images to WebP and AVIF formats
 * Reduces image payload by 70-80%
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  inputDir: './public/images',
  outputDir: './public/images',
  formats: {
    webp: { quality: 85, effort: 6 },
    avif: { quality: 80, effort: 9 },
  },
  sizes: {
    // Generate responsive sizes
    large: 1920,
    medium: 1280,
    small: 768,
    thumbnail: 320,
  },
  skipPatterns: [
    /\.webp$/,
    /\.avif$/,
    /\.svg$/,
    /\.gif$/,
  ],
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

// Helper functions
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
};

// Get all image files recursively
function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImages(filePath, fileList);
    } else {
      const shouldSkip = CONFIG.skipPatterns.some(pattern => pattern.test(file));
      if (!shouldSkip && /\.(png|jpg|jpeg)$/i.test(file)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Get file size in KB
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

// Optimize single image
async function optimizeImage(inputPath) {
  const { dir, name, ext } = path.parse(inputPath);
  const relativePath = path.relative(CONFIG.inputDir, dir);
  const outputDir = path.join(CONFIG.outputDir, relativePath);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const originalSize = getFileSizeKB(inputPath);
  let totalSaved = 0;
  const results = [];

  try {
    // Load image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    log.info(`Processing: ${name}${ext} (${originalSize} KB, ${metadata.width}x${metadata.height})`);

    // Generate WebP
    const webpPath = path.join(outputDir, `${name}.webp`);
    await image
      .clone()
      .webp(CONFIG.formats.webp)
      .toFile(webpPath);
    
    const webpSize = getFileSizeKB(webpPath);
    const webpSavings = originalSize - webpSize;
    totalSaved += webpSavings;
    results.push(`  WebP: ${webpSize} KB (saved ${webpSavings.toFixed(2)} KB)`);

    // Generate AVIF
    const avifPath = path.join(outputDir, `${name}.avif`);
    await image
      .clone()
      .avif(CONFIG.formats.avif)
      .toFile(avifPath);
    
    const avifSize = getFileSizeKB(avifPath);
    const avifSavings = originalSize - avifSize;
    totalSaved += avifSavings;
    results.push(`  AVIF: ${avifSize} KB (saved ${avifSavings.toFixed(2)} KB)`);

    // Generate responsive sizes for large images (>1000px width)
    if (metadata.width > 1000) {
      for (const [sizeName, width] of Object.entries(CONFIG.sizes)) {
        if (width < metadata.width) {
          const responsivePath = path.join(outputDir, `${name}-${width}w${ext}`);
          await image
            .clone()
            .resize(width, null, { withoutEnlargement: true })
            .toFile(responsivePath);
          
          const responsiveSize = getFileSizeKB(responsivePath);
          results.push(`  ${sizeName} (${width}w): ${responsiveSize} KB`);
        }
      }
    }

    log.success(`${name}${ext}`);
    results.forEach(result => log.info(result));
    log.info(`  Total saved: ${totalSaved.toFixed(2)} KB\n`);

    return {
      file: name + ext,
      originalSize: parseFloat(originalSize),
      webpSize: parseFloat(webpSize),
      avifSize: parseFloat(avifSize),
      saved: totalSaved,
    };

  } catch (error) {
    log.error(`Failed to process ${name}${ext}: ${error.message}`);
    return null;
  }
}

// Main execution
async function main() {
  console.log('\n🖼️  Image Optimization Started\n');
  console.log('━'.repeat(60));

  // Check if sharp is installed
  let sharpModule;
  try {
    sharpModule = await import('sharp');
  } catch (e) {
    log.error('Sharp is not installed!');
    log.info('Install it with: npm install --save-dev sharp');
    process.exit(1);
  }

  // Get all images
  const images = getAllImages(CONFIG.inputDir);
  
  if (images.length === 0) {
    log.warning('No images found to optimize!');
    process.exit(0);
  }

  log.info(`Found ${images.length} images to optimize\n`);

  // Process all images
  const results = [];
  for (const imagePath of images) {
    const result = await optimizeImage(imagePath);
    if (result) {
      results.push(result);
    }
  }

  // Summary
  console.log('━'.repeat(60));
  console.log('\n📊 Optimization Summary\n');

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalWebP = results.reduce((sum, r) => sum + r.webpSize, 0);
  const totalAVIF = results.reduce((sum, r) => sum + r.avifSize, 0);
  const totalSaved = results.reduce((sum, r) => sum + r.saved, 0);

  log.info(`Total images processed: ${results.length}`);
  log.info(`Original total size: ${totalOriginal.toFixed(2)} KB`);
  log.info(`WebP total size: ${totalWebP.toFixed(2)} KB`);
  log.info(`AVIF total size: ${totalAVIF.toFixed(2)} KB`);
  log.success(`Total saved: ${totalSaved.toFixed(2)} KB (${((totalSaved / totalOriginal) * 100).toFixed(1)}%)\n`);

  console.log('━'.repeat(60));
  console.log('\n✨ Optimization Complete!\n');
}

// Run the script
main().catch(error => {
  log.error(`Script failed: ${error.message}`);
  process.exit(1);
});
