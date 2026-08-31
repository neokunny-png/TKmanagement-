import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, ArrowUpRight } from 'lucide-react';
import { TKLogo } from './TKLogo';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  onOpenAdmin,
  isAdmin
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'ABOUT' },
    { id: 'artists', label: 'ARTISTS' },
    { id: 'news', label: 'NEWS' },
    { id: 'audition', label: 'AUDITION' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform-gpu pt-[env(safe-area-inset-top,0px)] ${
        isScrolled
          ? 'bg-[#0B0C10]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="btn-brand-logo"
          onClick={() => handleNavClick('hero')}
          className="flex items-center group text-left focus:outline-none cursor-pointer"
        >
          <TKLogo
            className="h-8 w-9 group-hover:scale-105 transition-transform"
            variant="dark"
            showText={true}
          />
        </button>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`text-xs tracking-widest font-medium transition-all relative py-1 hover:text-white cursor-pointer ${
                activeSection === item.id ? 'text-white' : 'text-gray-400'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-sky-400 shadow-sm" />
              )}
            </button>
          ))}

          {/* Admin Portal Trigger */}
          <button
            id="btn-open-admin-nav"
            onClick={onOpenAdmin}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all border cursor-pointer ${
              isAdmin
                ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
            }`}
            title="관리자 시스템"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'ADMIN (관리자)' : 'ADMIN'}</span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            id="btn-mobile-admin"
            onClick={onOpenAdmin}
            className="p-2 text-gray-400 hover:text-white cursor-pointer"
            title="관리자 시스템"
          >
            <Shield className="w-5 h-5" />
          </button>
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden bg-[#0B0C10]/98 border-b border-white/10 px-6 py-6 space-y-4 backdrop-blur-xl animate-in slide-in-from-top duration-200 max-h-[calc(100dvh-5rem)] overflow-y-auto touch-scroll pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left py-2.5 text-sm tracking-widest font-medium border-b border-white/5 cursor-pointer ${
                activeSection === item.id ? 'text-sky-400 font-bold' : 'text-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center space-x-2 text-xs text-sky-400 bg-sky-950/40 border border-sky-800/60 px-4 py-2 rounded-lg cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>관리자 페이지 (Admin)</span>
            </button>
            <span className="text-[11px] text-gray-500">㈜TK Company</span>
          </div>
        </div>
      )}
    </header>
  );
};
