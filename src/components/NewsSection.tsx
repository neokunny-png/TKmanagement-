import React, { useState } from 'react';
import { Newspaper, Calendar, ArrowRight, X, Pin } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsSectionProps {
  newsList: NewsArticle[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ newsList }) => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Notice':
        return 'bg-blue-950/70 text-blue-300 border-blue-800/60';
      case 'Casting':
        return 'bg-amber-950/70 text-amber-300 border-amber-800/60';
      case 'Media':
        return 'bg-purple-950/70 text-purple-300 border-purple-800/60';
      case 'Interview':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <section id="news" className="relative py-28 bg-[#0B0C10] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-3">
              PRESS &amp; ANNOUNCEMENTS
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tighter">
              NEWS.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-4 md:mt-0 font-light">
            TK MANAGEMENT의 공식 소식과 소속 배우들의 작품 및 캐스팅 소식을 전합니다.
          </p>
        </div>

        {/* News List */}
        <div className="space-y-4 max-w-5xl mx-auto">
          {newsList.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="p-6 bg-[#111319] border border-white/10 hover:border-white/30 hover:bg-[#141824] transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3 text-xs font-mono">
                  {article.isPinned && (
                    <span className="flex items-center space-x-1 text-sky-400 bg-sky-950 px-2 py-0.5 border border-sky-800">
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
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-400 font-light line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="shrink-0 flex items-center space-x-2 text-xs font-mono text-gray-400 group-hover:text-white transition-colors">
                <span>READ MORE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-[#11131A] border border-white/20 shadow-2xl p-6 sm:p-10 my-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center space-x-3 text-xs font-mono mb-3">
                <span className={`px-2.5 py-0.5 border ${getCategoryColor(selectedArticle.category)}`}>
                  {selectedArticle.category}
                </span>
                <span className="text-gray-400">{selectedArticle.date}</span>
                {selectedArticle.author && (
                  <span className="text-gray-500">| {selectedArticle.author}</span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {selectedArticle.title}
              </h2>
            </div>

            {selectedArticle.coverImage && (
              <div className="mb-8 aspect-video w-full overflow-hidden border border-white/10">
                <img
                  src={selectedArticle.coverImage}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
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
                className="bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-200"
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
