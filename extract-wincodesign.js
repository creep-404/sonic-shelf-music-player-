const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cacheDir = path.join(process.env.LOCALAPPDATA, 'electron-builder', 'Cache', 'winCodeSign');

const files = fs.readdirSync(cacheDir).filter(f => f.endsWith('.7z'));
if (files.length === 0) {
  console.log('No 7z files found');
  process.exit(1);
}

const latest7z = files.sort().pop();
const archivePath = path.join(cacheDir, latest7z);
const extractDir = path.join(cacheDir, latest7z.replace('.7z', ''));

console.log('Extracting:', archivePath);

const sevenZipPath = path.join(__dirname, 'node_modules', '7zip-bin', 'win', 'x64', '7za.exe');

try {
  execSync(`"${sevenZipPath}" x -y -o"${extractDir}" "${archivePath}"`, { 
    stdio: 'inherit',
    windowsHide: true
  });
  console.log('Extracted with -y flag');
} catch (e) {
  console.log('Extraction completed with warnings (expected for symlinks)');
}

const darwinPath = path.join(extractDir, 'darwin');
if (fs.existsSync(darwinPath)) {
  fs.rmSync(darwinPath, { recursive: true, force: true });
  console.log('Removed darwin folder');
}

console.log('Done - winCodeSign ready');