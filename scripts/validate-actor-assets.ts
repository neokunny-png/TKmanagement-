import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface ActorSpec {
  slug: string;
  nameKo: string;
  expectedFilename: string;
  expectedSha256Prefix: string;
  minBytes: number;
}

const OFFICIAL_SPECS: ActorSpec[] = [
  {
    slug: 'choi-eunseo',
    nameKo: '최은서',
    expectedFilename: 'choi-eunseo-v5-8fe5a05d.jpg',
    expectedSha256Prefix: '8fe5a05d',
    minBytes: 40000,
  },
  {
    slug: 'lee-eunsoo',
    nameKo: '이은수',
    expectedFilename: 'lee-eunsoo-v5-26e9ac09.jpg',
    expectedSha256Prefix: '26e9ac09',
    minBytes: 40000,
  },
  {
    slug: 'park-minwook',
    nameKo: '박민욱',
    expectedFilename: 'park-minwook-v5-973012cc.jpg',
    expectedSha256Prefix: '973012cc',
    minBytes: 40000,
  },
  {
    slug: 'park-hyunjin',
    nameKo: '박현진',
    expectedFilename: 'park-hyunjin-v5-d3cb5da4.jpg',
    expectedSha256Prefix: 'd3cb5da4',
    minBytes: 30000,
  },
];

console.log('--- [BUILD VALIDATION] Verifying Actor Assets & Static HTML ---');

let hasError = false;

// 1. Verify Public Image Files & Hashes
for (const spec of OFFICIAL_SPECS) {
  const publicPath = path.join(process.cwd(), 'public', 'images', 'actors', spec.expectedFilename);
  if (!fs.existsSync(publicPath)) {
    console.error(`❌ [ERROR] Missing public image: ${publicPath}`);
    hasError = true;
    continue;
  }

  const buf = fs.readFileSync(publicPath);
  if (buf.length < spec.minBytes) {
    console.error(`❌ [ERROR] Image file too small (${buf.length} bytes): ${spec.expectedFilename}`);
    hasError = true;
  }

  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  if (!sha256.startsWith(spec.expectedSha256Prefix)) {
    console.error(`❌ [ERROR] Hash mismatch for ${spec.expectedFilename}: got ${sha256}, expected prefix ${spec.expectedSha256Prefix}`);
    hasError = true;
  } else {
    console.log(`✅ [OK] Image verified: ${spec.expectedFilename} (${buf.length} bytes, SHA256: ${sha256.slice(0, 16)}...)`);
  }
}

// 2. Verify Dist Image Files
for (const spec of OFFICIAL_SPECS) {
  const distPath = path.join(process.cwd(), 'dist', 'images', 'actors', spec.expectedFilename);
  if (!fs.existsSync(distPath)) {
    console.error(`❌ [ERROR] Dist image missing: ${distPath}`);
    hasError = true;
  }
}

// 3. Verify Static Pre-Rendered HTML Documents
for (const spec of OFFICIAL_SPECS) {
  const htmlPath = path.join(process.cwd(), 'dist', 'artists', spec.slug, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ [ERROR] Missing static HTML for ${spec.slug}: ${htmlPath}`);
    hasError = true;
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');

  // Must contain canonical hashed image URL
  if (!html.includes(spec.expectedFilename)) {
    console.error(`❌ [ERROR] ${spec.slug}/index.html does not reference ${spec.expectedFilename}`);
    hasError = true;
  }

  // Must contain actor Korean name in H1
  if (!html.includes(`>${spec.nameKo}</h1>`)) {
    console.error(`❌ [ERROR] ${spec.slug}/index.html missing H1 for ${spec.nameKo}`);
    hasError = true;
  }

  // Must include preload tag for instant Frame 0 render
  if (!html.includes(`<link rel="preload" as="image" href="https://www.tkm.kr/images/actors/${spec.expectedFilename}"`)) {
    console.error(`❌ [ERROR] ${spec.slug}/index.html missing image preload link`);
    hasError = true;
  }

  console.log(`✅ [OK] Static HTML verified: /artists/${spec.slug}/index.html contains ${spec.expectedFilename} & preload`);
}

// 4. Check for any banned or foreign model placeholders in code
const BANNED_PATTERNS = [
  'stock-model',
  'foreign-model',
  'placeholder-actor',
  'unsplash.com',
  'pexels.com',
];

const SCAN_DIRS = [
  path.join(process.cwd(), 'src'),
];

for (const dir of SCAN_DIRS) {
  const files = fs.readdirSync(dir, { recursive: true }) as string[];
  for (const rel of files) {
    const full = path.join(dir, rel);
    if (!fs.statSync(full).isFile() || (!rel.endsWith('.ts') && !rel.endsWith('.tsx'))) continue;
    const content = fs.readFileSync(full, 'utf8');
    for (const banned of BANNED_PATTERNS) {
      if (content.includes(banned)) {
        console.error(`❌ [ERROR] Banned pattern "${banned}" found in ${rel}`);
        hasError = true;
      }
    }
  }
}

if (hasError) {
  console.error('\n❌ [BUILD VALIDATION FAILED] Critical actor asset or SSG integrity issue detected.');
  process.exit(1);
} else {
  console.log('\n🌟 [BUILD VALIDATION PASSED] All 4 actor profiles, hashed assets, and Frame 0 SSG HTML are 100% verified.\n');
}
