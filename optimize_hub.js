const sharp = require('sharp');
const fs = require('fs');

const images = [
  'intro&stats.webp',
  'main_hub_whosHere.webp',
  'main_hub_explore.webp',
  'main_hub_entertainment.webp',
  'main_hub_events.webp',
  'main_hub_action.webp'
];

async function optimizeImages() {
  for (const img of images) {
    const inputPath = `public/photos/${img}`;
    const outputPath = `public/photos/${img.replace('.webp', '-opt.webp')}`;
    
    if (fs.existsSync(inputPath)) {
      try {
        const info = await sharp(inputPath)
          .resize(1200, null, { withoutEnlargement: true })
          .webp({ quality: 65, effort: 4 })
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
