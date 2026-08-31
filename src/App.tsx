import React, { useState, useEffect } from 'react';
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
import { ARTISTS } from './data/artists';
import { NEWS_ARTICLES } from './data/news';

export default function App() {
  const [artists, setArtists] = useState<Artist[]>(ARTISTS);
  const [newsList, setNewsList] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Admin Authentication State (Passcode session based)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('tk_admin_auth') === 'true';
  });
  const [adminIdentifier, setAdminIdentifier] = useState<string>(() => {
    return sessionStorage.getItem('tk_admin_email') || 'Master Administrator';
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Modals
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [printArtist, setPrintArtist] = useState<Artist | null>(null);
  const [preselectedActorForContact, setPreselectedActorForContact] = useState<Artist | null>(null);

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

  const handleAuthSuccess = (_authType: 'google' | 'passcode', userIdentifier?: string) => {
    setIsAdminAuthenticated(true);
    if (userIdentifier) {
      setAdminIdentifier(userIdentifier);
    }
    setIsAdminAuthModalOpen(false);
    setIsAdminOpen(true);
  };

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem('tk_admin_auth');
    sessionStorage.removeItem('tk_admin_type');
    sessionStorage.removeItem('tk_admin_email');
    setIsAdminAuthenticated(false);
    setAdminIdentifier('');
    setIsAdminOpen(false);
  };

  const handleRefreshData = () => {
    // Keep data aligned with static single source of truth
    setArtists([...ARTISTS]);
    setNewsList([...NEWS_ARTICLES]);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-[#0B0C10] text-[#E5E7EB] flex flex-col selection:bg-[#182A47] selection:text-white relative">
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

        {/* 4. News */}
        <NewsSection newsList={newsList} />

        {/* 5. Audition */}
        <AuditionSection />

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
          onUpdateArtists={(updated) => setArtists(updated)}
          onUpdateNews={(updated) => setNewsList(updated)}
          onRefreshData={handleRefreshData}
        />
      )}
    </div>
  );
}

