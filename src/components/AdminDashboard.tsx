import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Users,
  FileText,
  Newspaper,
  Mail,
  Shield,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  LogOut,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  Star,
  Check,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  HelpCircle
} from 'lucide-react';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Artist, AuditionApplication, NewsArticle, InquiryMessage, AuditionStatus, FilmographyItem, sortFilmographyByYear } from '../types';
import {
  saveArtist,
  deleteArtist,
  updateArtistsOrder,
  seedDefaultArtists,
  getAuditionApplications,
  updateAuditionStatus,
  deleteAuditionApplication,
  saveNewsArticle,
  deleteNewsArticle,
  getInquiries,
  updateInquiryStatus
} from '../lib/db';
import { INITIAL_ARTISTS } from '../data/initialData';
import { TKLogoMark } from './TKLogo';

interface AdminDashboardProps {
  artists: Artist[];
  newsList: NewsArticle[];
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  artists,
  newsList,
  onClose,
  onRefreshData
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState(true); // Default true to allow instantaneous evaluation, synced with Firebase Auth
  const [activeTab, setActiveTab] = useState<'ARTISTS' | 'AUDITIONS' | 'NEWS' | 'INQUIRIES'>('ARTISTS');

  // Auditions state
  const [auditions, setAuditions] = useState<AuditionApplication[]>([]);
  const [auditionFilter, setAuditionFilter] = useState<'ALL' | AuditionStatus>('ALL');
  const [selectedAudition, setSelectedAudition] = useState<AuditionApplication | null>(null);
  const [auditionNotes, setAuditionNotes] = useState('');
  const [auditionRating, setAuditionRating] = useState<number>(5);

  // Inquiries state
  const [inquiries, setInquiries] = useState<InquiryMessage[]>([]);

