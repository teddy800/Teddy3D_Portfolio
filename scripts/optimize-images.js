#!/usr/bin/env node

/**
 * 🖼️ Advanced Image Optimization Script
 * Converts PNG/JPG to WebP and AVIF formats
 * Generates responsive image sizes
 * Optimizes file sizes with quality presets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '..', 'public', 'images'),
  outputDir: path.join(__dirname, '..', 'public', 'images', 'optimized'),
  formats: ['webp', 'avif'],
  sizes: [640, 828, 1200, 1920], // Responsive sizes
  quality: {
    webp: 85,
    avif: 80,
    jpeg: 85,
    png: 90,
  },
  skipPatterns: ['optimized', 'abilities', 'logos'], // Skip already optimized
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

/**
 * Check if file should be processed
 */
function shouldProcess(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const isImage = ['.png', '.jpg', '.jpeg'].includes(ext);
  const shouldSkip = CONFIG.skipPatterns.some(pattern => 
    filePath.includes(pattern)
  );
  return isImage && !shouldSkip;
}

/**
 * Optimize single image
 */
async function optimizeImage(inputPath, filename) {
  const baseName = path.parse(filename).name;
  const results = [];

  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const originalSize = fs.statSync(inputPath).size;

    console.log(`\n📸 Processing: ${filename}`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB (${metadata.width}x${metadata.height})`);

    // Generate WebP
    for (const format of CONFIG.formats) {
      const outputPath = path.join(CONFIG.outputDir, `${baseName}.${format}`);
      
      await sharp(inputPath)
        [format]({ quality: CONFIG.quality[format], effort: 6 })
        .toFile(outputPath);

      const newSize = fs.statSync(outputPath).size;
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
      
      console.log(`   ✅ ${format.toUpperCase()}: ${(newSize / 1024).toFixed(2)} KB (${savings}% smaller)`);
      
      results.push({
        format,
        size: newSize,
        savings: parseFloat(savings),
      });
    }

    // Generate responsive sizes for WebP
    for (const width of CONFIG.sizes) {
      if (width < metadata.width) {
        const outputPath = path.join(CONFIG.outputDir, `${baseName}-${width}w.webp`);
        
        await sharp(inputPath)
          .resize(width, null, { withoutEnlargement: true })
          .webp({ quality: CONFIG.quality.webp, effort: 6 })
          .toFile(outputPath);

        const newSize = fs.statSync(outputPath).size;
        console.log(`   📐 WebP ${width}w: ${(newSize / 1024).toFixed(2)} KB`);
      }
    }

    return results;
  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
    return [];
  }
}

/**
 * Process all images in directory
 */
async function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  const stats = {
    processed: 0,
    skipped: 0,
    totalOriginalSize: 0,
    totalOptimizedSize: 0,
  };

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip subdirectories for now
      continue;
    }

    if (shouldProcess(filePath)) {
      const results = await optimizeImage(filePath, file);
      if (results.length > 0) {
        stats.processed++;
        stats.totalOriginalSize += fs.statSync(filePath).size;
        stats.totalOptimizedSize += results.reduce((sum, r) => sum + r.size, 0) / results.length;
      }
    } else {
      stats.skipped++;
    }
  }

  return stats;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Image Optimization...\n');
  console.log(`📁 Input:  ${CONFIG.inputDir}`);
  console.log(`📁 Output: ${CONFIG.outputDir}`);
  console.log(`🎨 Formats: ${CONFIG.formats.join(', ')}`);
  console.log(`📐 Sizes: ${CONFIG.sizes.join(', ')}px\n`);

  const startTime = Date.now();
  const stats = await processDirectory(CONFIG.inputDir);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Processed: ${stats.processed} images`);
  console.log(`⏭️  Skipped:   ${stats.skipped} files`);
  console.log(`📦 Original:  ${(stats.totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`✨ Optimized: ${(stats.totalOptimizedSize / 1024).toFixed(2)} KB`);
  
  if (stats.totalOriginalSize > 0) {
    const savings = ((1 - stats.totalOptimizedSize / stats.totalOriginalSize) * 100).toFixed(1);
    console.log(`💰 Savings:   ${savings}%`);
  }
  
  console.log(`⏱️  Duration:  ${duration}s`);
  console.log('='.repeat(60));
  console.log('\n✨ Optimization complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Update image src to use optimized versions');
  console.log('   2. Implement <picture> tags with format fallbacks');
  console.log('   3. Add responsive srcset attributes');
}

// Run
main().catch(console.error);
