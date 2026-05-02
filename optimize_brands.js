const sharp = require('sharp');
const fs = require('fs');

const images = [
  'samsung_lauch.webp',
  'apple_activation.webp',
  'nike_activation.webp',
  'lego_activation.webp'
];

async function optimizeImages() {
  for (const img of images) {
    const inputPath = `public/photos/${img}`;
    const outputPath = `public/photos/${img.replace('.webp', '-opt.webp')}`;
    
    if (fs.existsSync(inputPath)) {
      try {
        const info = await sharp(inputPath)
          .resize(600, null, { withoutEnlargement: true })
          .webp({ quality: 60, effort: 4 })
          .toFile(outputPath);
        console.log(`Optimized ${img} -> ${info.size} bytes`);
      } catch (err) {
        console.error(`Failed to optimize ${img}:`, err.message);
      }
    } else {
        console.log(`File not found: ${inputPath}`);
    }
  }
}

optimizeImages();
