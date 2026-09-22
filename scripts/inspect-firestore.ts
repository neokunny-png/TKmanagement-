import { db, ensureFirebaseAuth } from '../src/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import fs from 'fs';
import https from 'https';
import http from 'http';

function checkUrl(urlStr: string): Promise<{ status: number | null; contentType: string | null; error?: string }> {
  return new Promise((resolve) => {
    if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
      resolve({ status: null, contentType: null, error: 'Not an http/https url' });
      return;
    }
    const client = urlStr.startsWith('https://') ? https : http;
    const req = client.request(urlStr, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve({
        status: res.statusCode || null,
        contentType: res.headers['content-type'] || null,
      });
    });
    req.on('error', (err) => {
      resolve({ status: null, contentType: null, error: err.message });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: null, contentType: null, error: 'Timeout' });
    });
    req.end();
  });
}

async function main() {
  await ensureFirebaseAuth();
  const snap = await getDocs(collection(db, 'artists'));
  console.log(`Found ${snap.size} documents in 'artists' collection.`);

  const list: any[] = [];
  for (const d of snap.docs) {
    const data = d.data();
    const docId = d.id;
    const profileUrl = data.profileImageUrl || data.image || data.profileImage;
    let urlCheck = null;
    if (profileUrl && (profileUrl.startsWith('http://') || profileUrl.startsWith('https://'))) {
      urlCheck = await checkUrl(profileUrl);
    }
    list.push({
      id: docId,
      nameKo: data.nameKo,
      nameEn: data.nameEn,
      slug: data.slug,
      isActive: data.isActive,
      order: data.order,
      profileImageUrl: data.profileImageUrl,
      image: data.image,
      profileImage: data.profileImage,
      urlCheck,
    });
  }

  // Also check production static URLs on https://www.tkm.kr
  const staticUrls = [
    'https://www.tkm.kr/images/actors/choi-eunseo-v5-8fe5a05d.jpg',
    'https://www.tkm.kr/images/actors/lee-eunsoo-v5-26e9ac09.jpg',
    'https://www.tkm.kr/images/actors/park-minwook-v5-973012cc.jpg',
    'https://www.tkm.kr/images/actors/park-hyunjin-v5-d3cb5da4.jpg',
  ];
  const staticChecks: any = {};
  for (const sUrl of staticUrls) {
    staticChecks[sUrl] = await checkUrl(sUrl);
  }

  const output = {
    totalDocs: snap.size,
    artists: list,
    staticChecks,
  };

  fs.writeFileSync('firestore-actors-dump.json', JSON.stringify(output, null, 2));
  console.log('Output written to firestore-actors-dump.json');
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});

