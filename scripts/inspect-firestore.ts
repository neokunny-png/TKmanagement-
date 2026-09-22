import { db, ensureFirebaseAuth } from '../src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

async function main() {
  await ensureFirebaseAuth();
  const actors = [
    'artist-choi-eunseo',
    'artist-lee-eunsoo',
    'artist-park-minwook',
    'artist-park-hyunjin',
  ];
  const results: any = {};

  for (const id of actors) {
    const snap = await getDoc(doc(db, 'artists', id));
    if (snap.exists()) {
      const d = snap.data();
      results[id] = {
        nameKo: d.nameKo,
        nameEn: d.nameEn,
        profileImageUrl: d.profileImageUrl,
        image: d.image,
        profileImage: d.profileImage,
        photoUrl: d.photoUrl,
        imageUrl: d.imageUrl,
        galleryImagesCount: Array.isArray(d.galleryImages) ? d.galleryImages.length : 0,
      };
    } else {
      results[id] = 'DOES NOT EXIST';
    }
  }

  fs.writeFileSync('firestore-actors-dump.json', JSON.stringify(results, null, 2));
  console.log('Successfully written to firestore-actors-dump.json');
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