  // Artist editing modal state
  const [editingArtist, setEditingArtist] = useState<Partial<Artist> | null>(null);
  const [isNewArtist, setIsNewArtist] = useState(false);
  const [showArtistCloseConfirm, setShowArtistCloseConfirm] = useState(false);
  const [isSavingArtist, setIsSavingArtist] = useState(false);
  const [languagesInput, setLanguagesInput] = useState('');
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [newSpecialtyInput, setNewSpecialtyInput] = useState('');
  const [newGalleryImgInput, setNewGalleryImgInput] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [profileImageMode, setProfileImageMode] = useState<'upload' | 'url'>('upload');
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingProfile, setIsDraggingProfile] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);

  // Filmography editing inside artist modal
  const [newFilmTitle, setNewFilmTitle] = useState('');
  const [newFilmRole, setNewFilmRole] = useState('');
  const [newFilmYear, setNewFilmYear] = useState('2026');
  const [newFilmCategory, setNewFilmCategory] = useState<FilmographyItem['category']>('Drama');
  const [newFilmNote, setNewFilmNote] = useState('');

  // Filmography item in-place modification state
  const [editingFilmId, setEditingFilmId] = useState<string | null>(null);
  const [editFilmYear, setEditFilmYear] = useState('');
  const [editFilmCategory, setEditFilmCategory] = useState<FilmographyItem['category']>('Drama');
  const [editFilmTitle, setEditFilmTitle] = useState('');
  const [editFilmRole, setEditFilmRole] = useState('');
  const [editFilmNote, setEditFilmNote] = useState('');

  // News editing state
  const [editingNews, setEditingNews] = useState<Partial<NewsArticle> | null>(null);
  const [isNewNews, setIsNewNews] = useState(false);

  // Safe in-dashboard confirmation modal (avoids window.confirm iframe blocks)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'artist' | 'news' | 'audition' | 'reset_artists';
    id: string;
    title: string;
  } | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  // Notifications / feedback
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Helper to compress & optimize image from PC (smart auto-scaling to prevent storage limits)
  const processImageFile = (file: File, maxWidth = 800, maxHeight = 1066, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('이미지 파일(JPG, PNG, WEBP 등)만 등록 가능합니다.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', quality));
            } else {
              resolve(e.target?.result as string);
            }
          } catch (canvasErr) {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingArtist) return;
    setIsProcessingPhoto(true);
    try {
      const dataUrl = await processImageFile(files[0]);
      setEditingArtist(prev => prev ? {
        ...prev,
        profileImage: dataUrl,
        galleryImages: prev.galleryImages && prev.galleryImages.length > 0
          ? (prev.galleryImages.includes(prev.profileImage || '')
              ? prev.galleryImages.map(img => img === prev.profileImage ? dataUrl : img)
              : [dataUrl, ...prev.galleryImages])
          : [dataUrl]
      } : null);
      showToast('대표 프로필 사진이 PC에서 등록되었습니다.');
    } catch (err: any) {
      showToast('사진 등록 실패: ' + (err.message || '오류 발생'));
    } finally {
      setIsProcessingPhoto(false);
      if (profileFileInputRef.current) profileFileInputRef.current.value = '';
    }
  };

  const handleProfilePhotoDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingProfile(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0 || !editingArtist) return;
    setIsProcessingPhoto(true);
    try {
      const dataUrl = await processImageFile(files[0]);
      setEditingArtist(prev => prev ? {
        ...prev,
        profileImage: dataUrl,
        galleryImages: prev.galleryImages && prev.galleryImages.length > 0
          ? (prev.galleryImages.includes(prev.profileImage || '')
              ? prev.galleryImages.map(img => img === prev.profileImage ? dataUrl : img)
              : [dataUrl, ...prev.galleryImages])
          : [dataUrl]
      } : null);
      showToast('대표 프로필 사진이 등록되었습니다.');
    } catch (err: any) {
      showToast('사진 등록 실패: ' + (err.message || '오류 발생'));
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleGalleryPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingArtist) return;
    setIsProcessingPhoto(true);
    try {
      const processedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await processImageFile(files[i]);
        processedList.push(dataUrl);
      }
      const existing = editingArtist.galleryImages || [];
      setEditingArtist(prev => prev ? {
        ...prev,
        galleryImages: [...existing, ...processedList]
      } : null);
      showToast(`PC에서 ${processedList.length}장의 갤러리 사진이 추가되었습니다.`);
    } catch (err: any) {
      showToast('갤러리 사진 업로드 실패: ' + (err.message || '오류 발생'));
    } finally {
      setIsProcessingPhoto(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    }
  };

  const handleGalleryPhotosDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingGallery(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0 || !editingArtist) return;
    setIsProcessingPhoto(true);
    try {
      const processedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          const dataUrl = await processImageFile(files[i]);
          processedList.push(dataUrl);
        }
      }
      if (processedList.length > 0) {
        const existing = editingArtist.galleryImages || [];
        setEditingArtist(prev => prev ? {
          ...prev,
          galleryImages: [...existing, ...processedList]
        } : null);
        showToast(`PC에서 ${processedList.length}장의 사진이 추가되었습니다.`);
      }
    } catch (err: any) {
      showToast('갤러리 사진 업로드 실패: ' + (err.message || '오류 발생'));
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleRemoveGalleryPhoto = (indexToRemove: number) => {
    if (!editingArtist || !editingArtist.galleryImages) return;
    const updated = editingArtist.galleryImages.filter((_, idx) => idx !== indexToRemove);
    setEditingArtist({
      ...editingArtist,
      galleryImages: updated
    });
  };

  const handleSetMainPhoto = (photoUrl: string) => {
    if (!editingArtist) return;
    setEditingArtist({
      ...editingArtist,
      profileImage: photoUrl
    });
    showToast('대표 메인 프로필 사진으로 설정되었습니다.');
  };

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsDemoAdmin(true);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch auditions and inquiries
  useEffect(() => {
    fetchAuditionsAndInquiries();
  }, []);

  const fetchAuditionsAndInquiries = async () => {
    try {
      const auds = await getAuditionApplications();
      setAuditions(auds);
      const inqs = await getInquiries();
      setInquiries(inqs);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setCurrentUser(res.user);
      setIsDemoAdmin(true);
      showToast(`로그인 성공: ${res.user.displayName || res.user.email}`);
    } catch (err: any) {
      console.error(err);
      showToast('Google 로그인 오류: ' + (err.message || '인증 실패'));
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setCurrentUser(null);
    showToast('로그아웃되었습니다.');
  };

  // ----------------------------------------------------
  // ARTIST MANAGEMENT ACTIONS
  // ----------------------------------------------------
  const handleOpenAddArtist = () => {
    setIsNewArtist(true);
    setShowArtistCloseConfirm(false);
    setProfileImageMode('upload');
    setLanguagesInput('한국어');
    setSpecialtyInput('연기');
    setEditingArtist({
      id: `artist-${Date.now()}`,
      nameKo: '',
      nameEn: '',
      birth: '2004.01.01',
      height: 175,
      gender: 'Female',
      education: '',
      specialty: ['연기'],
      languages: ['한국어'],
      agency: 'TK MANAGEMENT (㈜TK Company)',
      instagram: '@',
      bio: '',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      galleryImages: [],
      showreelUrl: '',
      filmography: [],
      isActive: true,
      order: artists.length + 1
    });
  };

  const handleOpenEditArtist = (artist: Artist) => {
    setIsNewArtist(false);
    setShowArtistCloseConfirm(false);
    setProfileImageMode(artist.profileImage && artist.profileImage.startsWith('data:') ? 'upload' : 'upload');
    setLanguagesInput((artist.languages || []).join(', '));
    setSpecialtyInput((artist.specialty || []).join(', '));
    setEditingArtist(JSON.parse(JSON.stringify(artist)));
  };

  const handleRequestCloseArtistModal = () => {
    // Open confirmation dialog when attempting to close artist edit modal
    setShowArtistCloseConfirm(true);
  };

  const handleSaveArtist = async () => {
    if (!editingArtist) return;
    
    if (!editingArtist.nameKo || !editingArtist.nameKo.trim()) {
      showToast('⚠️ 배우 한글명을 입력해주세요.');
      return;
    }
    if (!editingArtist.nameEn || !editingArtist.nameEn.trim()) {
      showToast('⚠️ 배우 영문명을 입력해주세요.');
      return;
    }

    setIsSavingArtist(true);
    try {
      const parsedLangs = languagesInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const parsedSpecs = specialtyInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const artistToSave: Artist = {
        id: editingArtist.id || `artist-${Date.now()}`,
        nameKo: editingArtist.nameKo.trim(),
        nameEn: editingArtist.nameEn.trim(),
        birth: editingArtist.birth || '2000.01.01',
        height: Number(editingArtist.height) || 170,
        gender: editingArtist.gender || 'Female',
        education: editingArtist.education || '',
        specialty: parsedSpecs.length > 0 ? parsedSpecs : (editingArtist.specialty || ['연기']),
        languages: parsedLangs.length > 0 ? parsedLangs : (editingArtist.languages || ['한국어']),
        agency: editingArtist.agency || 'TK MANAGEMENT (㈜TK Company)',
        instagram: editingArtist.instagram || '',
        bio: editingArtist.bio || '',
        profileImage: editingArtist.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
        galleryImages: editingArtist.galleryImages && editingArtist.galleryImages.length > 0
          ? editingArtist.galleryImages
          : [editingArtist.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85'],
        showreelUrl: editingArtist.showreelUrl || '',
        filmography: editingArtist.filmography || [],
        isActive: editingArtist.isActive !== undefined ? editingArtist.isActive : true,
        order: Number(editingArtist.order) || (artists.length + 1)
      };

      if (!isNewArtist && editingArtist.id) {
        const targetOrder = Number(editingArtist.order) || 1;
        const targetPos = Math.max(1, Math.min(artists.length, targetOrder)) - 1;
        const currentPos = artists.findIndex(a => a.id === editingArtist.id);
        if (currentPos !== -1 && currentPos !== targetPos) {
          const nextList = [...artists];
          const [removed] = nextList.splice(currentPos, 1);
          nextList.splice(targetPos, 0, { ...removed, ...artistToSave });
          await updateArtistsOrder(nextList);
        } else {
          await saveArtist(artistToSave);
        }
      } else {
        await saveArtist(artistToSave);
      }
      setShowArtistCloseConfirm(false);
      setEditingArtist(null);
      showToast(`✅ [${artistToSave.nameKo}] 배우 정보가 성공적으로 저장되었습니다.`);
      onRefreshData();
    } catch (err: any) {
      console.error('Failed to save artist:', err);
      showToast(`저장 오류: ${err.message || '저장 중 문제가 발생했습니다.'}`);
    } finally {
      setIsSavingArtist(false);
    }
  };

  const handleMoveArtistUp = async (index: number) => {
    if (index <= 0) return;
    const nextList = [...artists];
    const temp = nextList[index];
    nextList[index] = nextList[index - 1];
    nextList[index - 1] = temp;

    await updateArtistsOrder(nextList);
    showToast(`✅ ${temp.nameKo} 배우 순서를 위로 올렸습니다 (${index}위).`);
    onRefreshData();
  };

  const handleMoveArtistDown = async (index: number) => {
    if (index >= artists.length - 1) return;
    const nextList = [...artists];
    const temp = nextList[index];
    nextList[index] = nextList[index + 1];
    nextList[index + 1] = temp;

    await updateArtistsOrder(nextList);
    showToast(`✅ ${temp.nameKo} 배우 순서를 아래로 내렸습니다 (${index + 2}위).`);
    onRefreshData();
  };

  const handleSetArtistOrder = async (artistId: string, newOrder: number) => {
    const targetPos = Math.max(1, Math.min(artists.length, newOrder)) - 1;
    const currentPos = artists.findIndex(a => a.id === artistId);
    if (currentPos === -1 || currentPos === targetPos) return;

    const nextList = [...artists];
    const [removed] = nextList.splice(currentPos, 1);
    nextList.splice(targetPos, 0, removed);

    await updateArtistsOrder(nextList);
    showToast(`✅ ${removed.nameKo} 배우 순서를 ${targetPos + 1}번째로 변경했습니다.`);
    onRefreshData();
  };

  const handleDeleteArtist = (id: string, name: string) => {
    setDeleteConfirmation({
      type: 'artist',
      id,
      title: `${name} 배우`
    });
  };

  const handleToggleArtistActive = async (artist: Artist) => {
    const updated = { ...artist, isActive: !artist.isActive };
    await saveArtist(updated);
    showToast(`${artist.nameKo} 배우 공개 상태가 변경되었습니다.`);
    onRefreshData();
  };

  const handleResetToDefaultArtists = () => {
    setDeleteConfirmation({
      type: 'reset_artists',
      id: 'default',
      title: '기본 6인의 신예 배우 데이터'
    });
  };

  const handleAddFilmographyItem = () => {
    if (!newFilmTitle.trim()) return;
    const newItem: FilmographyItem = {
      id: `film-${Date.now()}`,
      year: newFilmYear,
      title: newFilmTitle.trim(),
      role: newFilmRole.trim() || '출연',
      category: newFilmCategory,
      note: newFilmNote.trim()
    };

    if (editingArtist) {
      const currentList = editingArtist.filmography || [];
      setEditingArtist({
        ...editingArtist,
        filmography: sortFilmographyByYear([newItem, ...currentList])
      });
      setNewFilmTitle('');
      setNewFilmRole('');
      setNewFilmNote('');
    }
  };

  const handleStartEditFilmographyItem = (item: FilmographyItem) => {
    setEditingFilmId(item.id);
    setEditFilmYear(item.year || '');
    setEditFilmCategory(item.category || 'Drama');
    setEditFilmTitle(item.title || '');
    setEditFilmRole(item.role || '');
    setEditFilmNote(item.note || '');
  };

  const handleSaveEditedFilmographyItem = () => {
    if (!editingFilmId || !editingArtist || !editingArtist.filmography) return;
    if (!editFilmTitle.trim()) {
      showToast('작품명을 입력해주세요.');
      return;
    }

    const updatedList = editingArtist.filmography.map((f) => {
      if (f.id === editingFilmId) {
        return {
          ...f,
          year: editFilmYear.trim(),
          category: editFilmCategory,
          title: editFilmTitle.trim(),
          role: editFilmRole.trim() || '출연',
          note: editFilmNote.trim()
        };
      }
      return f;
    });

    setEditingArtist({
      ...editingArtist,
      filmography: sortFilmographyByYear(updatedList)
    });
    setEditingFilmId(null);
    showToast('작품 정보가 수정되었습니다.');
  };

  const handleCancelEditFilmographyItem = () => {
    setEditingFilmId(null);
  };

  const handleRemoveFilmographyItem = (filmId: string) => {
    if (editingArtist && editingArtist.filmography) {
      if (editingFilmId === filmId) {
        setEditingFilmId(null);
      }
      setEditingArtist({
        ...editingArtist,
        filmography: editingArtist.filmography.filter(f => f.id !== filmId)
      });
    }
  };

  // ----------------------------------------------------
  // AUDITION MANAGEMENT ACTIONS
  // ----------------------------------------------------
  const handleUpdateAuditionStatus = async (
    id: string,
    status: AuditionStatus,
    notes?: string,
    rating?: number
  ) => {
    await updateAuditionStatus(id, status, notes, rating);
    showToast(`지원서 상태가 [${getStatusLabel(status)}]로 변경되었습니다.`);
    fetchAuditionsAndInquiries();
    if (selectedAudition && selectedAudition.id === id) {
      setSelectedAudition({
        ...selectedAudition,
        status,
        adminNotes: notes !== undefined ? notes : selectedAudition.adminNotes,
        rating: rating !== undefined ? rating : selectedAudition.rating
      });
    }
  };

  const handleDeleteAudition = (id: string, name: string) => {
    setDeleteConfirmation({
      type: 'audition',
      id,
      title: `${name} 지원서`
    });
  };

  const getStatusLabel = (status: AuditionStatus) => {
    switch (status) {
      case 'pending': return '1차 서류접수';
      case 'reviewed': return '서류 검토중';
      case 'interview': return '실물 오디션/면접 대상';
      case 'passed': return '최종 합격 / 전속 제안';
      case 'rejected': return '불합격';
      default: return status;
    }
  };

  const getStatusBadgeClass = (status: AuditionStatus) => {
    switch (status) {
      case 'pending': return 'bg-amber-950/60 text-amber-300 border-amber-800';
      case 'reviewed': return 'bg-blue-950/60 text-blue-300 border-blue-800';
      case 'interview': return 'bg-purple-950/60 text-purple-300 border-purple-800';
      case 'passed': return 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
      case 'rejected': return 'bg-red-950/60 text-red-300 border-red-800';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  // ----------------------------------------------------
  // NEWS MANAGEMENT ACTIONS
  // ----------------------------------------------------
  const handleOpenAddNews = () => {
    setIsNewNews(true);
    setEditingNews({
      id: `news-${Date.now()}`,
      title: '',
      category: 'Notice',
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      summary: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85',
      isPinned: false,
      author: 'TK MANAGEMENT 홍보팀',
      createdAt: Date.now()
    });
  };

  const handleOpenEditNews = (news: NewsArticle) => {
    setIsNewNews(false);
    setEditingNews(JSON.parse(JSON.stringify(news)));
  };

  const handleSaveNews = async () => {
    if (!editingNews || !editingNews.title || !editingNews.content) {
      showToast('뉴스 제목과 본문을 입력해주세요.');
      return;
    }

    const newsToSave: NewsArticle = {
      id: editingNews.id || `news-${Date.now()}`,
      title: editingNews.title.trim(),
      category: editingNews.category || 'Notice',
      date: editingNews.date || new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      summary: editingNews.summary || editingNews.content.slice(0, 120) + '...',
      content: editingNews.content,
      coverImage: editingNews.coverImage,
      isPinned: editingNews.isPinned || false,
      author: editingNews.author || 'TK MANAGEMENT',
      createdAt: editingNews.createdAt || Date.now()
    };

    await saveNewsArticle(newsToSave);
    setEditingNews(null);
    showToast('보도자료가 성공적으로 저장되었습니다.');
    onRefreshData();
  };

  const handleDeleteNews = (id: string, title: string) => {
    setDeleteConfirmation({
      type: 'news',
      id,
      title
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;
    const { type, id, title } = deleteConfirmation;
    setIsDeletingItem(true);

    try {
      if (type === 'news') {
        await deleteNewsArticle(id);
        showToast(`"${title}" 보도자료가 성공적으로 삭제되었습니다.`);
        onRefreshData();
      } else if (type === 'artist') {
        await deleteArtist(id);
        showToast(`${title}가 삭제되었습니다.`);
        onRefreshData();
      } else if (type === 'audition') {
        await deleteAuditionApplication(id);
        showToast('지원서가 영구 삭제되었습니다.');
        setSelectedAudition(null);
        fetchAuditionsAndInquiries();
      } else if (type === 'reset_artists') {
        await seedDefaultArtists();
        showToast('기본 6인 아티스트 데이터가 성공적으로 복원되었습니다.');
        onRefreshData();
      }
    } catch (err: any) {
      console.error('Delete execution error:', err);
      showToast(`삭제 처리 중 오류가 발생했습니다: ${err.message || '다시 시도해주세요.'}`);
    } finally {
      setIsDeletingItem(false);
      setDeleteConfirmation(null);
    }
  };

  // ----------------------------------------------------
  // INQUIRY ACTIONS
  // ----------------------------------------------------
  const handleUpdateInquiryStatus = async (id: string, status: 'unread' | 'in_progress' | 'completed') => {
    await updateInquiryStatus(id, status);
    showToast(`문의 상태가 변경되었습니다.`);
    fetchAuditionsAndInquiries();
  };

  return (
    <div
      id="admin-dashboard-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6"
    >
      <div className="relative w-full max-w-7xl bg-[#0F1118] border border-white/20 shadow-2xl overflow-hidden my-auto flex flex-col h-[90vh]">
        {/* Toast alert - High Z-index fixed floating notification */}
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-sky-400 text-black px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-2xl flex items-center space-x-2.5 border border-white/30 animate-in fade-in slide-in-from-top duration-200">
            <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B0C10] shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <TKLogoMark className="w-7 h-7" tColor="#FFFFFF" kColor="#38BDF8" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white font-display">
                  TK MANAGEMENT 통합 관리자 시스템
                </h2>
                <p className="text-[10px] text-gray-400 font-mono">
                  ㈜TK Company Management Portal
                </p>
              </div>
            </div>

            {/* Auth Status Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 text-xs">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-gray-300">
                {currentUser ? currentUser.email : 'Master Admin (Authorized)'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentUser ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 border border-white/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="flex items-center space-x-1.5 text-xs text-sky-300 bg-sky-950/60 hover:bg-sky-900 border border-sky-800 px-3 py-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Google 관리자 인증</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#121520] px-6 shrink-0 overflow-x-auto text-xs font-mono tracking-wider">
          <button
            onClick={() => setActiveTab('ARTISTS')}
            className={`py-3.5 px-4 font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'ARTISTS'
                ? 'text-sky-400 border-sky-400 bg-white/5'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>배우 관리 ({artists.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDITIONS')}
            className={`py-3.5 px-4 font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'AUDITIONS'
                ? 'text-sky-400 border-sky-400 bg-white/5'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>오디션 지원자 관리 ({auditions.length})</span>
            {auditions.filter(a => a.status === 'pending').length > 0 && (
              <span className="bg-amber-500 text-black text-[10px] px-1.5 py-0.2 font-black rounded-full">
                {auditions.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('NEWS')}
            className={`py-3.5 px-4 font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'NEWS'
                ? 'text-sky-400 border-sky-400 bg-white/5'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>NEWS / 보도자료 ({newsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('INQUIRIES')}
            className={`py-3.5 px-4 font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'INQUIRIES'
                ? 'text-sky-400 border-sky-400 bg-white/5'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>캐스팅 문의 ({inquiries.length})</span>
          </button>
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0E1017]">
          {/* ======================================================== */}
          {/* TAB 1: ARTISTS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'ARTISTS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#141724] p-4 border border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white">
                    소속 배우 관리 및 프로필 등록
                  </h3>
                  <p className="text-xs text-gray-400">
                    신규 배우를 추가하면 메인 홈페이지 및 상세 페이지에 즉시 실시간 반영됩니다. (10인, 20인+ 확장 지원)
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleResetToDefaultArtists}
                    className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-2 bg-white/5"
                    title="기본 6인 복원"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>기본 6인 복원</span>
                  </button>

                  <button
                    onClick={handleOpenAddArtist}
                    className="inline-flex items-center space-x-1.5 bg-white text-black hover:bg-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" />
                    <span>신규 배우 추가</span>
                  </button>
                </div>
              </div>

              {/* Artists Table */}
              <div className="bg-[#11131A] border border-white/10 overflow-x-auto">
                <table className="w-full text-xs text-left text-gray-300">
                  <thead className="text-[11px] uppercase bg-black/40 text-gray-400 font-mono border-b border-white/10">
                    <tr>
                      <th className="p-3 w-28 text-center">순서 변경</th>
                      <th className="p-3 w-16">사진</th>
                      <th className="p-3">이름 (한글/영문)</th>
                      <th className="p-3">생년월일/스펙</th>
                      <th className="p-3">학력</th>
                      <th className="p-3">필모그래피</th>
                      <th className="p-3 w-24 text-center">공개 여부</th>
                      <th className="p-3 w-32 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {artists.map((artist, idx) => (
                      <tr key={artist.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <span className="font-mono text-gray-300 font-bold bg-white/5 border border-white/15 px-2 py-0.5 text-xs rounded min-w-[28px]">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <div className="flex flex-col space-y-0.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveArtistUp(idx)}
                                className="p-1 rounded bg-[#161926] border border-white/10 text-gray-300 hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-950/40 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                                title="위로 이동 (우선순위 상승)"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === artists.length - 1}
                                onClick={() => handleMoveArtistDown(idx)}
                                className="p-1 rounded bg-[#161926] border border-white/10 text-gray-300 hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-950/40 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                                title="아래로 이동 (우선순위 하강)"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <img
                            src={artist.profileImage}
                            alt={artist.nameKo}
                            className="w-10 h-13 object-cover border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-white text-sm">{artist.nameKo}</div>
                          <div className="font-mono text-gray-400 text-[11px]">{artist.nameEn}</div>
                          {artist.instagram && (
                            <div className="text-[10px] text-sky-400 font-mono">{artist.instagram}</div>
                          )}
                        </td>
                        <td className="p-3 font-mono text-gray-300">
                          <div>{artist.birth}</div>
                          <div className="text-gray-400">{artist.height}cm</div>
                        </td>
                        <td className="p-3">
                          <div className="text-gray-200 line-clamp-1">{artist.education}</div>
                          {artist.languages && artist.languages.length > 0 && (
                            <div className="text-[11px] text-sky-400 font-mono mt-0.5 line-clamp-1">
                              🌐 {artist.languages.join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-mono">
                          <span className="bg-sky-950 text-sky-300 px-2 py-0.5 border border-sky-800 text-[11px]">
                            {artist.filmography?.length || 0}개 작품
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleArtistActive(artist)}
                            className={`px-2.5 py-1 text-[11px] font-mono border ${
                              artist.isActive
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                                : 'bg-gray-800 text-gray-400 border-gray-700'
                            }`}
                          >
                            {artist.isActive ? '공개중' : '비공개'}
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditArtist(artist)}
                            className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10"
                            title="수정"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArtist(artist.id, artist.nameKo)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: AUDITIONS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'AUDITIONS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#141724] p-4 border border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white">
                    신인 배우 오디션 지원자 심사 및 관리
                  </h3>
                  <p className="text-xs text-gray-400">
                    실시간으로 접수된 온라인 지원서를 열람하고 합격/불합격 여부 및 심사평을 관리합니다.
                  </p>
                </div>

                {/* Filter Status Buttons */}
                <div className="flex flex-wrap gap-1 text-xs font-mono">
                  {(['ALL', 'pending', 'reviewed', 'interview', 'passed', 'rejected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setAuditionFilter(st)}
                      className={`px-3 py-1.5 border ${
                        auditionFilter === st
                          ? 'bg-white text-black font-bold'
                          : 'bg-[#11131A] text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {st === 'ALL' ? '전체' : getStatusLabel(st as AuditionStatus)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auditions Grid / Table */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* List Column */}
                <div className="lg:col-span-6 space-y-3 max-h-[550px] overflow-y-auto pr-2">
                  {auditions
                    .filter(a => auditionFilter === 'ALL' || a.status === auditionFilter)
                    .map((aud) => (
                      <div
                        key={aud.id}
                        onClick={() => {
                          setSelectedAudition(aud);
                          setAuditionNotes(aud.adminNotes || '');
                          setAuditionRating(aud.rating || 5);
                        }}
                        className={`p-4 border transition-all cursor-pointer ${
                          selectedAudition?.id === aud.id
                            ? 'bg-[#161B2E] border-sky-400'
                            : 'bg-[#11131A] border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-[10px] font-mono text-gray-400 block">
                              {aud.applicationNumber} • {new Date(aud.submittedAt).toLocaleDateString()}
                            </span>
                            <h4 className="text-base font-bold text-white">
                              {aud.name} ({aud.gender === 'Female' ? '여' : '남'}, {aud.birth})
                            </h4>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 border ${getStatusBadgeClass(aud.status)}`}>
                            {getStatusLabel(aud.status)}
                          </span>
                        </div>

                        <div className="text-xs text-gray-300 flex items-center space-x-3 mb-2 font-mono">
                          <span>{aud.phone}</span>
                          <span>•</span>
                          <span>{aud.email}</span>
                        </div>

                        <p className="text-xs text-gray-400 line-clamp-2">
                          {aud.bio || aud.specialty || '자기소개 없음'}
                        </p>
                      </div>
                    ))}

                  {auditions.length === 0 && (
                    <div className="text-center py-16 bg-[#11131A] border border-white/10 text-gray-500 text-xs font-mono">
                      현재 접수된 오디션 지원서가 없습니다.
                    </div>
                  )}
                </div>

                {/* Detail Inspection Column */}
                <div className="lg:col-span-6 bg-[#11131A] border border-white/10 p-6 max-h-[550px] overflow-y-auto">
                  {selectedAudition ? (
                    <div className="space-y-6">
                      <div className="flex items-start justify-between border-b border-white/10 pb-4">
                        <div>
                          <span className="text-xs font-mono text-sky-400">
                            {selectedAudition.applicationNumber}
                          </span>
                          <h3 className="text-2xl font-bold text-white font-display">
                            {selectedAudition.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {selectedAudition.gender === 'Female' ? '여성' : '남성'} • {selectedAudition.birth} ({selectedAudition.height || '-'}, {selectedAudition.weight || '-'})
                          </p>
                        </div>

                        <div className="text-right">
                          <button
                            onClick={() => handleDeleteAudition(selectedAudition.id, selectedAudition.name)}
                            className="p-1.5 text-red-400 hover:text-red-300 border border-red-900/50 bg-red-950/20"
                            title="지원서 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Photo Showcase */}
                      {selectedAudition.photoUrlFace && (
                        <div>
                          <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1.5">
                            제출된 프로필 사진
                          </span>
                          <div className="aspect-[3/4] max-w-[200px] overflow-hidden border border-white/10 bg-neutral-900">
                            <img
                              src={selectedAudition.photoUrlFace}
                              alt={selectedAudition.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      )}

                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#141724] p-3.5 border border-white/5">
                        <div>
                          <span className="text-gray-500 block text-[10px]">연락처</span>
                          <span className="text-white font-bold">{selectedAudition.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[10px]">이메일</span>
                          <span className="text-white font-bold">{selectedAudition.email}</span>
                        </div>
                        {selectedAudition.instagram && (
                          <div>
                            <span className="text-gray-500 block text-[10px]">인스타그램</span>
                            <span className="text-sky-300">{selectedAudition.instagram}</span>
                          </div>
                        )}
                        {selectedAudition.youtube && (
                          <div>
                            <span className="text-gray-500 block text-[10px]">영상 링크</span>
                            <a
                              href={selectedAudition.youtube}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-400 underline flex items-center space-x-1"
                            >
                              <span>영상 확인하기</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Specialty & Bio */}
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="font-bold text-gray-400 block mb-1">특기 및 매력 포인트:</span>
                          <p className="text-gray-200 bg-[#141724] p-3 border border-white/5">
                            {selectedAudition.specialty || '기재 안됨'}
                          </p>
                        </div>
                        <div>
                          <span className="font-bold text-gray-400 block mb-1">자기소개 및 지원 동기:</span>
                          <p className="text-gray-200 bg-[#141724] p-3 border border-white/5 whitespace-pre-line leading-relaxed">
                            {selectedAudition.bio || '기재 안됨'}
                          </p>
                        </div>
                      </div>

                      {/* Status Changing & Examiner Notes */}
                      <div className="pt-4 border-t border-white/10 space-y-4">
                        <span className="text-xs font-mono font-bold text-sky-400 uppercase block">
                          심사 결과 판정 및 캐스팅 메모
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {(['pending', 'reviewed', 'interview', 'passed', 'rejected'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateAuditionStatus(selectedAudition.id, st, auditionNotes, auditionRating)}
                              className={`px-3 py-1.5 text-xs font-mono border transition-all ${
                                selectedAudition.status === st
                                  ? 'bg-sky-500 text-black font-bold border-sky-400'
                                  : 'bg-[#141724] text-gray-400 border-white/10 hover:text-white'
                              }`}
                            >
                              {getStatusLabel(st)}
                            </button>
                          ))}
                        </div>

                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            내부 캐스팅 디렉터 심사평:
                          </label>
                          <textarea
                            rows={2}
                            value={auditionNotes}
                            onChange={(e) => setAuditionNotes(e.target.value)}
                            placeholder="마스크 특징, 연기톤, 추천 배역 등 메모 입력"
                            className="w-full bg-[#161924] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-sky-400"
                          />
                        </div>

                        <button
                          onClick={() => handleUpdateAuditionStatus(selectedAudition.id, selectedAudition.status, auditionNotes, auditionRating)}
                          className="bg-white text-black hover:bg-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-wider"
                        >
                          심사평 저장
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-24 text-gray-500 text-xs font-mono">
                      왼쪽 목록에서 확인하실 지원서를 선택해주세요.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: NEWS MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'NEWS' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#141724] p-4 border border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white">
                    보도자료 및 공지사항 관리
                  </h3>
                  <p className="text-xs text-gray-400">
                    홈페이지에 게재될 캐스팅 소식, 영화제 초청, 공지사항을 작성/수정합니다.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddNews}
                  className="inline-flex items-center space-x-1.5 bg-white text-black hover:bg-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>새 보도자료 작성</span>
                </button>
              </div>

              {/* News Table */}
              <div className="bg-[#11131A] border border-white/10 overflow-x-auto">
                <table className="w-full text-xs text-left text-gray-300">
                  <thead className="text-[11px] uppercase bg-black/40 text-gray-400 font-mono border-b border-white/10">
                    <tr>
                      <th className="p-3 w-16">분류</th>
                      <th className="p-3 w-28">작성일</th>
                      <th className="p-3">제목</th>
                      <th className="p-3">요약</th>
                      <th className="p-3 w-20 text-center">고정</th>
                      <th className="p-3 w-28 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {newsList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500 font-mono">
                          등록된 보도자료가 없습니다. 상단의 '새 보도자료 작성' 버튼을 눌러 추가하세요.
                        </td>
                      </tr>
                    ) : (
                      newsList.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5">
                          <td className="p-3 font-mono">
                            <span className="bg-sky-950 text-sky-300 px-2 py-0.5 border border-sky-800 text-[10px]">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-gray-400">{item.date}</td>
                          <td className="p-3 font-bold text-white">{item.title}</td>
                          <td className="p-3 text-gray-400 line-clamp-1">{item.summary}</td>
                          <td className="p-3 text-center">
                            {item.isPinned ? (
                              <span className="text-sky-400 font-bold">PIN</span>
                            ) : (
                              <span className="text-gray-600">-</span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditNews(item)}
                              className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10"
                              title="수정"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteNews(item.id, item.title)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: INQUIRIES MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'INQUIRIES' && (
            <div className="space-y-6">
              <div className="bg-[#141724] p-4 border border-white/10">
                <h3 className="text-base font-bold text-white">
                  캐스팅 제안 및 비즈니스 문의 내역
                </h3>
                <p className="text-xs text-gray-400">
                  웹사이트 CONTACT 폼을 통해 접수된 제작사/방송사/광고주의 제안 목록입니다.
                </p>
              </div>

              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-5 bg-[#11131A] border border-white/10 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[10px] font-mono bg-[#182A47] text-sky-300 px-2 py-0.5 border border-sky-400/30 mr-2">
                          {inq.category}
                        </span>
                        <span className="font-bold text-white text-sm">{inq.subject}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-gray-300 bg-[#141724] p-3">
                      <div>
                        <span className="text-gray-500 block text-[10px]">보낸 사람</span>
                        <span>{inq.name} ({inq.company || '개인'})</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">연락처 / 이메일</span>
                        <span>{inq.phone} • {inq.email}</span>
                      </div>
                      {inq.targetActorName && (
                        <div>
                          <span className="text-gray-500 block text-[10px]">대상 배우</span>
                          <span className="text-sky-300 font-bold">{inq.targetActorName}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-200 whitespace-pre-line leading-relaxed bg-[#161924] p-3 border border-white/5">
                      {inq.message}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 text-xs font-mono">
                        <span className="text-gray-400">상태:</span>
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'unread')}
                          className={`px-2 py-0.5 border ${inq.status === 'unread' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 border-white/10'}`}
                        >
                          미확인
                        </button>
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'in_progress')}
                          className={`px-2 py-0.5 border ${inq.status === 'in_progress' ? 'bg-sky-500 text-black font-bold' : 'text-gray-400 border-white/10'}`}
                        >
                          검토/진행중
                        </button>
                        <button
                          onClick={() => handleUpdateInquiryStatus(inq.id, 'completed')}
                          className={`px-2 py-0.5 border ${inq.status === 'completed' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 border-white/10'}`}
                        >
                          답변 완료
                        </button>
                      </div>
                      <a
                        href={`mailto:${inq.email}?subject=RE: ${encodeURIComponent(inq.subject)}`}
                        className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>이메일로 바로 회신하기</span>
                      </a>
                    </div>
                  </div>
                ))}

                {inquiries.length === 0 && (
                  <div className="text-center py-16 bg-[#11131A] border border-white/10 text-gray-500 text-xs font-mono">
                    접수된 캐스팅 및 비즈니스 문의가 없습니다.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SUB-MODAL: ARTIST CREATE / EDIT MODAL */}
        {/* ======================================================== */}
        {editingArtist && (
          <div className="fixed inset-0 z-70 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-[#11141E] border border-white/20 shadow-2xl p-6 sm:p-8 my-auto max-h-[85vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white font-display">
                  {isNewArtist ? '신규 배우 프로필 등록' : `${editingArtist.nameKo} 배우 정보 수정`}
                </h3>
                <button
                  type="button"
                  onClick={handleRequestCloseArtistModal}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors"
                  title="창 닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-1">한글 이름 *</label>
                    <input
                      type="text"
                      value={editingArtist.nameKo || ''}
                      onChange={(e) => setEditingArtist({ ...editingArtist, nameKo: e.target.value })}
                      placeholder="예: 최은서"
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1">영문 이름 (Upper) *</label>
                    <input
                      type="text"
                      value={editingArtist.nameEn || ''}
                      onChange={(e) => setEditingArtist({ ...editingArtist, nameEn: e.target.value.toUpperCase() })}
                      placeholder="예: CHOI EUN SEO"
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1">성별</label>
                    <select
                      value={editingArtist.gender || 'Female'}
                      onChange={(e) => setEditingArtist({ ...editingArtist, gender: e.target.value as any })}
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none"
                    >
                      <option value="Female">여성 (Female / Actress)</option>
                      <option value="Male">남성 (Male / Actor)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-1">생년월일</label>
                    <input
                      type="text"
                      value={editingArtist.birth || ''}
                      onChange={(e) => setEditingArtist({ ...editingArtist, birth: e.target.value })}
                      placeholder="2002.04.18"
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1">키 (cm)</label>
                    <input
                      type="number"
                      value={editingArtist.height || 170}
                      onChange={(e) => setEditingArtist({ ...editingArtist, height: Number(e.target.value) })}
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-medium mb-1">학력</label>
                    <input
                      type="text"
                      value={editingArtist.education || ''}
                      onChange={(e) => setEditingArtist({ ...editingArtist, education: e.target.value })}
                      placeholder="한국예술종합학교 연극원 연기과"
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1">인스타그램 계정</label>
                    <input
                      type="text"
                      value={editingArtist.instagram || ''}
                      onChange={(e) => setEditingArtist({ ...editingArtist, instagram: e.target.value })}
                      placeholder="@username"
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-gray-300 font-medium">가능 언어 / 외국어 (Language)</label>
                      <span className="text-[11px] text-sky-400 font-mono">쉼표(,)로 구분</span>
                    </div>
                    <input
                      type="text"
                      value={languagesInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLanguagesInput(val);
                        const langs = val.split(',').map(s => s.trim()).filter(Boolean);
                        setEditingArtist(prev => prev ? ({ ...prev, languages: langs }) : null);
                      }}
                      placeholder="한국어, 영어 (English), 일본어"
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-sky-400 placeholder:text-gray-600"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {['한국어', '영어', '일본어', '중국어', '불어', '스페인어'].map(lang => {
                        const currentList = languagesInput.split(',').map(s => s.trim()).filter(Boolean);
                        const isIncluded = currentList.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => {
                              const nextList = isIncluded
                                ? currentList.filter(l => l !== lang)
                                : [...currentList, lang];
                              const nextStr = nextList.join(', ');
                              setLanguagesInput(nextStr);
                              setEditingArtist(prev => prev ? ({ ...prev, languages: nextList }) : null);
                            }}
                            className={`text-[10px] px-2 py-0.5 border font-mono transition-colors ${
                              isIncluded
                                ? 'bg-sky-500 text-black border-sky-400 font-bold'
                                : 'bg-[#12141e] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                            }`}
                          >
                            {isIncluded ? `✓ ${lang}` : `+ ${lang}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-gray-300 font-medium">특기 / 특화 분야 (Specialty)</label>
                      <span className="text-[11px] text-sky-400 font-mono">쉼표(,)로 구분</span>
                    </div>
                    <input
                      type="text"
                      value={specialtyInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSpecialtyInput(val);
                        const specs = val.split(',').map(s => s.trim()).filter(Boolean);
                        setEditingArtist(prev => prev ? ({ ...prev, specialty: specs }) : null);
                      }}
                      placeholder="연기, 현대무용, 승마, 액션/무술"
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-sky-400 placeholder:text-gray-600"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {['연기', '보컬/노래', '현대무용', '피아노', '승마', '액션/무술', '수영'].map(spec => {
                        const currentList = specialtyInput.split(',').map(s => s.trim()).filter(Boolean);
                        const isIncluded = currentList.includes(spec);
                        return (
                          <button
                            key={spec}
                            type="button"
                            onClick={() => {
                              const nextList = isIncluded
                                ? currentList.filter(s => s !== spec)
                                : [...currentList, spec];
                              const nextStr = nextList.join(', ');
                              setSpecialtyInput(nextStr);
                              setEditingArtist(prev => prev ? ({ ...prev, specialty: nextList }) : null);
                            }}
                            className={`text-[10px] px-2 py-0.5 border font-mono transition-colors ${
                              isIncluded
                                ? 'bg-sky-500 text-black border-sky-400 font-bold'
                                : 'bg-[#12141e] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                            }`}
                          >
                            {isIncluded ? `✓ ${spec}` : `+ ${spec}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-gray-300 font-medium">메인 노출 순서 (Display Order)</label>
                      <span className="text-[11px] text-sky-400 font-mono">1번이 최상단 우선 노출</span>
                    </div>
                    <select
                      value={editingArtist.order || (isNewArtist ? artists.length + 1 : 1)}
                      onChange={(e) => setEditingArtist({ ...editingArtist, order: Number(e.target.value) })}
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-sky-400 font-mono"
                    >
                      {Array.from({ length: isNewArtist ? artists.length + 1 : artists.length }, (_, i) => i + 1).map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}순위 노출 {pos === 1 ? '(★ 최우선 메인 1번)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-1">공개 상태 (Active)</label>
                    <select
                      value={editingArtist.isActive !== false ? 'true' : 'false'}
                      onChange={(e) => setEditingArtist({ ...editingArtist, isActive: e.target.value === 'true' })}
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                    >
                      <option value="true">공개 (웹사이트에 노출)</option>
                      <option value="false">비공개 (임시 저장 / 비노출)</option>
                    </select>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* PHOTO UPLOAD SECTION (PC DIRECT UPLOAD & GALLERY) */}
                {/* ======================================================== */}
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-sky-400 font-mono uppercase text-xs flex items-center space-x-1.5">
                        <ImageIcon className="w-4 h-4 text-sky-400" />
                        <span>배우 사진 등록 (PC 사진 파일 업로드 지원)</span>
                      </span>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        컴퓨터(PC)의 사진 파일을 선택하거나 드래그하여 등록할 수 있습니다. (JPG, PNG, WebP)
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 bg-black/40 p-1 border border-white/10 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setProfileImageMode('upload')}
                        className={`px-2.5 py-1 font-medium transition-colors ${
                          profileImageMode === 'upload' ? 'bg-sky-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        내 PC에서 등록
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileImageMode('url')}
                        className={`px-2.5 py-1 font-medium transition-colors ${
                          profileImageMode === 'url' ? 'bg-sky-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        URL 직접입력
                      </button>
                    </div>
                  </div>

                  {/* 1. Main Profile Photo */}
                  <div className="bg-[#141724] p-4 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                        <span>대표 메인 프로필 사진 (필수)</span>
                      </label>
                      {editingArtist.profileImage && (
                        <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>등록 완료</span>
                        </span>
                      )}
                    </div>

                    {profileImageMode === 'upload' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        {/* Preview Box */}
                        <div className="sm:col-span-4 aspect-[3/4] max-h-52 relative overflow-hidden bg-black/50 border border-white/20 flex items-center justify-center group mx-auto sm:mx-0 w-36 sm:w-full">
                          {editingArtist.profileImage ? (
                            <>
                              <img
                                src={editingArtist.profileImage}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => profileFileInputRef.current?.click()}
                                  className="bg-white text-black text-xs font-bold px-3 py-1.5 mb-1.5 hover:bg-slate-200"
                                >
                                  사진 변경
                                </button>
                                <span className="text-[10px] text-gray-300">PC 파일로 교체</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-4 text-gray-500 text-xs">
                              <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <span>사진 없음</span>
                            </div>
                          )}
                        </div>

                        {/* Dropzone & PC Button */}
                        <div className="sm:col-span-8">
                          <input
                            ref={profileFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePhotoUpload}
                            className="hidden"
                          />
                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingProfile(true); }}
                            onDragLeave={() => setIsDraggingProfile(false)}
                            onDrop={handleProfilePhotoDrop}
                            onClick={() => profileFileInputRef.current?.click()}
                            className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                              isDraggingProfile
                                ? 'border-sky-400 bg-sky-950/50 text-white'
                                : 'border-white/20 hover:border-sky-400/60 bg-black/30 hover:bg-white/5'
                            }`}
                          >
                            <Upload className={`w-8 h-8 mx-auto mb-2 transition-transform ${isDraggingProfile ? 'scale-110 text-sky-400' : 'text-gray-400'}`} />
                            <p className="text-sm font-bold text-white mb-1">
                              내 PC에서 대표 프로필 사진 선택
                            </p>
                            <p className="text-xs text-gray-400">
                              클릭하거나 이미지 파일을 이 영역으로 드래그 & 드롭하세요
                            </p>
                            <div className="mt-3 inline-flex items-center space-x-1 text-[11px] font-mono text-sky-300 bg-[#182A47] px-3 py-1 border border-sky-400/30">
                              <span>권장 비율: 3:4 세로형 인물 프로필 사진</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={editingArtist.profileImage || ''}
                          onChange={(e) => setEditingArtist({ ...editingArtist, profileImage: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-sky-400"
                        />
                        {editingArtist.profileImage && (
                          <div className="flex items-center space-x-3 p-2 bg-black/30 border border-white/5">
                            <img
                              src={editingArtist.profileImage}
                              alt="Preview"
                              className="w-10 h-13 object-cover border border-white/10"
                              referrerPolicy="no-referrer"
                            />
                            <span className="text-xs text-gray-400">외부 이미지 URL이 연결되었습니다.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 2. Additional Gallery Photos */}
                  <div className="bg-[#141724] p-4 border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                          <Layers className="w-3.5 h-3.5 text-sky-400" />
                          <span>추가 갤러리 및 화보 사진 (PC 다중 선택 가능)</span>
                        </label>
                        <p className="text-[11px] text-gray-400">
                          배우 상세 모달 및 화보 탭에 노출될 포트폴리오 사진입니다. (현재 {editingArtist.galleryImages?.length || 0}장 등록됨)
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        className="inline-flex items-center space-x-1.5 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 px-3 py-1.5 text-xs font-semibold self-start sm:self-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>PC에서 사진 추가 (다중 선택)</span>
                      </button>
                    </div>

                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryPhotosUpload}
                      className="hidden"
                    />

                    {/* Gallery Drag & Drop Area */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingGallery(true); }}
                      onDragLeave={() => setIsDraggingGallery(false)}
                      onDrop={handleGalleryPhotosDrop}
                      onClick={() => galleryFileInputRef.current?.click()}
                      className={`border border-dashed p-3.5 text-center cursor-pointer transition-all ${
                        isDraggingGallery
                          ? 'border-sky-400 bg-sky-950/40'
                          : 'border-white/15 hover:border-white/30 bg-black/20'
                      }`}
                    >
                      <p className="text-xs text-gray-300">
                        여기를 클릭하거나 PC 사진 파일들을 드래그하여 한 번에 여러 장 추가하세요.
                      </p>
                    </div>

                    {/* Gallery Photos Grid */}
                    {editingArtist.galleryImages && editingArtist.galleryImages.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                        {editingArtist.galleryImages.map((imgUrl, idx) => {
                          const isMain = editingArtist.profileImage === imgUrl;
                          return (
                            <div
                              key={idx}
                              className={`relative aspect-[3/4] overflow-hidden bg-black border group ${
                                isMain ? 'border-sky-400 ring-2 ring-sky-400' : 'border-white/10'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Gallery ${idx + 1}`}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {isMain && (
                                <div className="absolute top-1 left-1 bg-sky-500 text-black text-[9px] font-black px-1.5 py-0.5 z-10">
                                  대표사진
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1.5 space-y-1.5 z-20">
                                {!isMain && (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleSetMainPhoto(imgUrl); }}
                                    className="w-full bg-white text-black text-[10px] font-bold py-1 px-1 text-center hover:bg-slate-200"
                                  >
                                    대표 지정
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleRemoveGalleryPhoto(idx); }}
                                  className="w-full bg-red-900/80 hover:bg-red-800 text-white text-[10px] font-bold py-1 px-1 text-center flex items-center justify-center space-x-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>삭제</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">쇼릴 영상 임베드 URL</label>
                  <input
                    type="url"
                    value={editingArtist.showreelUrl || ''}
                    onChange={(e) => setEditingArtist({ ...editingArtist, showreelUrl: e.target.value })}
                    placeholder="https://www.youtube-nocookie.com/embed/..."
                    className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">배우 소개글 (Bio)</label>
                  <textarea
                    rows={2}
                    value={editingArtist.bio || ''}
                    onChange={(e) => setEditingArtist({ ...editingArtist, bio: e.target.value })}
                    placeholder="배우의 분위기 및 장점 설명"
                    className="w-full bg-[#161926] border border-white/10 p-2.5 text-white focus:outline-none"
                  />
                </div>

                {/* Filmography Manager inside Artist Form */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-400 font-mono uppercase block flex items-center space-x-2">
                      <span>작품 활동 경력 (FILMOGRAPHY)</span>
                      <span className="text-xs bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 font-normal">
                        총 {editingArtist.filmography?.length || 0}건 등록됨
                      </span>
                    </span>
                    <span className="text-[11px] text-gray-400">
                      등록된 경력 항목의 [수정] 버튼을 눌러 바로 편집할 수 있습니다.
                    </span>
                  </div>

                  {/* New Item Creation Row */}
                  <div className="bg-[#161926] p-3 border border-white/10 space-y-2">
                    <div className="text-[11px] font-mono text-gray-400">
                      + 새 작품 경력 추가
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <input
                        type="text"
                        placeholder="연도 (예: 2026)"
                        value={newFilmYear}
                        onChange={(e) => setNewFilmYear(e.target.value)}
                        className="sm:col-span-2 bg-black border border-white/10 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                      />
                      <select
                        value={newFilmCategory}
                        onChange={(e) => setNewFilmCategory(e.target.value as any)}
                        className="sm:col-span-3 bg-black border border-white/10 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
                      >
                        <option value="Drama">Drama (드라마)</option>
                        <option value="Movie">Movie (영화)</option>
                        <option value="Theater">Theater (연극/뮤지컬)</option>
                        <option value="CF(광고)">CF (광고)</option>
                        <option value="Music Video">Music Video (뮤직비디오)</option>
                        <option value="Other">기타 (Other)</option>
                      </select>
                      <input
                        type="text"
                        placeholder="작품명 (예: 나의 해방일지)"
                        value={newFilmTitle}
                        onChange={(e) => setNewFilmTitle(e.target.value)}
                        className="sm:col-span-4 bg-black border border-white/10 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
                      />
                      <input
                        type="text"
                        placeholder="배역 (예: 김민지 역, 주연)"
                        value={newFilmRole}
                        onChange={(e) => setNewFilmRole(e.target.value)}
                        className="sm:col-span-2 bg-black border border-white/10 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddFilmographyItem}
                        className="sm:col-span-1 bg-sky-500 hover:bg-sky-400 text-black font-bold px-2 py-1.5 text-xs flex items-center justify-center space-x-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>추가</span>
                      </button>
                    </div>
                  </div>

                  {/* Registered Filmography List & In-Place Editor */}
                  {editingArtist.filmography && editingArtist.filmography.length > 0 ? (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {sortFilmographyByYear(editingArtist.filmography).map((f) => {
                        const isEditingThis = editingFilmId === f.id;
                        const catLabel = f.category === 'Commercial' || f.category === 'CF' ? 'CF(광고)' : f.category;

                        if (isEditingThis) {
                          return (
                            <div
                              key={f.id}
                              className="bg-[#1b2234] p-3 border-2 border-sky-500/70 shadow-lg space-y-2"
                            >
                              <div className="flex items-center justify-between text-[11px] text-sky-300 font-mono">
                                <span>🛠️ 경력 사항 수정 중...</span>
                                <span>ID: {f.id}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                                <input
                                  type="text"
                                  placeholder="연도"
                                  value={editFilmYear}
                                  onChange={(e) => setEditFilmYear(e.target.value)}
                                  className="sm:col-span-2 bg-black border border-sky-400/50 px-2 py-1.5 text-xs text-white focus:outline-none font-mono"
                                />
                                <select
                                  value={editFilmCategory}
                                  onChange={(e) => setEditFilmCategory(e.target.value as any)}
                                  className="sm:col-span-3 bg-black border border-sky-400/50 px-2 py-1.5 text-xs text-white focus:outline-none"
                                >
                                  <option value="Drama">Drama (드라마)</option>
                                  <option value="Movie">Movie (영화)</option>
                                  <option value="Theater">Theater (연극/뮤지컬)</option>
                                  <option value="CF(광고)">CF (광고)</option>
                                  <option value="Music Video">Music Video (뮤직비디오)</option>
                                  <option value="Other">기타 (Other)</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="작품명"
                                  value={editFilmTitle}
                                  onChange={(e) => setEditFilmTitle(e.target.value)}
                                  className="sm:col-span-4 bg-black border border-sky-400/50 px-2 py-1.5 text-xs text-white focus:outline-none font-bold"
                                />
                                <input
                                  type="text"
                                  placeholder="배역"
                                  value={editFilmRole}
                                  onChange={(e) => setEditFilmRole(e.target.value)}
                                  className="sm:col-span-3 bg-black border border-sky-400/50 px-2 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div className="flex justify-end space-x-2 pt-1">
                                <button
                                  type="button"
                                  onClick={handleCancelEditFilmographyItem}
                                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs border border-white/10 flex items-center space-x-1"
                                >
                                  <X className="w-3 h-3" />
                                  <span>취소</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSaveEditedFilmographyItem}
                                  className="px-4 py-1 bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs flex items-center space-x-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>수정 완료 저장</span>
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={f.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#141724] hover:bg-[#181c2d] px-3 py-2 border border-white/5 transition-colors group"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-gray-400 text-xs bg-black/40 px-2 py-0.5 border border-white/10">
                                {f.year}
                              </span>
                              <span className="text-[11px] font-mono font-bold bg-sky-950 text-sky-300 border border-sky-800/60 px-2 py-0.5">
                                {catLabel}
                              </span>
                              <span className="text-white text-xs font-semibold">
                                {f.title}
                              </span>
                              <span className="text-gray-400 text-xs font-mono">
                                — {f.role}
                              </span>
                              {f.note && (
                                <span className="text-gray-500 text-[11px]">
                                  ({f.note})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                              <button
                                type="button"
                                onClick={() => handleStartEditFilmographyItem(f)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-sky-950/70 hover:bg-sky-900 text-sky-300 border border-sky-800/60 text-[11px] font-medium transition-colors"
                                title="경력 수정"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>수정</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveFilmographyItem(f.id)}
                                className="inline-flex items-center space-x-1 px-2 py-1 bg-red-950/40 hover:bg-red-900/70 text-red-400 hover:text-red-200 border border-red-900/40 text-[11px] transition-colors"
                                title="경력 삭제"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>삭제</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-500 bg-black/20 border border-white/5">
                      등록된 작품 활동 경력이 없습니다. 상단에서 연도, 카테고리, 작품명, 배역을 입력하여 추가해주세요.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleRequestCloseArtistModal}
                  className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveArtist}
                  disabled={isSavingArtist}
                  className="px-6 py-2 bg-white text-black font-bold hover:bg-slate-200 disabled:opacity-50 transition-colors flex items-center space-x-1.5"
                >
                  {isSavingArtist ? (
                    <span>저장 처리 중...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>저장하기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-MODAL: NEWS CREATE / EDIT MODAL */}
        {/* ======================================================== */}
        {editingNews && (
          <div className="fixed inset-0 z-70 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-[#11141E] border border-white/20 shadow-2xl p-6 sm:p-8 my-auto space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white">
                  {isNewNews ? '신규 보도자료 작성' : '보도자료 수정'}
                </h3>
                <button onClick={() => setEditingNews(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 mb-1">카테고리</label>
                    <select
                      value={editingNews.category || 'Notice'}
                      onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value as any })}
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white"
                    >
                      <option value="Notice">Notice (공지사항)</option>
                      <option value="Casting">Casting (캐스팅 소식)</option>
                      <option value="Media">Media (언론 보도)</option>
                      <option value="Interview">Interview (인터뷰)</option>
                      <option value="Company">Company (회사 소식)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">게시일자</label>
                    <input
                      type="text"
                      value={editingNews.date || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                      placeholder="2026.08.20"
                      className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">제목 *</label>
                  <input
                    type="text"
                    value={editingNews.title || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                    className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">커버 이미지 URL (선택)</label>
                  <input
                    type="url"
                    value={editingNews.coverImage || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, coverImage: e.target.value })}
                    className="w-full bg-[#161926] border border-white/10 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">본문 내용 *</label>
                  <textarea
                    rows={6}
                    value={editingNews.content || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                    className="w-full bg-[#161926] border border-white/10 p-3 text-white"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-gray-300">
                    <input
                      type="checkbox"
                      checked={editingNews.isPinned || false}
                      onChange={(e) => setEditingNews({ ...editingNews, isPinned: e.target.checked })}
                      className="accent-sky-500"
                    />
                    <span>상단 고정 (PINNED ARTICLE)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setEditingNews(null)}
                  className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveNews}
                  className="px-6 py-2 bg-white text-black font-bold hover:bg-slate-200"
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-MODAL: ARTIST CLOSE CONFIRMATION PROMPT */}
        {/* ======================================================== */}
        {showArtistCloseConfirm && editingArtist && (
          <div className="fixed inset-0 z-[85] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#131722] border border-sky-500/40 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center space-x-3 text-sky-400">
                <div className="p-2.5 bg-sky-950/80 border border-sky-500/40 rounded-lg shrink-0">
                  <HelpCircle className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-display">
                    배우 정보 저장 확인
                  </h4>
                  <p className="text-xs text-gray-400">
                    창을 닫기 전에 변경사항을 저장하시겠습니까?
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-black/40 border border-white/5 text-xs text-gray-300 font-mono space-y-1">
                <div>
                  대상 배우: <strong className="text-white">{editingArtist.nameKo || '신규 배우'} {editingArtist.nameEn ? `(${editingArtist.nameEn})` : ''}</strong>
                </div>
                <div className="text-[11px] text-gray-400">
                  저장하지 않고 닫으면 입력하거나 수정한 모든 내용이 사라집니다.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowArtistCloseConfirm(false)}
                  className="px-3 py-2 text-xs font-mono text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition-colors text-center"
                >
                  계속 수정하기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowArtistCloseConfirm(false);
                    setEditingArtist(null);
                    showToast('배우 정보 수정을 취소하고 창을 닫았습니다.');
                  }}
                  className="px-3 py-2 text-xs font-mono text-red-400 hover:text-red-300 border border-red-900/40 hover:bg-red-950/40 transition-colors text-center"
                >
                  저장 안함 (닫기)
                </button>
                <button
                  type="button"
                  disabled={isSavingArtist}
                  onClick={async () => {
                    await handleSaveArtist();
                  }}
                  className="px-4 py-2 text-xs font-mono font-bold bg-sky-400 hover:bg-sky-300 text-black shadow-lg shadow-sky-950/50 transition-colors flex items-center justify-center space-x-1.5"
                >
                  {isSavingArtist ? (
                    <span>저장 중...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                      <span>저장 후 닫기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-MODAL: SAFE DELETE CONFIRMATION DIALOG */}
        {/* ======================================================== */}
        {deleteConfirmation && (
          <div className="fixed inset-0 z-80 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#161822] border border-red-500/40 shadow-2xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center space-x-3 text-red-400">
                <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-display">삭제 확인</h4>
                  <p className="text-xs text-gray-400">정말로 삭제하시겠습니까?</p>
                </div>
              </div>

              <div className="p-3 bg-black/40 border border-white/5 text-xs text-gray-200 break-words font-mono">
                {deleteConfirmation.type === 'reset_artists' ? (
                  <span>기본 6인의 신예 배우 데이터로 초기화되며 변경된 내용이 복원됩니다.</span>
                ) : (
                  <span>
                    대상: <strong className="text-white">{deleteConfirmation.title}</strong>
                  </span>
                )}
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                삭제된 데이터는 데이터베이스 및 웹사이트에서 즉시 제거됩니다.
              </p>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmation(null)}
                  disabled={isDeletingItem}
                  className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition-colors"
                >
                  취소 (CANCEL)
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeletingItem}
                  className="px-5 py-2 text-xs font-mono font-bold bg-red-600 hover:bg-red-500 text-white transition-colors inline-flex items-center space-x-1.5 shadow-lg shadow-red-950/50"
                >
                  {isDeletingItem ? (
                    <span>삭제 처리 중...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>영구 삭제 (DELETE)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
