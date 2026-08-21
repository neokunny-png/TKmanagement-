import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, ArrowUpRight } from 'lucide-react';

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
    { id: 'audition', label: 'AUDITION' },
    { id: 'news', label: 'NEWS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
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
          className="flex items-center space-x-3 group text-left focus:outline-none"
        >
          {/* T+K Geometric Emblem */}
          <div className="w-8 h-8 rounded bg-[#182A47] border border-white/20 flex items-center justify-center text-white font-extrabold text-sm tracking-tighter group-hover:border-white transition-colors">
            <span className="text-white">T</span>
            <span className="text-sky-400">K</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold tracking-widest text-lg sm:text-xl text-white group-hover:text-slate-200 transition-colors">
              TK MANAGEMENT
            </span>
            <span className="text-[10px] text-gray-400 tracking-wider font-light">
              ㈜TK Company
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`text-xs tracking-widest font-medium transition-all relative py-1 hover:text-white ${
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
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all border ${
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
            className="p-2 text-gray-400 hover:text-white"
            title="관리자 시스템"
          >
            <Shield className="w-5 h-5" />
          </button>
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
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
          className="md:hidden bg-[#0B0C10]/98 border-b border-white/10 px-6 py-6 space-y-4 backdrop-blur-xl animate-in slide-in-from-top duration-200"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left py-2.5 text-sm tracking-widest font-medium border-b border-white/5 ${
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
              className="flex items-center space-x-2 text-xs text-sky-400 bg-sky-950/40 border border-sky-800/60 px-4 py-2 rounded-lg"
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
