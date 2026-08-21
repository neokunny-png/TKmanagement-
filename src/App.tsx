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
import { Artist, NewsArticle } from './types';
import { getArtists, getNewsArticles, subscribeToArtists } from './lib/db';
import { INITIAL_ARTISTS, INITIAL_NEWS } from './data/initialData';

export default function App() {
  const [artists, setArtists] = useState<Artist[]>(INITIAL_ARTISTS);
  const [newsList, setNewsList] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Modals
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [printArtist, setPrintArtist] = useState<Artist | null>(null);
  const [preselectedActorForContact, setPreselectedActorForContact] = useState<Artist | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

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

    return () => {
      if (unsubscribeArtists) unsubscribeArtists();
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

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#E5E7EB] flex flex-col selection:bg-[#182A47] selection:text-white">
      {/* Sleek Fixed Header */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdmin={false}
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
        onOpenAdmin={() => setIsAdminOpen(true)}
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
          onClose={() => setIsAdminOpen(false)}
          onRefreshData={loadInitialData}
        />
      )}
    </div>
  );
}
