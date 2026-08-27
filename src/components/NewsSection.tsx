import React, { useState } from 'react';
import { Newspaper, Calendar, ArrowRight, X, Pin, Sparkles, User } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsSectionProps {
  newsList: NewsArticle[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ newsList }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Notice':
        return 'bg-blue-950/80 text-blue-300 border-blue-800';
      case 'Casting':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'Media':
        return 'bg-purple-950/80 text-purple-300 border-purple-800';
      case 'Interview':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
      case 'Company':
        return 'bg-sky-950/80 text-sky-300 border-sky-800';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const categories = [
    { key: 'ALL', label: '전체 (ALL)' },
    { key: 'Notice', label: '공지사항 (NOTICE)' },
    { key: 'Casting', label: '캐스팅 (CASTING)' },
    { key: 'Media', label: '언론보도 (MEDIA)' },
    { key: 'Interview', label: '인터뷰 (INTERVIEW)' },
    { key: 'Company', label: '회사소식 (COMPANY)' },
  ];

  const filteredNews = newsList.filter(
    (item) => selectedCategory === 'ALL' || item.category === selectedCategory
  );

  return (
    <section id="news" className="relative py-28 bg-[#0B0C10] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-3">
              PRESS &amp; ANNOUNCEMENTS
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tighter">
              NEWS.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-4 md:mt-0 font-light max-w-md text-right md:text-left">
            TK MANAGEMENT의 공식 소식과 소속 배우들의 작품 및 캐스팅 소식을 전합니다.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 text-xs font-mono scrollbar-none touch-scroll max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 sm:px-4 py-2 border whitespace-nowrap transition-all uppercase tracking-wider cursor-pointer min-h-[38px] ${
                selectedCategory === cat.key
                  ? 'bg-sky-400 text-black font-bold border-sky-400 shadow-lg shadow-sky-950/40'
                  : 'bg-[#111319] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* News List */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-20 bg-[#111319] border border-white/5 p-8 max-w-5xl mx-auto">
            <Newspaper className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-light">선택하신 카테고리에 등록된 보도자료가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-5xl mx-auto">
            {filteredNews.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="p-5 sm:p-6 bg-[#111319] border border-white/10 hover:border-sky-500/40 hover:bg-[#141824] transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Thumbnail if present */}
                {article.coverImage && (
                  <div className="w-full md:w-36 h-24 overflow-hidden border border-white/10 bg-black/50 shrink-0">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center space-x-3 text-xs font-mono flex-wrap gap-y-1">
                    {article.isPinned && (
                      <span className="flex items-center space-x-1 text-sky-400 bg-sky-950 px-2 py-0.5 border border-sky-800 font-bold">
                        <Pin className="w-3 h-3" />
                        <span>PINNED</span>
                      </span>
                    )}
                    <span className={`px-2 py-0.5 border text-[11px] font-mono ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                    <span className="text-gray-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                    </span>
                    {article.author && (
                      <span className="text-gray-500 hidden sm:inline-block">| {article.author}</span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-400 font-light line-clamp-2 leading-relaxed">
                    {article.summary || article.content.slice(0, 100)}
                  </p>
                </div>

                <div className="shrink-0 flex items-center space-x-2 text-xs font-mono text-gray-400 group-hover:text-white transition-colors self-end md:self-center">
                  <span>READ MORE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto touch-scroll bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-3xl bg-[#11131A] border border-white/20 shadow-2xl p-6 sm:p-10 my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] max-h-[90dvh] overflow-y-auto touch-scroll">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="창 닫기"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center space-x-3 text-xs font-mono mb-3 flex-wrap gap-y-1">
                {selectedArticle.isPinned && (
                  <span className="flex items-center space-x-1 text-sky-400 bg-sky-950 px-2 py-0.5 border border-sky-800 font-bold">
                    <Pin className="w-3 h-3" />
                    <span>PINNED</span>
                  </span>
                )}
                <span className={`px-2.5 py-0.5 border ${getCategoryColor(selectedArticle.category)}`}>
                  {selectedArticle.category}
                </span>
                <span className="text-gray-400 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{selectedArticle.date}</span>
                </span>
                {selectedArticle.author && (
                  <span className="text-gray-400 flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{selectedArticle.author}</span>
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                {selectedArticle.title}
              </h2>
            </div>

            {selectedArticle.coverImage && (
              <div className="mb-8 max-h-[420px] w-full overflow-hidden border border-white/10 bg-black/40">
                <img
                  src={selectedArticle.coverImage}
                  alt={selectedArticle.title}
                  className="w-full h-full object-contain max-h-[420px] mx-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed whitespace-pre-line space-y-4">
              {selectedArticle.content}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
              >
                닫기 (CLOSE)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


