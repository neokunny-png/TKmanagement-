export interface FilmographyItem {
  id: string;
  year: string;
  title: string;
  role: string;
  category: 'Drama' | 'Movie' | 'Theater' | 'Commercial' | 'Music Video' | 'Other';
  note?: string;
}

export interface Artist {
  id: string;
  nameKo: string;
  nameEn: string;
  birth: string; // e.g. "2002.04.18"
  height: number; // in cm
  weight?: number; // in kg (optional)
  specialty: string[];
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
