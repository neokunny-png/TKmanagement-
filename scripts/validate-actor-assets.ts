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

  // Must contain exactly 1 H1 with actor Korean name
  const actorH1Matches = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (actorH1Matches.length !== 1 || !actorH1Matches[0].includes(`${spec.nameKo} 배우`)) {
    console.error(`❌ [ERROR] ${spec.slug}/index.html must have exactly 1 H1 "${spec.nameKo} 배우", found ${actorH1Matches.length}`);
    hasError = true;
  }

  // Must include preload tag for instant Frame 0 render
  if (!html.includes(`<link rel="preload" as="image" href="https://www.tkm.kr/images/actors/${spec.expectedFilename}"`)) {
    console.error(`❌ [ERROR] ${spec.slug}/index.html missing image preload link`);
    hasError = true;
  }

  console.log(`✅ [OK] Static HTML verified: /artists/${spec.slug}/index.html contains single H1 "${spec.nameKo} 배우", ${spec.expectedFilename} & preload`);
}

// 3b. Verify Static Section HTML Documents (including root and Google SEO pages)
const EXPECTED_SECTIONS: { path: string; expectedCanonical: string; expectedH1: string }[] = [
  { path: '', expectedCanonical: 'https://www.tkm.kr/', expectedH1: 'TK매니지먼트' },
  { path: 'management', expectedCanonical: 'https://www.tkm.kr/management', expectedH1: '배우 매니지먼트' },
  { path: 'actor-agency', expectedCanonical: 'https://www.tkm.kr/actor-agency', expectedH1: '배우 소속사 TK매니지먼트' },
  { path: 'actor-management-company', expectedCanonical: 'https://www.tkm.kr/actor-management-company', expectedH1: '배우 기획사 TK매니지먼트' },
  { path: 'artists', expectedCanonical: 'https://www.tkm.kr/artists', expectedH1: 'TK매니지먼트 소속 배우' },
  { path: 'audition', expectedCanonical: 'https://www.tkm.kr/audition', expectedH1: 'TK매니지먼트 신인배우 오디션' },
  { path: 'news', expectedCanonical: 'https://www.tkm.kr/news', expectedH1: 'TK매니지먼트 소식' },
  { path: 'contact', expectedCanonical: 'https://www.tkm.kr/contact', expectedH1: 'TK매니지먼트 문의' },
  { path: 'about', expectedCanonical: 'https://www.tkm.kr/about', expectedH1: 'TK매니지먼트' },
  { path: 'terms', expectedCanonical: 'https://www.tkm.kr/terms', expectedH1: 'TK MANAGEMENT 이용약관' },
  { path: 'privacy', expectedCanonical: 'https://www.tkm.kr/privacy', expectedH1: 'TK MANAGEMENT 개인정보처리방침' },
];

for (const sec of EXPECTED_SECTIONS) {
  const secHtmlPath = sec.path
    ? path.join(process.cwd(), 'dist', sec.path, 'index.html')
    : path.join(process.cwd(), 'dist', 'index.html');
  const label = sec.path ? `/${sec.path}/index.html` : '/index.html';
  if (!fs.existsSync(secHtmlPath)) {
    console.error(`❌ [ERROR] Missing static section HTML for ${label}: ${secHtmlPath}`);
    hasError = true;
    continue;
  }
  const secHtml = fs.readFileSync(secHtmlPath, 'utf8');
  if (!secHtml.includes(`<link rel="canonical" href="${sec.expectedCanonical}"`)) {
    console.error(`❌ [ERROR] ${label} missing canonical tag ${sec.expectedCanonical}`);
    hasError = true;
  }
  const h1Matches = secHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length !== 1 || !h1Matches[0].includes(sec.expectedH1)) {
    console.error(`❌ [ERROR] ${label} must have single H1 "${sec.expectedH1}", found ${h1Matches.length}: ${h1Matches[0] || 'none'}`);
    hasError = true;
  }
  console.log(`✅ [OK] Static Section HTML verified: ${label} (H1: "${sec.expectedH1}", Canonical: ${sec.expectedCanonical})`);
}

// 4. Check for any banned or foreign model placeholders, non-affiliated actor names, or legacy phone/fax numbers in code & static HTML
const BANNED_PATTERNS = [
  'stock-model',
  'foreign-model',
  'placeholder-actor',
  'unsplash.com',
  'pexels.com',
  '박도이',
  '박아론',
  '박민준',
  'park-doi',
  'park-aron',
  'park-minjun',
  '02-540-8820',
  '02-540-8821',
  '540-8820',
  '540-8821',
  '대표전화',
  '대표 전화',
  '팩스',
  'faxNumber',
  'contactPoint',
];

const SCAN_DIRS = [
  path.join(process.cwd(), 'src'),
  path.join(process.cwd(), 'dist'),
];

for (const dir of SCAN_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir, { recursive: true }) as string[];
  for (const rel of files) {
    const full = path.join(dir, rel);
    if (!fs.statSync(full).isFile() || (!rel.endsWith('.ts') && !rel.endsWith('.tsx') && !rel.endsWith('.html'))) continue;
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
