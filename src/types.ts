export interface FilmographyItem {
  id: string;
  year: string;
  title: string;
  role: string;
  category: 'Drama' | 'Movie' | 'Theater' | 'CF(광고)' | 'CF' | 'Commercial' | 'Music Video' | 'Other';
  note?: string;
}

export const CATEGORY_ORDER: Record<string, number> = {
  'Drama': 1,
  'Movie': 2,
  'Theater': 3,
  'CF(광고)': 4,
  'CF': 4,
  'Commercial': 4,
  'Music Video': 5,
  'Other': 6,
};

export interface FilmographyGroup {
  categoryKey: string;
  categoryLabelEn: string;
  categoryLabelKo: string;
  categoryTitle: string;
  items: FilmographyItem[];
}

export const CATEGORY_DEFINITIONS: {
  key: string;
  aliases: string[];
  labelEn: string;
  labelKo: string;
  order: number;
}[] = [
  { key: 'Drama', aliases: ['Drama', '드라마', 'DRAMA', '드라마 (Drama)'], labelEn: 'DRAMA', labelKo: '드라마', order: 1 },
  { key: 'Movie', aliases: ['Movie', '영화', 'MOVIE', '영화 (Movie)'], labelEn: 'MOVIE', labelKo: '영화', order: 2 },
  { key: 'Theater', aliases: ['Theater', '연극', '뮤지컬', '연극/뮤지컬', 'THEATER', '연극 · 뮤지컬'], labelEn: 'THEATER', labelKo: '연극 · 뮤지컬', order: 3 },
  { key: 'CF', aliases: ['CF', 'CF(광고)', 'Commercial', '광고', 'CF & COMMERCIAL', '광고 (CF)'], labelEn: 'CF / COMMERCIAL', labelKo: '광고', order: 4 },
  { key: 'Music Video', aliases: ['Music Video', '뮤직비디오', 'MV', 'M/V'], labelEn: 'MUSIC VIDEO', labelKo: '뮤직비디오', order: 5 },
  { key: 'Other', aliases: ['Other', '기타', '기타 (Other)'], labelEn: 'OTHER', labelKo: '기타 활동', order: 6 },
];

export function getGroupedFilmography(items?: FilmographyItem[]): FilmographyGroup[] {
  if (!items || items.length === 0) return [];

  const groupsMap = new Map<string, { labelEn: string; labelKo: string; order: number; items: FilmographyItem[] }>();

  for (const item of items) {
    const rawCat = (item.category || 'Other').trim();
    let def = CATEGORY_DEFINITIONS.find(d => 
      d.key.toLowerCase() === rawCat.toLowerCase() || 
      d.aliases.some(a => a.toLowerCase() === rawCat.toLowerCase())
    );

    if (!def) {
      def = {
        key: rawCat,
        aliases: [rawCat],
        labelEn: rawCat.toUpperCase(),
        labelKo: rawCat,
        order: 99
      };
    }

    if (!groupsMap.has(def.key)) {
      groupsMap.set(def.key, {
        labelEn: def.labelEn,
        labelKo: def.labelKo,
        order: def.order,
        items: []
      });
    }

    groupsMap.get(def.key)!.items.push(item);
  }

  const sortedGroups: FilmographyGroup[] = [];
  for (const [key, groupData] of groupsMap.entries()) {
    const sortedItems = [...groupData.items].sort((a, b) => {
      const matchA = a.year ? a.year.match(/\d{4}/) : null;
      const matchB = b.year ? b.year.match(/\d{4}/) : null;
      if (matchA && matchB) {
        const yearDiff = parseInt(matchB[0], 10) - parseInt(matchA[0], 10);
        if (yearDiff !== 0) return yearDiff;
      }
      return (b.year || '').localeCompare(a.year || '', undefined, { numeric: true });
    });

    sortedGroups.push({
      categoryKey: key,
      categoryLabelEn: groupData.labelEn,
      categoryLabelKo: groupData.labelKo,
      categoryTitle: groupData.labelEn,
      items: sortedItems
    });
  }

  return sortedGroups.sort((a, b) => {
    const defA = CATEGORY_DEFINITIONS.find(d => d.key === a.categoryKey)?.order ?? 99;
    const defB = CATEGORY_DEFINITIONS.find(d => d.key === b.categoryKey)?.order ?? 99;
    return defA - defB;
  });
}

export function getCategoryWeight(category?: string): number {
  if (!category) return 99;
  return CATEGORY_ORDER[category] ?? 90;
}

export function sortFilmographyByCategoryAndYear(items?: FilmographyItem[]): FilmographyItem[] {
  if (!items || items.length === 0) return [];
  return [...items].sort((a, b) => {
    const catA = getCategoryWeight(a.category);
    const catB = getCategoryWeight(b.category);
    if (catA !== catB) {
      return catA - catB;
    }

    const matchA = a.year ? a.year.match(/\d{4}/) : null;
    const matchB = b.year ? b.year.match(/\d{4}/) : null;
    if (matchA && matchB) {
      const yearDiff = parseInt(matchB[0], 10) - parseInt(matchA[0], 10);
      if (yearDiff !== 0) return yearDiff;
    }
    return (b.year || '').localeCompare(a.year || '', undefined, { numeric: true });
  });
}

export const sortFilmographyByYear = sortFilmographyByCategoryAndYear;

export interface Artist {
  id: string;
  nameKo: string;
  nameEn: string;
  birth: string; // e.g. "2002.04.18"
  height: number; // in cm
  weight?: number; // in kg (optional)
  specialty?: string[];
  education: string;
  languages?: string[];
  agency?: string;
  instagram?: string;
  profileImage: string;
  galleryImages: string[];
  showreelUrl?: string;
  bio?: string;
  filmography: FilmographyItem[];
  isActive: boolean;
  order: number;
  gender: 'Female' | 'Male';
  createdAt?: number;
  updatedAt?: number;
}

export type AuditionStatus = 'pending' | 'reviewed' | 'interview' | 'passed' | 'rejected';

export interface AuditionApplication {
  id: string;
  applicationNumber: string;
  name: string;
  birth: string;
  gender: 'Female' | 'Male';
  phone: string;
  email: string;
  height: string;
  weight: string;
  instagram?: string;
  youtube?: string;
  specialty: string;
  bio: string;
  experience?: string;
  photoUrlFace?: string;
  photoUrlFull?: string;
  videoUrl?: string;
  status: AuditionStatus;
  adminNotes?: string;
  rating?: number;
  submittedAt: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Notice' | 'Casting' | 'Media' | 'Interview' | 'Company';
  date: string;
  summary: string;
  content: string;
  coverImage?: string;
  isPinned?: boolean;
  author?: string;
  createdAt: number;
}

export interface InquiryMessage {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  category: 'Casting' | 'Business' | 'Media' | 'General';
  targetActorId?: string;
  targetActorName?: string;
  subject: string;
  message: string;
  status: 'unread' | 'in_progress' | 'completed';
  createdAt: number;
}
