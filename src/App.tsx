import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ArtistsSection } from './components/ArtistsSection';
import { ArtistModal } from './components/ArtistModal';
import { AuditionSection } from './components/AuditionSection';
import { NewsSection } from './components/NewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProfilePrintSheet } from './components/ProfilePrintSheet';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAuthModal } from './components/AdminAuthModal';
import { Artist, NewsArticle } from './types';
import { getArtists, getNewsArticles, subscribeToArtists, subscribeToNews } from './lib/db';
import { INITIAL_ARTISTS, INITIAL_NEWS } from './data/initialData';

export default function App() {
  const [artists, setArtists] = useState<Artist[]>(INITIAL_ARTISTS);
  const [newsList, setNewsList] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return (
      auth.currentUser !== null ||
      sessionStorage.getItem('tk_admin_auth') === 'true'
    );
  });
  const [adminIdentifier, setAdminIdentifier] = useState<string>(() => {
    return (
      auth.currentUser?.email ||
      sessionStorage.getItem('tk_admin_email') ||
      'Master Administrator'
    );
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Modals
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [printArtist, setPrintArtist] = useState<Artist | null>(null);
  const [preselectedActorForContact, setPreselectedActorForContact] = useState<Artist | null>(null);

  // Sync auth state with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminAuthenticated(true);
        setAdminIdentifier(user.email || user.displayName || 'Google Admin');
      } else {
        // If not logged into Firebase, check sessionStorage
        const isSessionAuth = sessionStorage.getItem('tk_admin_auth') === 'true';
        if (isSessionAuth) {
          setIsAdminAuthenticated(true);
          setAdminIdentifier(sessionStorage.getItem('tk_admin_email') || 'Master Administrator');
        } else {
          setIsAdminAuthenticated(false);
          setAdminIdentifier('');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize data and real-time subscription
  useEffect(() => {
    // Initial fetch
    loadInitialData();

    // Real-time listener for artists
    const unsubscribeArtists = subscribeToArtists((updatedArtists) => {
      if (updatedArtists && updatedArtists.length > 0) {
        setArtists(updatedArtists);
      }
    });

    // Real-time listener for news
    const unsubscribeNews = subscribeToNews((updatedNews) => {
      setNewsList(updatedNews);
    });

    return () => {
      if (unsubscribeArtists) unsubscribeArtists();
      if (unsubscribeNews) unsubscribeNews();
    };
  }, []);

  const loadInitialData = async () => {
    try {
      const fetchedArtists = await getArtists();
      setArtists(fetchedArtists);
      const fetchedNews = await getNewsArticles();
      setNewsList(fetchedNews);
    } catch (e) {
      console.warn('Error loading initial data:', e);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'artists', 'audition', 'news', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCastingInquiry = (artist: Artist) => {
    setPreselectedActorForContact(artist);
    handleNavigate('contact');
  };

  // Admin access entry point: gate with authentication
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (authType: 'google' | 'passcode', userIdentifier?: string) => {
    setIsAdminAuthenticated(true);
    if (userIdentifier) {
      setAdminIdentifier(userIdentifier);
    }
    setIsAdminAuthModalOpen(false);
    setIsAdminOpen(true);
  };

  const handleLogoutAdmin = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn(e);
    }
    sessionStorage.removeItem('tk_admin_auth');
    sessionStorage.removeItem('tk_admin_type');
    sessionStorage.removeItem('tk_admin_email');
    setIsAdminAuthenticated(false);
    setAdminIdentifier('');
    setIsAdminOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#E5E7EB] flex flex-col selection:bg-[#182A47] selection:text-white">
      {/* Sleek Fixed Header */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={handleOpenAdmin}
        isAdmin={isAdminAuthenticated}
      />

      {/* Main Flow */}
      <main className="flex-grow">
        {/* 1. Hero */}
        <Hero
          onExploreArtists={() => handleNavigate('artists')}
          onApplyAudition={() => handleNavigate('audition')}
        />

        {/* 2. About TK */}
        <AboutSection artistCount={artists.filter(a => a.isActive).length} />

        {/* 3. Artists (Core) */}
        <ArtistsSection
          artists={artists}
          onSelectArtist={(artist) => setSelectedArtist(artist)}
        />

        {/* 4. Audition */}
        <AuditionSection />

        {/* 5. News */}
        <NewsSection newsList={newsList} />

        {/* 6. Contact */}
        <ContactSection
          artists={artists.filter(a => a.isActive)}
          preselectedActor={preselectedActorForContact}
          onClearPreselectedActor={() => setPreselectedActorForContact(null)}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Admin Authentication Modal Gate */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Artist Dossier Modal */}
      {selectedArtist && (
        <ArtistModal
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
          onCastingInquiry={handleCastingInquiry}
          onOpenPrintSheet={(artist) => {
            setSelectedArtist(null);
            setPrintArtist(artist);
          }}
        />
      )}

      {/* Printable Bio-Sheet Modal */}
      {printArtist && (
        <ProfilePrintSheet
          artist={printArtist}
          onClose={() => setPrintArtist(null)}
        />
      )}

      {/* Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          artists={artists}
          newsList={newsList}
          adminIdentifier={adminIdentifier}
          onClose={() => setIsAdminOpen(false)}
          onLogout={handleLogoutAdmin}
          onRefreshData={loadInitialData}
        />
      )}
    </div>
  );
}

