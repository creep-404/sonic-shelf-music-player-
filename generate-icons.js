const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, 'public');
const svgPath = path.join(publicDir, 'icon.svg');

const sizes = [16, 24, 32, 48, 64, 96, 128, 256, 512];

function runCommand(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.error(`Command failed: ${cmd}`);
    return false;
  }
}

function generatePNGs() {
  console.log('Generating PNG icons...');
  
  if (!fs.existsSync(svgPath)) {
    console.error('SVG source not found at', svgPath);
    return false;
  }

  for (const size of sizes) {
    const outputPath = path.join(publicDir, `icon-${size}.png`);
    const cmd = `npx svgexport ${svgPath} ${outputPath} ${size}:${size}`;
    if (!runCommand(cmd)) {
      console.log(`Trying alternative method for ${size}px...`);
      const altCmd = `npx @resvg/resvg-js ${svgPath} ${outputPath} -w ${size} -h ${size}`;
      if (!runCommand(altCmd)) {
        console.log(`Could not generate ${size}px icon. Please install svgexport or @resvg/resvg-js`);
      }
    }
  }

  const mainPng = path.join(publicDir, 'icon.png');
  if (fs.existsSync(path.join(publicDir, 'icon-512.png'))) {
    fs.copyFileSync(path.join(publicDir, 'icon-512.png'), mainPng);
    console.log('Created icon.png (512px)');
  }

  return true;
}

function generateICO() {
  console.log('Generating ICO...');
  const pngFiles = sizes.map(s => path.join(publicDir, `icon-${s}.png`)).filter(f => fs.existsSync(f));
  
  if (pngFiles.length === 0) {
    console.log('No PNG files found, skipping ICO generation');
    return false;
  }

  const cmd = `npx png2icons ${pngFiles.join(' ')} ${path.join(publicDir, 'icon.ico')}`;
  return runCommand(cmd);
}

function generateICNS() {
  console.log('Generating ICNS...');
  const iconsetDir = path.join(publicDir, 'icon.iconset');
  
  if (!fs.existsSync(iconsetDir)) {
    fs.mkdirSync(iconsetDir);
  }

  const iconMap = [
    { size: 16, name: 'icon_16x16.png' },
    { size: 32, name: 'icon_16x16@2x.png' },
    { size: 32, name: 'icon_32x32.png' },
    { size: 64, name: 'icon_32x32@2x.png' },
    { size: 128, name: 'icon_128x128.png' },
    { size: 256, name: 'icon_128x128@2x.png' },
    { size: 256, name: 'icon_256x256.png' },
    { size: 512, name: 'icon_256x256@2x.png' },
    { size: 512, name: 'icon_512x512.png' },
    { size: 1024, name: 'icon_512x512@2x.png' },
  ];

  for (const { size, name } of iconMap) {
    const src = path.join(publicDir, `icon-${size}.png`);
    const dest = path.join(iconsetDir, name);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    } else if (fs.existsSync(path.join(publicDir, 'icon-512.png'))) {
      fs.copyFileSync(path.join(publicDir, 'icon-512.png'), dest);
    }
  }

  const cmd = `iconutil -c icns ${iconsetDir} -o ${path.join(publicDir, 'icon.icns')}`;
  const success = runCommand(cmd);
  
  fs.rmSync(iconsetDir, { recursive: true, force: true });
  return success;
}

console.log('=== SonicShelf Icon Generator ===\n');

if (!generatePNGs()) {
  console.log('\nPNG generation failed. Install svgexport: npm install -g svgexport');
  console.log('Or use @resvg/resvg-js: npx @resvg/resvg-js icon.svg icon.png -w 512 -h 512');
}

if (process.platform === 'win32') {
  generateICO();
}

if (process.platform === 'darwin') {
  generateICNS();
}

console.log('\nDone! Check public/ directory for generated icons.');