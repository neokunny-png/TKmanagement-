import React, { useState, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
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
import { Artist, NewsArticle, CompanyInfo } from './types';
import { ARTISTS } from './data/artists';
import { NEWS_ARTICLES } from './data/news';
import { subscribeArtists } from './services/artistService';
import { subscribeNews } from './services/newsService';
import { subscribeCompanyInfo, DEFAULT_COMPANY_INFO } from './services/companyService';
import { applyPageSEO, getArtistSlug, mapSlugToArtistId } from './lib/seo';

type ActiveMobileView = 'home' | 'about' | 'audition' | 'contact';

export default function App() {
  const [artists, setArtists] = useState<Artist[]>(ARTISTS);
  const [newsList, setNewsList] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(DEFAULT_COMPANY_INFO);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Mobile dedicated view state ('home' | 'about' | 'audition' | 'contact')
  const [activeMobileView, setActiveMobileView] = useState<ActiveMobileView>('home');
  const [savedScrollPos, setSavedScrollPos] = useState<number>(0);

  // Responsive device breakpoint tracking (<768px matches Tailwind md:)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Modals & Selection State
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [printArtist, setPrintArtist] = useState<Artist | null>(null);
  const [preselectedActorForContact, setPreselectedActorForContact] = useState<Artist | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setActiveMobileView('home');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial URL routing and deep-linking (supports /artists, /artists/:slug, /audition, /news, /contact, /about, and legacy hashes)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname.replace(/\/$/, '') || '/';
    const hash = window.location.hash;
    const isCurrentMobile = window.innerWidth < 768;

    // 1. Direct actor profile path e.g. /artists/choi-eunseo or #artist/artist-choi-eunseo
    if (pathname.startsWith('/artists/')) {
      const slug = pathname.replace('/artists/', '').trim();
      if (slug && artists.length > 0) {
        const canonicalId = mapSlugToArtistId(slug);
        const found = artists.find(
          a => a.id === canonicalId || getArtistSlug(a) === slug || (a.nameKo && slug.includes(a.nameKo))
        );
        if (found) {
          setSelectedArtist(found);
          setActiveSection('artists');
          return;
        }
      }
    } else if (hash.startsWith('#artist/')) {
      const artistId = hash.replace('#artist/', '').trim();
      const canonicalId = mapSlugToArtistId(artistId);
      const found = artists.find(a => a.id === canonicalId || a.id === artistId || getArtistSlug(a) === artistId);
      if (found) {
        setSelectedArtist(found);
        setActiveSection('artists');
        return;
      }
    }

    // 2. Direct section paths
    if (pathname === '/artists' || hash === '#artists') {
      setActiveSection('artists');
      setTimeout(() => {
        document.getElementById('artists')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (pathname === '/audition' || hash === '#audition') {
      if (isCurrentMobile) {
        setActiveMobileView('audition');
      } else {
        setActiveSection('audition');
        setTimeout(() => {
          document.getElementById('audition')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (pathname === '/news' || hash === '#news') {
      setActiveSection('news');
      setTimeout(() => {
        document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (pathname === '/contact' || hash === '#contact') {
      if (isCurrentMobile) {
        setActiveMobileView('contact');
      } else {
        setActiveSection('contact');
        setTimeout(() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (pathname === '/about' || hash === '#about') {
      if (isCurrentMobile) {
        setActiveMobileView('about');
      } else {
        setActiveSection('about');
        setTimeout(() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [artists]);

  // Dynamic SEO Synchronization
  useEffect(() => {
    if (selectedArtist) {
      applyPageSEO('artist', selectedArtist);
      return;
    }

    let view = 'home';
    if (activeMobileView !== 'home') {
      view = activeMobileView;
    } else if (activeSection && activeSection !== 'hero') {
      view = activeSection;
    }
    applyPageSEO(view, null);
  }, [selectedArtist, activeMobileView, activeSection]);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    const unsubArtists = subscribeArtists((updatedArtists) => {
      setArtists(updatedArtists);
    });
    const unsubNews = subscribeNews((updatedNews) => {
      setNewsList(updatedNews);
    });
    const unsubCompany = subscribeCompanyInfo((updatedCompany) => {
      setCompanyInfo(updatedCompany);
    });

    return () => {
      unsubArtists();
      unsubNews();
      unsubCompany();
    };
  }, []);

  // Admin Authentication State (Passcode session based with safe browser storage access)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && sessionStorage.getItem('tk_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [adminIdentifier, setAdminIdentifier] = useState<string>(() => {
    try {
      return (typeof window !== 'undefined' && sessionStorage.getItem('tk_admin_email')) || 'Master Administrator';
    } catch {
      return 'Master Administrator';
    }
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Body scroll lock management when modals are open
  useEffect(() => {
    const isAnyModalOpen = Boolean(selectedArtist || printArtist || isAdminOpen || isAdminAuthModalOpen);
    if (isAnyModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.dataset.savedScrollY = String(scrollY);
    } else {
      const savedY = parseInt(document.body.dataset.savedScrollY || '0', 10);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (document.body.dataset.savedScrollY !== undefined) {
        delete document.body.dataset.savedScrollY;
        window.scrollTo({ top: savedY, behavior: 'instant' });
      }
    }
    return () => {
      const savedY = parseInt(document.body.dataset.savedScrollY || '0', 10);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (document.body.dataset.savedScrollY !== undefined) {
        delete document.body.dataset.savedScrollY;
        window.scrollTo({ top: savedY, behavior: 'instant' });
      }
    };
  }, [selectedArtist, printArtist, isAdminOpen, isAdminAuthModalOpen]);

  // Browser History & Mobile Back Gesture (popstate) Handler
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.replace(/\/$/, '') || '/';
      const hash = window.location.hash;

      // 1. If back/forward navigates to an artist profile: /artists/:slug
      if (pathname.startsWith('/artists/')) {
        const slug = pathname.replace('/artists/', '').trim();
        const canonicalId = mapSlugToArtistId(slug);
        const found = artists.find(
          a => a.id === canonicalId || getArtistSlug(a) === slug || (a.nameKo && slug.includes(a.nameKo))
        );
        if (found) {
          setSelectedArtist(found);
          return;
        }
      }

      // 2. If an artist or print modal was open, close them
      if (selectedArtist) {
        setSelectedArtist(null);
      }
      if (printArtist) {
        setPrintArtist(null);
      }
      if (isAdminAuthModalOpen) {
        setIsAdminAuthModalOpen(false);
      }

      // 3. Handle mobile dedicated views and desktop sections
      const isCurrentMobile = window.innerWidth < 768;
      if (pathname === '/about' || hash === '#about') {
        if (isCurrentMobile) setActiveMobileView('about');
        else setActiveSection('about');
      } else if (pathname === '/audition' || hash === '#audition') {
        if (isCurrentMobile) setActiveMobileView('audition');
        else setActiveSection('audition');
      } else if (pathname === '/contact' || hash === '#contact') {
        if (isCurrentMobile) setActiveMobileView('contact');
        else setActiveSection('contact');
      } else if (pathname === '/artists' || hash === '#artists') {
        setActiveMobileView('home');
        setActiveSection('artists');
      } else if (pathname === '/news' || hash === '#news') {
        setActiveMobileView('home');
        setActiveSection('news');
      } else {
        setActiveMobileView('home');
        setActiveSection('hero');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [artists, selectedArtist, printArtist, isAdminAuthModalOpen]);

  // Track active section on scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['hero', 'about', 'artists', 'news', 'audition', 'contact'];
          const scrollPos = window.scrollY + 200;

          for (const sec of sections) {
            const el = document.getElementById(sec);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPos >= top && scrollPos < top + height) {
                setActiveSection(prev => (prev !== sec ? sec : prev));
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    const slug = getArtistSlug(artist);
    try {
      window.history.pushState({ modal: 'artist', slug, id: artist.id }, '', `/artists/${slug}`);
    } catch {}
  };

  const handleCloseArtistModal = () => {
    setSelectedArtist(null);
    try {
      if (window.location.pathname.startsWith('/artists/')) {
        window.history.pushState(null, '', '/artists');
      } else if (window.location.hash.startsWith('#artist/')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch {}
  };

  const handleOpenPrintSheet = (artist: Artist) => {
    setSelectedArtist(null);
    setPrintArtist(artist);
    try {
      window.history.pushState({ modal: 'print', id: artist.id }, '', `#print/${artist.id}`);
    } catch {}
  };

  const handleClosePrintSheet = () => {
    setPrintArtist(null);
    try {
      if (window.location.hash.startsWith('#print/')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch {}
  };

  const handleNavigate = (sectionId: string) => {
    setSelectedArtist(null);
    setPrintArtist(null);

    const isCurrentMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : isMobile;

    let targetPath = '/';
    if (sectionId === 'artists') targetPath = '/artists';
    else if (sectionId === 'audition') targetPath = '/audition';
    else if (sectionId === 'news') targetPath = '/news';
    else if (sectionId === 'contact') targetPath = '/contact';
    else if (sectionId === 'about') targetPath = '/about';

    // On Mobile: ABOUT, AUDITION, CONTACT open as dedicated views
    if (isCurrentMobile && (sectionId === 'about' || sectionId === 'audition' || sectionId === 'contact')) {
      setSavedScrollPos(window.scrollY);
      setActiveMobileView(sectionId as ActiveMobileView);
      try {
        window.history.pushState({ mobileView: sectionId }, '', targetPath);
      } catch {}
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // If currently in a mobile sub-view and navigating to home/artists/news
    if (activeMobileView !== 'home') {
      setActiveMobileView('home');
    }

    setActiveSection(sectionId);
    try {
      window.history.pushState({ section: sectionId }, '', targetPath);
    } catch {}

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 40);
  };

  const handleCloseMobileView = () => {
    setActiveMobileView('home');
    try {
      window.history.pushState(null, '', '/');
    } catch {}
    // Smoothly restore previous scroll position
    setTimeout(() => {
      window.scrollTo({ top: savedScrollPos || 0, behavior: 'smooth' });
    }, 30);
  };

  const handleNavigateHome = () => {
    setSelectedArtist(null);
    setPrintArtist(null);
    setIsAdminOpen(false);
    setIsAdminAuthModalOpen(false);
    setActiveMobileView('home');
    setActiveSection('hero');
    try {
      window.history.pushState(null, '', '/');
    } catch {}
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    try {
      sessionStorage.removeItem('tk_admin_auth');
      sessionStorage.removeItem('tk_admin_type');
      sessionStorage.removeItem('tk_admin_email');
    } catch {}
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
      {/* Sleek Fixed Header (Desktop always, Mobile only on home view) */}
      <div className={activeMobileView !== 'home' ? 'hidden md:block' : 'block'}>
        <Header
          activeSection={activeMobileView !== 'home' ? activeMobileView : activeSection}
          onNavigate={handleNavigate}
          onOpenAdmin={handleOpenAdmin}
          isAdmin={isAdminAuthenticated}
        />
      </div>

      {/* Main Flow (Desktop always, Mobile only when in home view) */}
      <main className={`flex-grow ${activeMobileView !== 'home' ? 'hidden md:block' : 'block'}`}>
        {/* 1. Hero */}
        <Hero
          artists={artists}
          onExploreArtists={() => handleNavigate('artists')}
          onApplyAudition={() => handleNavigate('audition')}
        />

        {/* Mobile Navigation Strip (Visible on mobile only, in exact order: ABOUT → ARTISTS → NEWS → AUDITION → CONTACT) */}
        <div className="md:hidden sticky top-[57px] z-30 bg-[#0B0C10]/95 backdrop-blur-md border-y border-white/10 px-1.5 py-2 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between gap-1 max-w-md mx-auto">
            <button
              id="mobile-nav-about"
              onClick={() => handleNavigate('about')}
              className="flex-1 min-w-0 py-1.5 px-0.5 text-center text-[11px] sm:text-xs font-mono font-semibold tracking-tight sm:tracking-wider text-gray-300 hover:text-white active:bg-white/10 transition-all cursor-pointer rounded min-h-[40px] flex items-center justify-center whitespace-nowrap"
            >
              ABOUT
            </button>
            <button
              id="mobile-nav-artists"
              onClick={() => handleNavigate('artists')}
              className={`flex-1 min-w-0 py-1.5 px-0.5 text-center text-[11px] sm:text-xs font-mono font-semibold tracking-tight sm:tracking-wider transition-all cursor-pointer rounded min-h-[40px] flex items-center justify-center whitespace-nowrap ${
                activeSection === 'artists'
                  ? 'text-sky-400 bg-sky-950/50 border border-sky-800/60 font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              ARTISTS
            </button>
            <button
              id="mobile-nav-news"
              onClick={() => handleNavigate('news')}
              className={`flex-1 min-w-0 py-1.5 px-0.5 text-center text-[11px] sm:text-xs font-mono font-semibold tracking-tight sm:tracking-wider transition-all cursor-pointer rounded min-h-[40px] flex items-center justify-center whitespace-nowrap ${
                activeSection === 'news'
                  ? 'text-sky-400 bg-sky-950/50 border border-sky-800/60 font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              NEWS
            </button>
            <button
              id="mobile-nav-audition"
              onClick={() => handleNavigate('audition')}
              className="flex-1 min-w-0 py-1.5 px-0.5 text-center text-[11px] sm:text-xs font-mono font-semibold tracking-tight sm:tracking-wider text-gray-300 hover:text-white active:bg-white/10 transition-all cursor-pointer rounded min-h-[40px] flex items-center justify-center whitespace-nowrap"
            >
              AUDITION
            </button>
            <button
              id="mobile-nav-contact"
              onClick={() => handleNavigate('contact')}
              className="flex-1 min-w-0 py-1.5 px-0.5 text-center text-[11px] sm:text-xs font-mono font-semibold tracking-tight sm:tracking-wider text-gray-300 hover:text-white active:bg-white/10 transition-all cursor-pointer rounded min-h-[40px] flex items-center justify-center whitespace-nowrap"
            >
              CONTACT
            </button>
          </div>
        </div>

        {/* 2. About TK (Desktop only in flow; on mobile, accessed via ABOUT click) */}
        <div className="hidden md:block">
          <AboutSection artistCount={artists.filter(a => a.isActive).length} id="about" />
        </div>

        {/* 3. Artists (Core - shown directly on both mobile and desktop) */}
        <ArtistsSection
          artists={artists}
          onSelectArtist={handleSelectArtist}
        />

        {/* 4. News (Core - shown directly on both mobile and desktop) */}
        <NewsSection newsList={newsList} />

        {/* 5. Audition (Desktop only in flow; on mobile, accessed via AUDITION click) */}
        <div className="hidden md:block">
          <AuditionSection id="audition" />
        </div>

        {/* 6. Contact (Desktop only in flow; on mobile, accessed via CONTACT click) */}
        <div className="hidden md:block">
          <ContactSection
            artists={artists.filter(a => a.isActive)}
            companyInfo={companyInfo}
            preselectedActor={preselectedActorForContact}
            onClearPreselectedActor={() => setPreselectedActorForContact(null)}
            id="contact"
          />
        </div>
      </main>

      {/* Mobile Dedicated View (ABOUT / AUDITION / CONTACT) */}
      {activeMobileView !== 'home' && (
        <div className="md:hidden min-h-screen min-h-[100dvh] bg-[#0B0C10] text-[#E5E7EB] flex flex-col z-50">
          {/* Top Sticky Header with ← BACK and CLOSE × */}
          <div className="sticky top-0 z-50 bg-[#0B0C10]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-lg shadow-black/40 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
            <button
              id="btn-mobile-view-back"
              onClick={handleCloseMobileView}
              className="inline-flex items-center space-x-1.5 text-sky-400 hover:text-sky-300 active:scale-95 transition-all text-xs font-mono font-bold tracking-wider py-1.5 px-3 rounded bg-sky-950/40 border border-sky-800/60 cursor-pointer min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← BACK</span>
            </button>

            <span className="text-xs font-mono tracking-widest text-white uppercase font-bold">
              {activeMobileView === 'about' && 'ABOUT TK'}
              {activeMobileView === 'audition' && 'AUDITION'}
              {activeMobileView === 'contact' && 'CONTACT'}
            </span>

            <button
              id="btn-mobile-view-close"
              onClick={handleCloseMobileView}
              className="p-2 text-gray-400 hover:text-white active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dedicated View Content */}
          <div className="flex-grow">
            {activeMobileView === 'about' && (
              <AboutSection
                artistCount={artists.filter(a => a.isActive).length}
                id="about-mobile"
                isMobileView={true}
              />
            )}
            {activeMobileView === 'audition' && (
              <AuditionSection
                id="audition-mobile"
                isMobileView={true}
              />
            )}
            {activeMobileView === 'contact' && (
              <ContactSection
                artists={artists.filter(a => a.isActive)}
                companyInfo={companyInfo}
                preselectedActor={preselectedActorForContact}
                onClearPreselectedActor={() => setPreselectedActorForContact(null)}
                id="contact-mobile"
                isMobileView={true}
              />
            )}
          </div>

          {/* Bottom Back Button */}
          <div className="py-10 px-4 text-center border-t border-white/10 bg-[#07080B] pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
            <button
              id="btn-mobile-view-bottom-back"
              onClick={handleCloseMobileView}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-white text-black hover:bg-slate-200 text-xs font-bold tracking-widest uppercase transition-all shadow-lg min-h-[44px] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← 메인 화면으로 돌아가기</span>
            </button>
            <p className="text-[11px] text-gray-400 mt-3 font-mono">
              TK MANAGEMENT · 배우 목록 및 최신 소식 확인
            </p>
          </div>
        </div>
      )}

      {/* Footer (Desktop always, Mobile only on home view) */}
      <div className={activeMobileView !== 'home' ? 'hidden md:block' : 'block'}>
        <Footer
          companyInfo={companyInfo}
          onNavigate={handleNavigate}
          onOpenAdmin={handleOpenAdmin}
        />
      </div>

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
          onClose={handleCloseArtistModal}
          onGoHome={handleNavigateHome}
          onCastingInquiry={handleCastingInquiry}
          onOpenPrintSheet={handleOpenPrintSheet}
        />
      )}

      {/* Printable Bio-Sheet Modal */}
      {printArtist && (
        <ProfilePrintSheet
          artist={printArtist}
          companyInfo={companyInfo}
          onClose={handleClosePrintSheet}
          onGoHome={handleNavigateHome}
        />
      )}

      {/* Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          artists={artists}
          newsList={newsList}
          companyInfo={companyInfo}
          onUpdateCompanyInfo={setCompanyInfo}
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

