import fs from 'fs';
import path from 'path';
import { STATIC_OFFICIAL_ARTISTS } from '../src/data/artists';
import { NEWS_ARTICLES } from '../src/data/news';
import { getGroupedFilmography } from '../src/types';

export interface StaticActor {
  slug: string;
  nameKo: string;
  nameEn: string;
  title: string;
  description: string;
  canonical: string;
  image: string;
  alt: string;
  gender: 'Female' | 'Male';
}

export const OFFICIAL_STATIC_ACTORS: StaticActor[] = [
  {
    slug: 'choi-eunseo',
    nameKo: '최은서',
    nameEn: 'CHOI EUN SEO',
    title: '최은서 배우 프로필 | TK매니지먼트',
    description: '최은서 배우의 프로필과 활동 정보를 확인할 수 있습니다. TK매니지먼트 소속 배우 최은서(TK 최은서)의 주요 출연 작품과 캐스팅 정보를 확인하세요.',
    canonical: 'https://www.tkm.kr/artists/choi-eunseo',
    image: 'https://www.tkm.kr/images/actors/choi-eunseo-v5-8fe5a05d.jpg',
    alt: 'TK매니지먼트 소속 배우 최은서 프로필',
    gender: 'Female',
  },
  {
    slug: 'lee-eunsoo',
    nameKo: '이은수',
    nameEn: 'LEE EUN SOO',
    title: '이은수 배우 프로필 | TK매니지먼트',
    description: '이은수 배우의 프로필과 활동 정보를 확인할 수 있습니다. TK매니지먼트 소속 배우 이은수(TK 이은수)의 주요 공연 경력과 캐스팅 정보를 확인하세요.',
    canonical: 'https://www.tkm.kr/artists/lee-eunsoo',
    image: 'https://www.tkm.kr/images/actors/lee-eunsoo-v5-26e9ac09.jpg',
    alt: 'TK매니지먼트 소속 배우 이은수 프로필',
    gender: 'Female',
  },
  {
    slug: 'park-minwook',
    nameKo: '박민욱',
    nameEn: 'PARK MIN WOOK',
    title: '박민욱 배우 프로필 | TK매니지먼트',
    description: '박민욱 배우의 프로필과 활동 정보를 확인할 수 있습니다. 박민욱은 TK MANAGEMENT 소속 배우로 작품 활동과 다양한 캐스팅 기회를 통해 활동 영역을 넓혀가고 있습니다.',
    canonical: 'https://www.tkm.kr/artists/park-minwook',
    image: 'https://www.tkm.kr/images/actors/park-minwook-v5-973012cc.jpg',
    alt: 'TK매니지먼트 소속 배우 박민욱 프로필',
    gender: 'Male',
  },
  {
    slug: 'park-hyunjin',
    nameKo: '박현진',
    nameEn: 'PARK HYUN JIN',
    title: '박현진 배우 프로필 | TK매니지먼트',
    description: '박현진 배우의 프로필과 활동 정보를 확인할 수 있습니다. 박현진은 TK MANAGEMENT 소속 배우로 작품 활동과 다양한 캐스팅 기회를 통해 활동 영역을 넓혀가고 있습니다.',
    canonical: 'https://www.tkm.kr/artists/park-hyunjin',
    image: 'https://www.tkm.kr/images/actors/park-hyunjin-v5-d3cb5da4.jpg',
    alt: 'TK매니지먼트 소속 배우 박현진 프로필',
    gender: 'Female',
  },
];

export interface StaticPageConfig {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  h1: string;
  subtitle: string;
  breadcrumbName: string;
}

export const STATIC_SECTIONS: StaticPageConfig[] = [
  {
    path: 'management',
    title: '배우 매니지먼트 | TK매니지먼트',
    description: 'TK매니지먼트의 배우 매니지먼트 시스템을 안내합니다. 소속 배우 활동 지원, 배우 프로필 관리, 작품 캐스팅 및 신인배우 성장 지원을 체계적으로 수행합니다.',
    canonical: 'https://www.tkm.kr/management',
    ogTitle: '배우 매니지먼트 | TK매니지먼트',
    ogDescription: 'TK매니지먼트의 배우 매니지먼트 시스템을 안내합니다. 소속 배우 활동 지원, 배우 프로필 관리, 작품 캐스팅 및 신인배우 성장 지원을 체계적으로 수행합니다.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: '배우 매니지먼트 TK매니지먼트',
    h1: '배우 매니지먼트',
    subtitle: 'ACTOR MANAGEMENT SYSTEM',
    breadcrumbName: '배우 매니지먼트',
  },
  {
    path: 'actor-agency',
    title: '배우 소속사 | TK매니지먼트',
    description: '배우 소속사 TK매니지먼트를 소개합니다. 배우 소속사의 역할, 신인배우가 소속사를 선택할 때 확인할 사항, 배우 프로필 준비와 오디션 정보를 확인하세요.',
    canonical: 'https://www.tkm.kr/actor-agency',
    ogTitle: '배우 소속사 | TK매니지먼트',
    ogDescription: '배우 소속사 TK매니지먼트를 소개합니다. 배우 소속사의 역할, 신인배우가 소속사를 선택할 때 확인할 사항, 배우 프로필 준비와 오디션 정보를 확인하세요.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: '배우 소속사 TK매니지먼트',
    h1: '배우 소속사 TK매니지먼트',
    subtitle: 'ACTOR AGENCY GUIDE',
    breadcrumbName: '배우 소속사',
  },
  {
    path: 'actor-management-company',
    title: '배우 기획사 | TK매니지먼트',
    description: '배우 기획사 TK매니지먼트의 아티스트 기획과 배우 매니지먼트 운영 체계를 안내합니다. 제작사 캐스팅 협업 및 소속 배우 정보를 확인하세요.',
    canonical: 'https://www.tkm.kr/actor-management-company',
    ogTitle: '배우 기획사 | TK매니지먼트',
    ogDescription: '배우 기획사 TK매니지먼트의 아티스트 기획과 배우 매니지먼트 운영 체계를 안내합니다. 제작사 캐스팅 협업 및 소속 배우 정보를 확인하세요.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: '배우 기획사 TK매니지먼트',
    h1: '배우 기획사 TK매니지먼트',
    subtitle: 'ACTOR MANAGEMENT COMPANY',
    breadcrumbName: '배우 기획사',
  },
  {
    path: 'artists',
    title: 'TK매니지먼트 소속 배우 | 최은서·이은수·박민욱·박현진',
    description: 'TK매니지먼트 소속 배우 최은서, 이은수, 박민욱, 박현진의 프로필과 주요 경력 및 활동 정보를 확인하세요.',
    canonical: 'https://www.tkm.kr/artists',
    ogTitle: 'TK매니지먼트 소속 배우 | 최은서·이은수·박민욱·박현진',
    ogDescription: 'TK매니지먼트 소속 배우 최은서, 이은수, 박민욱, 박현진의 프로필과 주요 경력 및 활동 정보를 확인하세요.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK매니지먼트 소속 배우',
    h1: 'TK매니지먼트 소속 배우',
    subtitle: 'TK MANAGEMENT ARTISTS',
    breadcrumbName: '소속 배우',
  },
  {
    path: 'audition',
    title: 'TK매니지먼트 신인배우 오디션 | 배우 모집',
    description: 'TK매니지먼트 신인배우 오디션 안내. 배우 모집, 지원 방법, 제출 자료 및 오디션 진행 과정을 확인하고 새로운 배우의 가능성을 TK매니지먼트와 함께 시작하세요.',
    canonical: 'https://www.tkm.kr/audition',
    ogTitle: 'TK매니지먼트 신인배우 오디션 | 배우 모집',
    ogDescription: 'TK매니지먼트 신인배우 오디션 안내. 배우 모집, 지원 방법, 제출 자료 및 오디션 진행 과정을 확인하고 새로운 배우의 가능성을 TK매니지먼트와 함께 시작하세요.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK매니지먼트 신인배우 오디션',
    h1: 'TK매니지먼트 신인배우 오디션',
    subtitle: 'AUDITION & CASTING',
    breadcrumbName: '신인배우 오디션',
  },
  {
    path: 'news',
    title: 'TK매니지먼트 NEWS | 배우·캐스팅·오디션 소식',
    description: 'TK매니지먼트의 배우 활동, 캐스팅, 오디션, 패션 및 엔터테인먼트 관련 최신 소식을 확인하세요.',
    canonical: 'https://www.tkm.kr/news',
    ogTitle: 'TK매니지먼트 NEWS | 배우·캐스팅·오디션 소식',
    ogDescription: 'TK매니지먼트의 배우 활동, 캐스팅, 오디션, 패션 및 엔터테인먼트 관련 최신 소식을 확인하세요.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK매니지먼트 뉴스',
    h1: 'TK매니지먼트 소식',
    subtitle: 'PRESS & UPDATES',
    breadcrumbName: '뉴스',
  },
  {
    path: 'contact',
    title: 'TK매니지먼트 | 배우 캐스팅·매니지먼트 문의',
    description: 'TK매니지먼트의 배우 캐스팅, 매니지먼트 및 비즈니스 관련 문의 정보를 확인하세요.',
    canonical: 'https://www.tkm.kr/contact',
    ogTitle: 'TK매니지먼트 | 배우 캐스팅·매니지먼트 문의',
    ogDescription: 'TK매니지먼트의 배우 캐스팅, 매니지먼트 및 비즈니스 관련 문의 정보를 확인하세요.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK매니지먼트 문의',
    h1: 'TK매니지먼트 문의',
    subtitle: 'CONTACT & LOCATION',
    breadcrumbName: '문의',
  },
  {
    path: 'about',
    title: 'TK매니지먼트 | 배우 매니지먼트 회사 소개',
    description: 'TK매니지먼트는 배우의 가능성을 발굴하고 체계적인 매니지먼트를 통해 새로운 기회를 만들어가는 배우 전문 매니지먼트입니다.',
    canonical: 'https://www.tkm.kr/about',
    ogTitle: 'TK매니지먼트 | 배우 매니지먼트 회사 소개',
    ogDescription: 'TK매니지먼트는 배우의 가능성을 발굴하고 체계적인 매니지먼트를 통해 새로운 기회를 만들어가는 배우 전문 매니지먼트입니다.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK매니지먼트 소개',
    h1: 'TK매니지먼트',
    subtitle: 'ABOUT TK MANAGEMENT',
    breadcrumbName: '회사 소개',
  },
  {
    path: 'terms',
    title: 'TK MANAGEMENT 이용약관',
    description: 'TK MANAGEMENT 홈페이지 이용약관입니다. 사이트 이용에 관한 권리와 의무, 오디션 및 문의 서비스 이용에 관한 사항을 안내합니다.',
    canonical: 'https://www.tkm.kr/terms',
    ogTitle: 'TK MANAGEMENT 이용약관',
    ogDescription: 'TK MANAGEMENT 홈페이지 이용약관입니다. 사이트 이용에 관한 권리와 의무, 오디션 및 문의 서비스 이용에 관한 사항을 안내합니다.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK MANAGEMENT 이용약관',
    h1: 'TK MANAGEMENT 이용약관',
    subtitle: 'TERMS OF SERVICE',
    breadcrumbName: '이용약관',
  },
  {
    path: 'privacy',
    title: 'TK MANAGEMENT 개인정보처리방침',
    description: 'TK MANAGEMENT의 개인정보처리방침입니다. 오디션 지원 및 문의 과정에서의 개인정보 처리 목적과 보유기간, 이용자의 권리 및 개인정보 보호 관련 사항을 안내합니다.',
    canonical: 'https://www.tkm.kr/privacy',
    ogTitle: 'TK MANAGEMENT 개인정보처리방침',
    ogDescription: 'TK MANAGEMENT의 개인정보처리방침입니다. 오디션 지원 및 문의 과정에서의 개인정보 처리 목적과 보유기간, 이용자의 권리 및 개인정보 보호 관련 사항을 안내합니다.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK MANAGEMENT 개인정보처리방침',
    h1: 'TK MANAGEMENT 개인정보처리방침',
    subtitle: 'PRIVACY POLICY',
    breadcrumbName: '개인정보처리방침',
  },
];

/**
 * Transforms base HTML template to actor-specific pre-rendered HTML document
 */
export function buildActorHtml(baseHtml: string, actor: StaticActor): string {
  let html = baseHtml;

  // 1. Replace Title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${actor.title}</title>`);

  // 2. Replace Meta Description
  html = html.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${actor.description}" />`
  );

  // 3. Replace Canonical Link and inject high-priority image preload
  html = html.replace(
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${actor.canonical}" />\n    <link rel="preload" as="image" href="${actor.image}" fetchpriority="high" />`
  );

  // 4. Replace OpenGraph Tags
  html = html.replace(
    /<meta\s+property=["']og:type["'][^>]*>/i,
    `<meta property="og:type" content="profile" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${actor.title}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${actor.description}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${actor.canonical}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:image["'][^>]*>/i,
    `<meta property="og:image" content="${actor.image}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:image:alt["'][^>]*>/i,
    `<meta property="og:image:alt" content="${actor.alt}" />`
  );

  // 5. Replace Twitter Card Tags
  html = html.replace(
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${actor.title}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${actor.description}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:image["'][^>]*>/i,
    `<meta name="twitter:image" content="${actor.image}" />`
  );

  // 6. Inject Schema.org Person, WebPage, and BreadcrumbList
  const artist = STATIC_OFFICIAL_ARTISTS.find(
    (a) => a.id === `artist-${actor.slug}` || a.nameKo === actor.nameKo
  );

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${actor.canonical}#person`,
        "name": actor.nameKo,
        "alternateName": [actor.nameEn, `${actor.nameKo} 배우`, `TK ${actor.nameKo}`, `${actor.nameKo} 프로필`],
        "url": actor.canonical,
        "image": actor.image,
        "jobTitle": "배우 (Actor)",
        "description": actor.description,
        "worksFor": {
          "@type": "Organization",
          "@id": "https://www.tkm.kr/#organization",
          "name": "TK매니지먼트",
          "alternateName": ["TK MANAGEMENT", "티케이매니지먼트", "tkmanagement", "㈜TK Company"],
          "url": "https://www.tkm.kr/"
        },
        ...(artist?.birth ? { "birthDate": artist.birth.replace(/\./g, '-') } : {}),
        ...(artist?.height ? { "height": `${artist.height} cm` } : {}),
        ...(artist?.education ? { "alumniOf": artist.education } : {})
      },
      {
        "@type": "WebPage",
        "@id": `${actor.canonical}#webpage`,
        "name": actor.title,
        "url": actor.canonical,
        "description": actor.description,
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.tkm.kr/#website",
          "name": "TK매니지먼트",
          "url": "https://www.tkm.kr/"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${actor.canonical}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "홈",
            "item": "https://www.tkm.kr/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "소속 배우",
            "item": "https://www.tkm.kr/artists"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": actor.nameKo,
            "item": actor.canonical
          }
        ]
      }
    ]
  };

  const jsonLdString = `\n    <!-- Actor Schema.org JSON-LD (Pre-rendered) -->\n    <script type="application/ld+json" id="actor-jsonld">\n${JSON.stringify(jsonLdData, null, 2)}\n    </script>\n  </head>`;
  html = html.replace('</head>', jsonLdString);

  // Render filmography categories if artist data exists
  let filmographyHtml = '';
  let agencyOverviewHtml = '';
  if (artist && artist.filmography && artist.filmography.length > 0) {
    const groups = getGroupedFilmography(artist.filmography);
    const categoryNamesKo = Array.from(new Set(groups.map(g => g.categoryLabelKo))).join(', ');
    const representativeWorks = groups.flatMap(g => g.items.slice(0, 2)).slice(0, 5);

    agencyOverviewHtml = `
      <div class="mt-6 p-5 bg-[#161A26] border border-white/10 rounded text-left space-y-4">
        <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
          <h3 class="text-xs font-mono font-bold text-sky-400 tracking-wider uppercase">
            TK MANAGEMENT 공식 프로필 안내 · ${actor.nameKo} 배우 소개
          </h3>
          <span class="text-[11px] font-mono text-gray-400">OFFICIAL AGENCY OVERVIEW</span>
        </div>
        <div class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
          <p>
            <strong class="text-white font-medium">${actor.nameKo}(${actor.nameEn}) 배우</strong>는 배우 매니지먼트사 <strong class="text-white font-medium">TK MANAGEMENT(티케이매니지먼트)</strong> 소속 배우로, ${categoryNamesKo || '다양한'} 분야에서 꾸준한 작품 활동을 이어가고 있습니다.
          </p>
          ${representativeWorks.length > 0 ? `
            <div>
              <h4 class="text-xs font-mono text-gray-400 mb-1.5 font-semibold">주요 출연 경력 요약</h4>
              <p class="text-xs text-gray-300 leading-relaxed">
                주요 출연작으로는 ${representativeWorks.map(w => `${w.year}년 《${w.title}》(${w.role})`).join(', ')} 등이 있으며, 총 ${artist.filmography.length}편의 공식 필모그래피를 보유하고 있습니다.
              </p>
            </div>
          ` : ''}
          <div>
            <h4 class="text-xs font-mono text-gray-400 mb-1 font-semibold">TK MANAGEMENT 소속 활동 안내</h4>
            <p class="text-xs text-gray-400 leading-relaxed">
              본 페이지는 TK매니지먼트가 공식 운영하는 ${actor.nameKo} 배우의 프로필 페이지입니다. 드라마·영화·OTT·공연·광고 등 ${actor.nameKo} 배우에 대한 공식 캐스팅 및 작품 출연 문의는 TK MANAGEMENT를 통해 진행됩니다.
            </p>
          </div>
        </div>
      </div>
    `;

    filmographyHtml = `
      <div class="mt-8 pt-6 border-t border-white/10 text-left space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-sky-500/30">
          <h2 class="text-sm font-bold text-white tracking-wider uppercase font-mono">
            FILMOGRAPHY <span class="text-sky-400 font-normal">(${artist.filmography.length}편)</span>
          </h2>
          <span class="text-[11px] font-mono text-gray-400">주요 출연 작품</span>
        </div>
        <div class="space-y-4">
          ${groups.map(group => `
            <div class="space-y-1.5">
              <div class="flex items-center justify-between pb-1 border-b border-white/10 text-xs font-mono">
                <h3 class="text-sky-300 font-bold">${group.categoryLabelEn} <span class="text-gray-300 font-normal">(${group.categoryLabelKo})</span></h3>
                <span class="text-gray-400">${group.items.length}편</span>
              </div>
              <div class="divide-y divide-white/5 bg-[#161A26] border border-white/5 rounded">
                ${group.items.map(item => `
                  <div class="p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                    <div class="flex items-baseline space-x-2.5">
                      <span class="font-mono text-sky-400 font-bold min-w-[36px]">${item.year}</span>
                      <strong class="text-white">${item.title}</strong>
                    </div>
                    <div class="text-gray-300 font-mono sm:text-right pl-11 sm:pl-0 text-[11px]">
                      <span>${item.role}</span>
                      ${item.note ? `<span class="text-gray-500 ml-1">(${item.note})</span>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  const otherActors = OFFICIAL_STATIC_ACTORS.filter(a => a.slug !== actor.slug);
  const groupsForCategories = artist?.filmography ? getGroupedFilmography(artist.filmography) : [];
  const activeCategoryLabels = groupsForCategories.map(g => g.categoryLabelKo).join(' · ') || '연기 전반';

  // 7. Inject meaningful pre-rendered HTML with strict H1 and alt text inside #root
  const actorRootHtml = `<div id="root">
  <div class="tk-actor-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-3xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <a href="/artists" class="hover:text-white transition-colors">소속 배우</a> &gt; <span class="text-white">${actor.nameKo} 배우</span>
    </nav>
    <article class="w-full max-w-3xl bg-[#111319] border border-white/10 p-6 sm:p-8 rounded-lg text-center shadow-2xl">
      <div class="aspect-[3/4] max-w-xs sm:max-w-sm mx-auto overflow-hidden rounded mb-6 border border-white/10 bg-black/40">
        <img src="${actor.image}" alt="${actor.alt}" class="w-full h-full object-cover" />
      </div>
      <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-1">TK MANAGEMENT ACTOR</span>
      <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">${actor.nameKo} 배우</h1>
      <p class="text-sm font-mono text-gray-400 uppercase mb-3 tracking-widest">${actor.nameEn}</p>
      
      <div class="inline-flex items-center gap-2 bg-[#161A26] border border-white/10 px-3.5 py-1.5 text-xs font-mono text-gray-300 rounded mb-4">
        <span class="text-sky-400">소속:</span>
        <strong class="text-white">TK MANAGEMENT (TK매니지먼트)</strong>
      </div>

      <p class="text-sm text-gray-300 leading-relaxed max-w-xl mx-auto mb-6">${actor.description}</p>

      ${artist?.bio && artist.bio !== actor.description ? `
        <div class="mb-6 p-4 bg-[#141824] border-l-2 border-sky-400 text-xs sm:text-sm text-gray-300 leading-relaxed text-left max-w-xl mx-auto">
          <span class="text-[10px] font-mono text-sky-400 uppercase font-bold block mb-1">배우 소개</span>
          <p>${artist.bio}</p>
        </div>
      ` : ''}

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-left max-w-xl mx-auto my-6">
        <div class="bg-[#161A26] p-2.5 border border-white/5">
          <span class="text-gray-500 block text-[10px]">소속사</span>
          <strong class="text-white">TK MANAGEMENT</strong>
        </div>
        <div class="bg-[#161A26] p-2.5 border border-white/5">
          <span class="text-gray-500 block text-[10px]">직업</span>
          <strong class="text-white">배우 (Actor)</strong>
        </div>
        <div class="bg-[#161A26] p-2.5 border border-white/5">
          <span class="text-gray-500 block text-[10px]">생년월일</span>
          <strong class="text-white">${artist?.birth || '-'}</strong>
        </div>
        <div class="bg-[#161A26] p-2.5 border border-white/5">
          <span class="text-gray-500 block text-[10px]">신장 / 성별</span>
          <strong class="text-white">${artist?.height ? `${artist.height}cm` : '-'} · ${actor.gender === 'Female' ? '여성' : '남성'}</strong>
        </div>
        ${artist?.education ? `
        <div class="bg-[#161A26] p-2.5 border border-white/5 col-span-2">
          <span class="text-gray-500 block text-[10px]">학력</span>
          <strong class="text-white">${artist.education}</strong>
        </div>
        ` : ''}
        ${artist?.specialty ? `
        <div class="bg-[#161A26] p-2.5 border border-white/5 col-span-2">
          <span class="text-gray-500 block text-[10px]">특기</span>
          <strong class="text-white">${artist.specialty}</strong>
        </div>
        ` : ''}
        <div class="bg-[#161A26] p-2.5 border border-white/5 col-span-2 sm:col-span-4">
          <span class="text-gray-500 block text-[10px]">출연 분야</span>
          <strong class="text-white">${activeCategoryLabels}</strong>
        </div>
      </div>

      ${agencyOverviewHtml}

      ${filmographyHtml}

      <div class="mt-8 pt-6 border-t border-white/10 text-left space-y-3">
        <span class="text-xs font-mono text-gray-400 uppercase block">TK MANAGEMENT 소속 배우</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
          ${otherActors.map(other => `
            <a href="/artists/${other.slug}" class="p-2.5 bg-[#161A26] border border-white/5 hover:border-sky-400/40 rounded flex items-center justify-between transition-colors">
              <strong class="text-white">${other.nameKo} 배우</strong>
              <span class="text-[10px] text-sky-400">${other.nameEn}</span>
            </a>
          `).join('')}
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-white/10 flex flex-wrap justify-center gap-4 text-xs font-mono">
        <a href="/artists" class="text-sky-400 hover:underline">TK MANAGEMENT 전체 소속 배우 보기</a>
        <span class="text-gray-600">|</span>
        <a href="/contact" class="text-sky-400 hover:underline">${actor.nameKo} 배우 캐스팅 및 출연 문의</a>
        <span class="text-gray-600">|</span>
        <a href="/audition" class="text-sky-400 hover:underline">TK매니지먼트 신인배우 오디션 안내</a>
        <span class="text-gray-600">|</span>
        <a href="/" class="text-sky-400 hover:underline">TK매니지먼트 공식 홈</a>
      </div>
    </article>
  </div>
</div>`;

  html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, actorRootHtml);

  return html;
}

/**
 * Transforms base HTML template to section-specific pre-rendered HTML document
 */
export function buildSectionHtml(baseHtml: string, section: StaticPageConfig): string {
  let html = baseHtml;

  // 1. Title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${section.title}</title>`);

  // 2. Meta Description
  html = html.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${section.description}" />`
  );

  // 3. Canonical Link
  html = html.replace(
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${section.canonical}" />`
  );

  // 4. OpenGraph Tags
  html = html.replace(
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${section.ogTitle}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${section.ogDescription}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${section.canonical}" />`
  );

  // 5. Twitter Card Tags
  html = html.replace(
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${section.ogTitle}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${section.ogDescription}" />`
  );

  // 6. Inject Schema.org WebPage and BreadcrumbList (and Article list for /news)
  const graphItems: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${section.canonical}#webpage`,
      "name": section.title,
      "url": section.canonical,
      "description": section.description,
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://www.tkm.kr/#website",
        "name": "TK매니지먼트",
        "url": "https://www.tkm.kr/"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${section.canonical}#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "홈",
          "item": "https://www.tkm.kr/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": section.breadcrumbName,
          "item": section.canonical
        }
      ]
    }
  ];

  if (section.path === 'news') {
    for (const article of NEWS_ARTICLES.slice(0, 6)) {
      graphItems.push({
        "@type": "Article",
        "headline": article.title,
        "datePublished": article.date.replace(/\./g, '-'),
        "description": article.summary,
        "image": article.coverImage || "https://www.tkm.kr/og-image.jpg",
        "author": {
          "@type": "Organization",
          "name": "TK매니지먼트",
          "url": "https://www.tkm.kr/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "TK매니지먼트",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.tkm.kr/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://www.tkm.kr/news"
        }
      });
    }
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": graphItems
  };

  const jsonLdString = `\n    <!-- Section Schema.org JSON-LD (Pre-rendered) -->\n    <script type="application/ld+json" id="section-jsonld">\n${JSON.stringify(jsonLdData, null, 2)}\n    </script>\n  </head>`;
  html = html.replace('</head>', jsonLdString);

  const officialActorLinksHtml = `
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-left">
      <a href="/artists/choi-eunseo" class="p-3 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all block">
        <span class="text-[10px] font-mono text-sky-400 block">TK ACTOR</span>
        <strong class="text-sm text-white block">최은서 배우</strong>
        <span class="text-[11px] font-mono text-gray-400">CHOI EUN SEO</span>
      </a>
      <a href="/artists/lee-eunsoo" class="p-3 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all block">
        <span class="text-[10px] font-mono text-sky-400 block">TK ACTOR</span>
        <strong class="text-sm text-white block">이은수 배우</strong>
        <span class="text-[11px] font-mono text-gray-400">LEE EUN SOO</span>
      </a>
      <a href="/artists/park-minwook" class="p-3 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all block">
        <span class="text-[10px] font-mono text-sky-400 block">TK ACTOR</span>
        <strong class="text-sm text-white block">박민욱 배우</strong>
        <span class="text-[11px] font-mono text-gray-400">PARK MIN WOOK</span>
      </a>
      <a href="/artists/park-hyunjin" class="p-3 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all block">
        <span class="text-[10px] font-mono text-sky-400 block">TK ACTOR</span>
        <strong class="text-sm text-white block">박현진 배우</strong>
        <span class="text-[11px] font-mono text-gray-400">PARK HYUN JIN</span>
      </a>
    </div>
  `;

  // 7. Pre-rendered section root
  let sectionRootHtml = '';

  if (section.path === 'management') {
    sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-4xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-4xl bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg text-left shadow-2xl space-y-8">
      <header class="border-b border-white/10 pb-6">
        <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-1">${section.subtitle}</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">배우 매니지먼트</h1>
        <p class="text-sm text-gray-300 leading-relaxed">TK매니지먼트(TK MANAGEMENT)는 연기자가 가진 고유한 가능성을 발견하고, 체계적인 프로필 관리와 작품 활동 지원을 통해 함께 성장해 나가는 파트너입니다.</p>
      </header>
      <section class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <h2 class="text-lg font-bold text-white">01. 배우 매니지먼트란?</h2>
        <p>연기자가 하나의 작품을 만나 관객과 시청자에게 설득력 있는 인물로 다가가기까지는 연기 준비 외에도 수많은 실무 과정이 동반됩니다. 매니지먼트는 배우가 오직 대본 분석과 캐릭터 구축, 그리고 현장 연기에만 집중할 수 있도록 활동 전반의 기반을 마련하고 함께 호흡하는 전문 파트너십입니다.</p>
        <p>단순히 일정을 전달하는 역할을 넘어, 연기자 개개인이 지닌 분위기와 목소리, 연기적 장점을 객관적으로 살피고 앞으로 나아갈 커리어의 방향을 함께 설계하는 과정이 핵심입니다.</p>
      </section>
      <section class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/10">
        <h2 class="text-lg font-bold text-white">02. 배우 매니지먼트 회사의 역할</h2>
        <p>회사는 배우와 제작 현장을 잇는 공식 소통 창구로서 기능합니다. 제작사, 연출진, 캐스팅 디렉터와의 미팅 및 섭외 협의를 진행하며, 출연 계약 조건 검토와 촬영 스케줄 조율 등 배우 개인이 혼자 감당하기 어려운 실무 절차를 책임감 있게 수행합니다.</p>
        <p>또한 업계의 흐름과 제작 현황을 파악하여 소속 연기자가 자신의 스펙트럼을 넓힐 수 있는 적절한 시기와 작품을 만날 수 있도록 가교 역할을 담당합니다.</p>
      </section>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">03. 소속 배우 활동 지원</h2>
          <p class="text-xs text-gray-300 leading-relaxed">작품 합류 전 대본 리딩과 의상·콘셉트 준비부터 촬영 현장 및 공연 무대 진행, 그리고 작품 공개 시점의 공식 소식 안내까지 전 과정이 안정적으로 이루어지도록 세심하게 뒷받침합니다.</p>
        </section>
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">04. 배우 프로필 및 활동 관리</h2>
          <p class="text-xs text-gray-300 leading-relaxed">공식 웹사이트(<a href="/artists" class="text-sky-400 hover:underline">/artists</a>)와 인쇄용 PDF 바이오 시트를 통해 배우의 최신 프로필 화보, 신체 스펙, 분야별 출연작(드라마·영화·연극·광고·MV) 이력을 상시 최신화하여 캐스팅 담당자가 즉시 열람할 수 있도록 관리합니다.</p>
        </section>
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">05. 작품 및 캐스팅 관련 지원</h2>
          <p class="text-xs text-gray-300 leading-relaxed">드라마, 웹드라마, 상업·독립영화, OTT 시리즈, 연극, CF(광고), 뮤직비디오 등 다양한 매체의 제작진에게 배역 이미지에 부합하는 소속 배우의 포트폴리오를 제안하고 오디션 및 출연 협의를 진행합니다.</p>
        </section>
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">06. 신인배우 성장 지원</h2>
          <p class="text-xs text-gray-300 leading-relaxed">잠재력을 지닌 신인 연기자가 자신만의 개성과 연기 호흡을 정립할 수 있도록 방향성을 함께 고민하며, 카메라 테스트와 실전 오디션 경험을 통해 현장 적응력과 필모그래피를 차근차근 쌓아갈 수 있도록 돕습니다.</p>
        </section>
      </div>
      <section class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/10">
        <h2 class="text-lg font-bold text-white">07. TK매니지먼트의 매니지먼트 방향</h2>
        <p>TK매니지먼트(㈜TK Company)는 발견(Discovery) → 성장과 훈련(Development) → 체계적 관리(Management) → 기회 연결(Opportunity)의 4단계 원칙을 바탕으로 운영됩니다. 단기적인 화제성이나 무리한 활동보다, 연기자가 작품 속에서 진정성 있는 호흡을 보여주고 현장에서 신뢰받는 파트너로 자리매김하는 것을 가장 중요하게 생각합니다.</p>
      </section>
      <section class="space-y-3 pt-4 border-t border-white/10">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white">08. 현재 소속 배우</h2>
          <a href="/artists" class="text-xs font-mono text-sky-400 hover:underline">소속 배우 전체 보기 (/artists) →</a>
        </div>
        <p class="text-xs sm:text-sm text-gray-300">현재 TK매니지먼트에는 각기 다른 매력과 연기 색깔을 지닌 4명의 공식 소속 배우가 활발히 활동하고 있습니다.</p>
        ${officialActorLinksHtml}
      </section>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">09. 신인배우 오디션</h2>
          <p class="text-xs text-gray-300 leading-relaxed">연기에 대한 진정성과 열정을 지닌 신인 및 배우 지망생을 상시 모집합니다. 1차 온라인 서류 심사 후 2차 대면 카메라 오디션과 심층 미팅을 거쳐 전속 계약을 논의하며, 모든 오디션 과정에서는 어떠한 명목의 비용도 요구하지 않습니다.</p>
          <a href="/audition" class="inline-block text-xs font-mono text-sky-400 hover:underline pt-1">신인배우 오디션 지원 안내 바로가기 (/audition) →</a>
        </section>
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">10. 문의</h2>
          <p class="text-xs text-gray-300 leading-relaxed">소속 배우의 드라마·영화·광고·공연 캐스팅 섭외 제안 및 비즈니스 협업 문의는 공식 문의 페이지 또는 공식 이메일(taz0206@naver.com)을 통해 신속하게 안내받으실 수 있습니다.</p>
          <a href="/contact" class="inline-block text-xs font-mono text-sky-400 hover:underline pt-1">캐스팅 및 비즈니스 문의 바로가기 (/contact) →</a>
        </section>
      </div>
      <div class="pt-6 border-t border-white/10 flex flex-wrap justify-center gap-4 text-xs font-mono">
        <a href="/artists" class="text-sky-400 hover:underline">소속 배우 목록</a>
        <span class="text-gray-600">|</span>
        <a href="/artists/choi-eunseo" class="text-sky-400 hover:underline">최은서 배우</a>
        <span class="text-gray-600">|</span>
        <a href="/artists/lee-eunsoo" class="text-sky-400 hover:underline">이은수 배우</a>
        <span class="text-gray-600">|</span>
        <a href="/artists/park-minwook" class="text-sky-400 hover:underline">박민욱 배우</a>
        <span class="text-gray-600">|</span>
        <a href="/artists/park-hyunjin" class="text-sky-400 hover:underline">박현진 배우</a>
        <span class="text-gray-600">|</span>
        <a href="/audition" class="text-sky-400 hover:underline">신인배우 오디션</a>
        <span class="text-gray-600">|</span>
        <a href="/contact" class="text-sky-400 hover:underline">문의</a>
      </div>
    </article>
  </div>
</div>`;
  } else if (section.path === 'actor-agency') {
    sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-4xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-4xl bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg text-left shadow-2xl space-y-8">
      <header class="border-b border-white/10 pb-6">
        <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-1">${section.subtitle}</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">배우 소속사 TK매니지먼트</h1>
        <p class="text-sm text-gray-300 leading-relaxed">연기자의 활동을 뒷받침하는 소속사의 실질적인 역할과 파트너십, 그리고 신인 연기자가 소속사를 찾고 프로필·오디션을 준비할 때 알아두어야 할 기준을 안내합니다.</p>
      </header>
      <section class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <h2 class="text-lg font-bold text-white">01. 배우 소속사의 역할</h2>
        <p>소속사는 연기자의 대외적인 공식 창구이자, 작품 활동의 전 과정을 함께 계획하고 조율하는 실무 조직입니다. 개인이 홀로 접근하기 어려운 드라마·영화·공연·광고 제작진과의 네트워크를 연결하고, 오디션 일정 조율부터 출연 협의, 촬영 현장 지원까지 체계적으로 뒷받침합니다.</p>
        <p>또한 연기자의 공식 프로필과 필모그래피를 아카이빙하여 캐스팅 담당자에게 신뢰도 높은 정보를 제공하고, 작품 외적인 행정 업무에 대한 부담을 덜어 연기자가 본업인 연기에만 몰입할 수 있는 환경을 만듭니다.</p>
      </section>
      <section class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/10">
        <h2 class="text-lg font-bold text-white">02. 배우와 매니지먼트사의 관계</h2>
        <p>연기자와 회사는 일방적인 관리 대상이 아니라 상호 신뢰를 바탕으로 한 동반자 관계입니다. 연기자가 현장에서 진정성 있는 연기와 성실한 태도를 보여줄 때 회사의 대외 신뢰도가 높아지고, 회사가 체계적인 <a href="/management" class="text-sky-400 hover:underline">매니지먼트 시스템(/management)</a>으로 뒷받침할 때 연기자의 활동 폭이 넓어집니다.</p>
        <p>따라서 눈앞의 단기적인 성과에 급급하기보다, 배우 고유한 이미지와 장단점을 솔직하게 공유하고 중장기적인 캐릭터 방향을 함께 조율해 나가는 소통 과정이 무엇보다 중요합니다.</p>
      </section>
      <section class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/10">
        <h2 class="text-lg font-bold text-white">03. 신인배우가 소속사를 선택할 때 확인할 사항</h2>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>정식 상호(㈜TK Company)와 사업자등록번호, 대중문화예술기획업 등록(또는 등록 진행 현황), 사업장 소재지 및 공식 연락처의 투명한 공개 여부</li>
          <li>오디션 지원 및 심사 과정에서 참가비, 프로필 촬영비, 교육비 등 부당한 비용 요구가 없는 투명한 절차 운영 여부</li>
          <li>현재 소속되어 활동 중인 배우들의 공식 프로필과 출연 이력이 성실하게 관리되고 외부 캐스팅 소통 창구가 운영되는지 여부</li>
        </ul>
      </section>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">04. 배우 프로필 준비</h2>
          <p class="text-xs text-gray-300 leading-relaxed">과도한 보정을 피하고 본연의 이목구비와 분위기를 자연스럽게 확인할 수 있는 정면 클로즈업, 상반신, 전신 사진으로 구성하는 것이 좋습니다. 실제 확인 가능한 출연 경력이 있다면 연도와 배역을 정확히 정리해 두어야 합니다.</p>
        </section>
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">05. 오디션 준비</h2>
          <p class="text-xs text-gray-300 leading-relaxed">서류 지원 시 사진과 함께 발성, 딕션, 시선 처리를 보여줄 수 있는 1~2분 내외의 독백 또는 자유 연기 영상을 준비하면 심사에 도움이 됩니다. 대면 오디션에서는 대사의 상황을 이해하고 본인의 호흡으로 자연스럽게 전달하는 것이 중요합니다.</p>
        </section>
      </div>
      <section class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/10">
        <h2 class="text-lg font-bold text-white">06. 배우 캐스팅과 매니지먼트의 관계</h2>
        <p>작품 캐스팅은 배역의 연령대와 성격, 작품의 톤앤매너에 어울리는 연기자를 선별하여 제작진에게 제안하고 오디션 기회를 조율한 뒤 최종 합류까지 신뢰 있게 소통하는 과정입니다. 평소 체계적인 <a href="/management" class="text-sky-400 hover:underline">배우 매니지먼트</a>를 통해 프로필과 출연 기록이 정돈되어 있을수록 제작사 및 캐스팅 디렉터와의 협업이 신속하게 진행됩니다.</p>
      </section>
      <section class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/10">
        <h2 class="text-lg font-bold text-white">07. TK매니지먼트 소개</h2>
        <p>TK매니지먼트(TK MANAGEMENT, 법인명: ㈜TK Company)는 배우의 잠재력을 발굴하고 드라마, 영화, 연극, 광고 등 다양한 매체에서의 작품 활동을 지원하는 아티스트 매니지먼트사입니다.</p>
        <div class="bg-[#161A26] p-4 border border-white/5 rounded text-xs space-y-1 font-mono">
          <div>• 상호: ㈜TK Company (티케이컴퍼니) / 브랜드명: TK매니지먼트 (TK MANAGEMENT)</div>
          <div>• 사업자등록번호: 291-88-03353</div>
          <div>• 대중문화예술기획업 등록: 제2025-서울강남-0418호(등록대기중)</div>
          <div>• 주소: 서울특별시 마포구 마포나루길 442, 마포인트 3층</div>
          <div>• 공식 이메일: taz0206@naver.com</div>
        </div>
      </section>
      <section class="space-y-3 pt-4 border-t border-white/10">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white">08. 현재 소속 배우</h2>
          <a href="/artists" class="text-xs font-mono text-sky-400 hover:underline">소속 배우 전체 보기 (/artists) →</a>
        </div>
        ${officialActorLinksHtml}
      </section>
      <section class="space-y-3 pt-4 border-t border-white/10">
        <h2 class="text-lg font-bold text-white">09. 오디션 및 문의</h2>
        <p class="text-xs sm:text-sm text-gray-300">TK매니지먼트와 함께 새로운 가능성을 펼쳐갈 신인배우 오디션 지원과 드라마·영화·광고·공연 캐스팅 문의는 아래 공식 페이지를 통해 상시 접수하실 수 있습니다.</p>
        <div class="pt-2 flex flex-wrap justify-center gap-4 text-xs font-mono">
          <a href="/management" class="text-sky-400 hover:underline">배우 매니지먼트 (/management)</a>
          <span class="text-gray-600">|</span>
          <a href="/artists" class="text-sky-400 hover:underline">소속 배우 목록 (/artists)</a>
          <span class="text-gray-600">|</span>
          <a href="/audition" class="text-sky-400 hover:underline">신인배우 오디션 (/audition)</a>
          <span class="text-gray-600">|</span>
          <a href="/contact" class="text-sky-400 hover:underline">캐스팅 및 문의 (/contact)</a>
        </div>
      </section>
    </article>
  </div>
</div>`;
  } else if (section.path === 'actor-management-company') {
    sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-4xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-4xl bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg text-left shadow-2xl space-y-8">
      <header class="border-b border-white/10 pb-6">
        <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-1">${section.subtitle}</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">배우 기획사 TK매니지먼트</h1>
        <p class="text-sm text-gray-300 leading-relaxed">연기자의 고유한 색깔을 정의하는 아티스트 기획부터 실무 매니지먼트, 작품 캐스팅 협업에 이르기까지 TK매니지먼트의 운영 기준을 소개합니다.</p>
      </header>
      <section class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
        <h2 class="text-lg font-bold text-white">01. 배우 기획사의 역할</h2>
        <p>배우 기획사는 연기자가 지닌 외적인 분위기와 내면의 연기 에너지를 면밀히 살피고, 대중과 제작진에게 어떤 배우로 각인될지 중장기적인 로드맵을 수립하는 조직입니다. 단순히 주어진 배역을 소화하는 데 그치지 않고, 배우가 가진 강점이 가장 잘 드러날 수 있는 장르와 캐릭터 영역을 단계별로 확장해 나가는 기획(Planning) 기능을 수행합니다.</p>
        <p>특히 변화가 빠른 미디어 환경 속에서 연기자의 고유한 아이덴티티를 선명하게 구축하여, 캐스팅 관계자가 특정 배역을 떠올렸을 때 가장 먼저 연상되는 배우로 자리매김하도록 돕습니다.</p>
      </section>
      <section class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/10">
        <h2 class="text-lg font-bold text-white">02. 배우 매니지먼트와 기획 업무</h2>
        <p>엔터테인먼트 현장에서 기획과 실무 관리는 하나의 흐름으로 맞물려 돌아갑니다. 아티스트의 이미지 방향성과 포트폴리오 구성을 설계하는 것이 기획 업무라면, 수립된 방향에 맞추어 실제 제작사 미팅과 현장 일정을 조율하는 과정은 <a href="/management" class="text-sky-400 hover:underline">배우 매니지먼트(/management)</a> 영역에 해당합니다. 또한 연기자가 안정적인 울타리 안에서 권익을 보호받으며 활동할 수 있도록 대외적인 기반을 제공하는 것은 <a href="/actor-agency" class="text-sky-400 hover:underline">배우 소속사(/actor-agency)</a>로서의 핵심 기능입니다.</p>
        <p>TK매니지먼트는 이러한 기획과 현장 지원이 분리되지 않고 유기적으로 연결되도록 운영하여, 배우 개개인의 방향성이 실제 작품 활동으로 자연스럽게 이어지도록 지원합니다.</p>
      </section>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">03. 배우 활동 지원</h2>
          <p class="text-xs text-gray-300 leading-relaxed">시나리오 및 대본 검토 단계부터 캐릭터 분석, 촬영장 및 공연 무대 일정 조율, 작품 공개 시점의 보도자료 및 소식 안내까지 연기 활동의 전 주기를 일관된 기준으로 지원합니다.</p>
        </section>
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">04. 작품 및 캐스팅</h2>
          <p class="text-xs text-gray-300 leading-relaxed">드라마, 상업·독립영화, OTT 시리즈, 연극, CF(광고), 뮤직비디오 등 각 제작 현장의 캐스팅 디렉터 및 연출진과 소통하며 배역 설정에 부합하는 아티스트를 제안하고 출연 협의를 진행합니다.</p>
        </section>
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">05. 신인배우 성장</h2>
          <p class="text-xs text-gray-300 leading-relaxed">가능성을 지닌 신인 연기자가 본인의 마스크와 보이스에 어울리는 주력 캐릭터를 정립할 수 있도록 돕고, 실전 오디션과 현장 경험을 통해 단계적으로 필모그래피를 확장해 나가도록 뒷받침합니다.</p>
        </section>
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">06. 배우 프로필 관리</h2>
          <p class="text-xs text-gray-300 leading-relaxed">캐스팅 관계자가 배우의 현재 이미지와 연기 이력을 즉시 검토할 수 있도록 공식 웹사이트(<a href="/artists" class="text-sky-400 hover:underline">/artists</a>)의 디지털 프로필과 인쇄용 공식 바이오 시트(PDF)를 체계적으로 큐레이션하고 관리합니다.</p>
        </section>
      </div>
      <section class="space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed pt-4 border-t border-white/10">
        <h2 class="text-lg font-bold text-white">07. TK매니지먼트 소개</h2>
        <p>TK매니지먼트(TK MANAGEMENT)는 법인 ㈜TK Company가 운영하는 아티스트 기획·매니지먼트 브랜드입니다. 연기자의 개성을 존중하는 기획력과 성실한 현장 커뮤니케이션을 바탕으로 제작 현장과 대중에게 신뢰받는 파트너를 지향합니다.</p>
        <div class="bg-[#161A26] p-4 border border-white/5 rounded text-xs space-y-1 font-mono">
          <div>• 법인 상호: ㈜TK Company (티케이컴퍼니) / 브랜드명: TK매니지먼트 (TK MANAGEMENT)</div>
          <div>• 사업자등록번호: 291-88-03353</div>
          <div>• 대중문화예술기획업 등록: 제2025-서울강남-0418호(등록대기중)</div>
          <div>• 소재지: 서울특별시 마포구 마포나루길 442, 마포인트 3층</div>
          <div>• 공식 이메일: taz0206@naver.com</div>
        </div>
      </section>
      <section class="space-y-3 pt-4 border-t border-white/10">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white">08. 소속 배우</h2>
          <a href="/artists" class="text-xs font-mono text-sky-400 hover:underline">소속 배우 전체 보기 (/artists) →</a>
        </div>
        <p class="text-xs sm:text-sm text-gray-300">현재 TK매니지먼트에 소속된 4명의 공식 아티스트(최은서, 이은수, 박민욱, 박현진) 프로필과 분야별 출연 작품 정보를 확인하실 수 있습니다.</p>
        ${officialActorLinksHtml}
      </section>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">09. 오디션</h2>
          <p class="text-xs text-gray-300 leading-relaxed">TK매니지먼트와 함께 배우로서의 커리어를 설계해 나갈 신인 및 배우 지망생을 상시 모집합니다. 온라인 지원서를 통해 프로필 사진과 자기소개, 연기 영상을 접수하실 수 있습니다.</p>
          <a href="/audition" class="inline-block text-xs font-mono text-sky-400 hover:underline pt-1">신인배우 오디션 안내 바로가기 (/audition) →</a>
        </section>
        <section class="bg-[#161A26] p-4 border border-white/5 space-y-2">
          <h2 class="text-base font-bold text-white">10. 문의</h2>
          <p class="text-xs text-gray-300 leading-relaxed">드라마, 영화, 연극, 광고 등 작품 캐스팅 섭외 제안 및 아티스트 협업 관련 비즈니스 문의는 공식 문의 페이지를 통해 접수해 주시면 담당 부서에서 신속히 회신드립니다.</p>
          <a href="/contact" class="inline-block text-xs font-mono text-sky-400 hover:underline pt-1">캐스팅 및 비즈니스 문의 바로가기 (/contact) →</a>
        </section>
      </div>
      <div class="pt-6 border-t border-white/10 flex flex-wrap justify-center gap-4 text-xs font-mono">
        <a href="/management" class="text-sky-400 hover:underline">배우 매니지먼트 (/management)</a>
        <span class="text-gray-600">|</span>
        <a href="/actor-agency" class="text-sky-400 hover:underline">배우 소속사 (/actor-agency)</a>
        <span class="text-gray-600">|</span>
        <a href="/artists" class="text-sky-400 hover:underline">소속 배우 (/artists)</a>
        <span class="text-gray-600">|</span>
        <a href="/audition" class="text-sky-400 hover:underline">오디션 (/audition)</a>
        <span class="text-gray-600">|</span>
        <a href="/contact" class="text-sky-400 hover:underline">문의 (/contact)</a>
      </div>
    </article>
  </div>
</div>`;
  } else if (section.path === 'artists') {
    const detailedActorsHtml = OFFICIAL_STATIC_ACTORS.map(actor => {
      const artistData = STATIC_OFFICIAL_ARTISTS.find(a => a.id === actor.slug || a.nameKo === actor.nameKo);
      const topWorks = artistData?.filmography?.slice(0, 3).map(w => `${w.year} 《${w.title}》`).join(', ') || '';
      return `
        <div class="p-4 bg-[#161A26] border border-white/10 rounded flex flex-col sm:flex-row gap-4 items-start">
          <a href="/artists/${actor.slug}" class="w-24 aspect-[3/4] shrink-0 overflow-hidden rounded border border-white/10 bg-black/40 block">
            <img src="${actor.image}" alt="${actor.alt}" class="w-full h-full object-cover" />
          </a>
          <div class="space-y-1.5 flex-1">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-white">
                <a href="/artists/${actor.slug}" class="hover:text-sky-400 transition-colors">${actor.nameKo}</a>
              </h3>
              <span class="text-xs font-mono text-sky-400">${actor.nameEn}</span>
            </div>
            <p class="text-xs text-gray-400 font-mono">
              소속: TK MANAGEMENT · ${artistData?.birth || '-'} · ${artistData?.height ? `${artistData.height}cm` : '-'}
            </p>
            <p class="text-xs text-gray-300 leading-relaxed">${actor.description}</p>
            ${topWorks ? `<p class="text-[11px] text-gray-400 font-mono">주요 출연작: ${topWorks}</p>` : ''}
            <div class="pt-1">
              <a href="/artists/${actor.slug}" class="text-xs font-mono text-sky-400 hover:underline">${actor.nameKo} 배우 공식 프로필 보기 →</a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-4xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-4xl bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg text-left shadow-2xl space-y-6">
      <header class="border-b border-white/10 pb-6">
        <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-1">${section.subtitle}</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">${section.h1}</h1>
        <p class="text-sm text-gray-300 leading-relaxed">${section.description}</p>
      </header>
      <section class="space-y-4">
        <h2 class="text-base font-bold text-white">TK MANAGEMENT 공식 소속 배우 (4인)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${detailedActorsHtml}
        </div>
      </section>
      <div class="pt-6 border-t border-white/10 flex flex-wrap justify-center gap-4 text-xs font-mono">
        <a href="/" class="text-sky-400 hover:underline">홈으로 이동</a>
        <span class="text-gray-600">|</span>
        <a href="/management" class="text-sky-400 hover:underline">배우 매니지먼트</a>
        <span class="text-gray-600">|</span>
        <a href="/actor-agency" class="text-sky-400 hover:underline">배우 소속사</a>
        <span class="text-gray-600">|</span>
        <a href="/actor-management-company" class="text-sky-400 hover:underline">배우 기획사</a>
        <span class="text-gray-600">|</span>
        <a href="/audition" class="text-sky-400 hover:underline">신인배우 오디션</a>
        <span class="text-gray-600">|</span>
        <a href="/contact" class="text-sky-400 hover:underline">배우 캐스팅 문의</a>
      </div>
    </article>
  </div>
</div>`;
  } else if (section.path === 'about') {
    sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-4xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-4xl bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg text-left shadow-2xl space-y-8">
      <header class="border-b border-white/10 pb-6">
        <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-2">COMPANY OVERVIEW</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">${section.h1}</h1>
        <p class="text-xs font-mono tracking-widest text-gray-400 uppercase mb-3">ABOUT TK MANAGEMENT · 배우 매니지먼트</p>
        <p class="text-sm text-gray-300 leading-relaxed">${section.description}</p>
      </header>

      <section class="space-y-3">
        <h2 class="text-lg font-bold text-white">배우의 가능성을 작품으로 연결하는 매니지먼트 파트너</h2>
        <p class="text-sm text-gray-300 leading-relaxed">
          TK매니지먼트(㈜TK Company)는 배우 매니지먼트와 캐스팅, 신인배우 발굴 및 육성을 전문으로 하는 엔터테인먼트 매니지먼트 기업입니다. 소속 배우가 안정적인 환경에서 연기에 집중하고 드라마, 영화, OTT, 연극, 광고 등 다양한 매체에서 역량을 발휘할 수 있도록 체계적인 매니지먼트 시스템을 운영합니다.
        </p>
      </section>

      <section class="space-y-4">
        <h2 class="text-lg font-bold text-white">핵심 매니지먼트 사업 영역</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div class="bg-[#161A26] p-4 border border-white/5">
            <span class="font-mono text-sky-400 block mb-1">01 / MANAGEMENT</span>
            <h3 class="text-sm font-bold text-white mb-1">배우 매니지먼트</h3>
            <p class="text-gray-300">소속 배우의 장기적인 커리어 로드맵을 설계하고, 오디션부터 작품 계약, 촬영 현장 지원까지 전 과정을 전담 관리합니다.</p>
          </div>
          <div class="bg-[#161A26] p-4 border border-white/5">
            <span class="font-mono text-sky-400 block mb-1">02 / CASTING</span>
            <h3 class="text-sm font-bold text-white mb-1">작품 및 캐스팅 지원</h3>
            <p class="text-gray-300">드라마, 영화, OTT, 광고 제작사 및 캐스팅 디렉터와의 긴밀한 협업을 통해 배역에 부합하는 배우 캐스팅을 진행합니다.</p>
          </div>
          <div class="bg-[#161A26] p-4 border border-white/5">
            <span class="font-mono text-sky-400 block mb-1">03 / AUDITION</span>
            <h3 class="text-sm font-bold text-white mb-1">신인배우 오디션 및 발굴</h3>
            <p class="text-gray-300">잠재력과 연기 열정을 지닌 신인배우를 상시 오디션으로 발굴하고, 실전 중심의 트레이닝과 현장 경험을 지원합니다.</p>
          </div>
          <div class="bg-[#161A26] p-4 border border-white/5">
            <span class="font-mono text-sky-400 block mb-1">04 / BRANDING</span>
            <h3 class="text-sm font-bold text-white mb-1">콘텐츠 및 배우 브랜딩</h3>
            <p class="text-gray-300">배우 고유의 이미지와 연기 스펙트럼을 체계적으로 아카이빙하여 공식 프로필, 쇼릴, 미디어 홍보를 통합 운영합니다.</p>
          </div>
        </div>
      </section>

      <section class="space-y-3 border-t border-white/10 pt-6">
        <h2 class="text-base font-bold text-white">기업 기본 정보</h2>
        <div class="bg-[#161A26] p-4 border border-white/5 rounded text-xs space-y-1.5 font-mono text-gray-300">
          <div>• 회사명: ㈜TK Company (티케이컴퍼니)</div>
          <div>• 브랜드명: TK매니지먼트 (TK MANAGEMENT)</div>
          <div>• 사업자등록번호: 291-88-03353</div>
          <div>• 대중문화예술기획업 등록: 제2025-서울강남-0418호(등록대기중)</div>
          <div>• 주소: 서울특별시 마포구 마포나루길 442, 마포인트 3층</div>
          <div>• 공식 이메일: taz0206@naver.com</div>
        </div>
      </section>

      <section class="space-y-3 border-t border-white/10 pt-6">
        <h2 class="text-base font-bold text-white">공식 소속 배우</h2>
        ${officialActorLinksHtml}
      </section>

      <div class="pt-6 border-t border-white/10 flex flex-wrap justify-center gap-4 text-xs font-mono">
        <a href="/" class="text-sky-400 hover:underline">홈으로 이동</a>
        <span class="text-gray-600">|</span>
        <a href="/management" class="text-sky-400 hover:underline">배우 매니지먼트</a>
        <span class="text-gray-600">|</span>
        <a href="/actor-agency" class="text-sky-400 hover:underline">배우 소속사</a>
        <span class="text-gray-600">|</span>
        <a href="/actor-management-company" class="text-sky-400 hover:underline">배우 기획사</a>
        <span class="text-gray-600">|</span>
        <a href="/artists" class="text-sky-400 hover:underline">소속 배우</a>
        <span class="text-gray-600">|</span>
        <a href="/audition" class="text-sky-400 hover:underline">신인배우 오디션</a>
        <span class="text-gray-600">|</span>
        <a href="/contact" class="text-sky-400 hover:underline">문의하기</a>
      </div>
    </article>
  </div>
</div>`;
  } else if (section.path === 'news') {
    const newsItemsHtml = NEWS_ARTICLES.map(article => `
      <div class="p-4 bg-[#161A26] border border-white/10 rounded space-y-2">
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="text-sky-400 font-bold uppercase">${article.category}</span>
          <span class="text-gray-400">${article.date}</span>
        </div>
        <h3 class="text-base font-bold text-white">${article.title}</h3>
        <p class="text-xs text-gray-300 leading-relaxed">${article.summary}</p>
      </div>
    `).join('');

    sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-4xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-4xl bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg text-left shadow-2xl space-y-8">
      <header class="border-b border-white/10 pb-6">
        <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-2">PRESS &amp; UPDATES</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">${section.h1}</h1>
        <p class="text-sm text-gray-300 leading-relaxed">${section.description}</p>
      </header>

      <section class="space-y-4">
        <h2 class="text-base font-bold text-white">최신 캐스팅 및 활동 소식</h2>
        <div class="space-y-3">
          ${newsItemsHtml}
        </div>
      </section>

      <section class="space-y-3 border-t border-white/10 pt-6">
        <h2 class="text-base font-bold text-white">TK매니지먼트 소속 배우 프로필</h2>
        ${officialActorLinksHtml}
      </section>

      <div class="pt-6 border-t border-white/10 flex flex-wrap justify-center gap-4 text-xs font-mono">
        <a href="/" class="text-sky-400 hover:underline">홈으로 이동</a>
        <span class="text-gray-600">|</span>
        <a href="/artists" class="text-sky-400 hover:underline">소속 배우 보기</a>
        <span class="text-gray-600">|</span>
        <a href="/management" class="text-sky-400 hover:underline">배우 매니지먼트</a>
        <span class="text-gray-600">|</span>
        <a href="/audition" class="text-sky-400 hover:underline">신인배우 오디션</a>
        <span class="text-gray-600">|</span>
        <a href="/contact" class="text-sky-400 hover:underline">캐스팅 문의</a>
      </div>
    </article>
  </div>
</div>`;
  } else if (section.path === 'contact') {
    sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-4xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-4xl bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg text-left shadow-2xl space-y-8">
      <header class="border-b border-white/10 pb-6">
        <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-2">GET IN TOUCH</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">${section.h1}</h1>
        <p class="text-sm text-gray-300 leading-relaxed">${section.description}</p>
      </header>

      <section class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
        <div class="bg-[#161A26] p-4 border border-white/5">
          <h2 class="text-sky-400 font-mono uppercase font-bold mb-1">COMPANY (회사명)</h2>
          <p class="text-white">㈜TK Company (티케이컴퍼니) · TK MANAGEMENT</p>
        </div>
        <div class="bg-[#161A26] p-4 border border-white/5">
          <h2 class="text-sky-400 font-mono uppercase font-bold mb-1">ADDRESS (본사 위치)</h2>
          <p class="text-white">서울특별시 마포구 마포나루길 442, 마포인트 3층</p>
        </div>
        <div class="bg-[#161A26] p-4 border border-white/5">
          <h2 class="text-sky-400 font-mono uppercase font-bold mb-1">EMAIL (공식 이메일)</h2>
          <p class="text-white font-mono">taz0206@naver.com</p>
        </div>
        <div class="bg-[#161A26] p-4 border border-white/5">
          <h2 class="text-sky-400 font-mono uppercase font-bold mb-1">REGISTRATION (사업자 정보)</h2>
          <p class="text-white font-mono">291-88-03353 · 제2025-서울강남-0418호(등록대기중)</p>
        </div>
      </section>

      <section class="space-y-3 border-t border-white/10 pt-6">
        <h2 class="text-base font-bold text-white">소속 배우 캐스팅 및 비즈니스 문의</h2>
        <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
          드라마, 영화, OTT 시리즈, 광고, 공연 등 TK매니지먼트 소속 배우(최은서, 이은수, 박민욱, 박현진)에 대한 캐스팅 제안과 비즈니스 협업 문의는 온라인 문의 양식 또는 공식 이메일을 통해 접수해 주시기 바랍니다.
        </p>
        ${officialActorLinksHtml}
      </section>

      <div class="pt-6 border-t border-white/10 flex flex-wrap justify-center gap-4 text-xs font-mono">
        <a href="/" class="text-sky-400 hover:underline">홈으로 이동</a>
        <span class="text-gray-600">|</span>
        <a href="/artists" class="text-sky-400 hover:underline">소속 배우 보기</a>
        <span class="text-gray-600">|</span>
        <a href="/management" class="text-sky-400 hover:underline">배우 매니지먼트</a>
        <span class="text-gray-600">|</span>
        <a href="/audition" class="text-sky-400 hover:underline">신인배우 오디션 지원</a>
      </div>
    </article>
  </div>
</div>`;
  } else if (section.path === 'audition') {
    sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-3xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-3xl bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg text-left shadow-2xl space-y-6">
      <div class="text-center border-b border-white/10 pb-6">
        <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-1">AUDITION RECRUITMENT</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">TK매니지먼트 신인배우 오디션</h1>
        <p class="text-sm font-mono text-gray-400 uppercase mb-3 tracking-widest">${section.subtitle}</p>
        <p class="text-sm text-gray-300 leading-relaxed max-w-xl mx-auto">${section.description}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
        <div class="bg-[#161A26] p-4 border border-white/5">
          <strong class="text-sky-400 block mb-1 uppercase font-mono">01. 모집 분야</strong>
          <p class="text-gray-300">드라마, 영화, OTT 오리지널 시리즈, 연극, 광고 등 연기 활동 전반. 전문 배우 매니지먼트로서 스크린과 브라운관 전 분야에 걸친 캐스팅과 작품 활동을 지원합니다.</p>
        </div>
        <div class="bg-[#161A26] p-4 border border-white/5">
          <strong class="text-sky-400 block mb-1 uppercase font-mono">02. 지원 대상</strong>
          <p class="text-gray-300">연기에 대한 진정성과 열정, 고유한 개성을 지닌 신인배우 및 배우 지망생 (성별·연령 제한 없음, 신인 및 기성 배우 모두 가능).</p>
        </div>
        <div class="bg-[#161A26] p-4 border border-white/5">
          <strong class="text-sky-400 block mb-1 uppercase font-mono">03. 지원 방법</strong>
          <p class="text-gray-300">온라인 오디션 지원서 양식을 통해 상시 접수합니다. 24시간 언제나 온라인으로 간편하게 신인배우 오디션에 지원하실 수 있습니다.</p>
        </div>
        <div class="bg-[#161A26] p-4 border border-white/5">
          <strong class="text-sky-400 block mb-1 uppercase font-mono">04. 제출 자료</strong>
          <p class="text-gray-300">기본 인적사항, 프로필 사진(클로즈업/전신), 자기소개 및 배우로서의 포부, 연기 영상 또는 쇼릴 링크(선택).</p>
        </div>
        <div class="bg-[#161A26] p-4 border border-white/5">
          <strong class="text-sky-400 block mb-1 uppercase font-mono">05. 오디션 진행 과정</strong>
          <p class="text-gray-300">1차 온라인 서류 심사 → 2차 실물 카메라 오디션 &amp; 심층 심사 → 최종 미팅 및 전속 매니지먼트 계약 체결.</p>
        </div>
        <div class="bg-[#161A26] p-4 border border-white/5">
          <strong class="text-sky-400 block mb-1 uppercase font-mono">06. 심사 및 문의</strong>
          <p class="text-gray-300">합격자에 한하여 개별 안내드립니다. 배우 캐스팅 문의 및 오디션 접수 상담은 공식 CONTACT 페이지를 통해 가능합니다.</p>
        </div>
      </div>

      <div class="pt-6 border-t border-white/10">
        <span class="text-xs font-mono text-gray-400 uppercase block mb-3 text-center">관련 페이지 바로가기</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-mono">
          <a href="/artists" class="p-3 bg-[#161A26] text-sky-400 hover:text-white border border-white/5 transition-colors">TK매니지먼트 소속 배우</a>
          <a href="/contact" class="p-3 bg-[#161A26] text-sky-400 hover:text-white border border-white/5 transition-colors">배우 캐스팅 및 매니지먼트 문의</a>
          <a href="/news" class="p-3 bg-[#161A26] text-sky-400 hover:text-white border border-white/5 transition-colors">TK매니지먼트 NEWS</a>
        </div>
      </div>
    </article>
  </div>
</div>`;
  } else if (section.path === 'terms') {
    sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-4xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-4xl bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg text-left shadow-2xl space-y-6">
      <div class="border-b border-white/10 pb-6">
        <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-1">TERMS OF SERVICE</span>
        <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">TK MANAGEMENT 이용약관</h1>
        <p class="text-xs text-gray-400 font-mono">시행일자: 2026년 9월 30일</p>
      </div>
      <div class="text-xs sm:text-sm text-gray-300 space-y-4 leading-relaxed">
        <p>${section.description}</p>
        <p>본 약관은 회사가 운영하는 공식 사이트(https://www.tkm.kr/)에서 제공하는 정보 및 관련 서비스의 이용에 관한 권리와 의무, 오디션 및 문의 서비스 이용 기준을 규정합니다.</p>
        <div class="bg-[#161A26] p-4 border border-white/5 rounded text-xs space-y-1 font-mono">
          <div>• 상호: ㈜TK Company (티케이컴퍼니)</div>
          <div>• 사업자등록번호: 291-88-03353</div>
          <div>• 대중문화예술기획업 등록: 제2025-서울강남-0418호(등록대기중)</div>
          <div>• 홈페이지: https://www.tkm.kr/</div>
        </div>
      </div>
      <div class="pt-6 border-t border-white/10 flex justify-center gap-4 text-xs font-mono">
        <a href="/" class="text-sky-400 hover:underline">홈으로 이동</a>
        <span class="text-gray-600">|</span>
        <a href="/privacy" class="text-sky-400 hover:underline">개인정보처리방침</a>
        <span class="text-gray-600">|</span>
        <a href="/contact" class="text-sky-400 hover:underline">문의하기</a>
      </div>
    </article>
  </div>
</div>`;
  } else if (section.path === 'privacy') {
    sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-4xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-4xl bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg text-left shadow-2xl space-y-6">
      <div class="border-b border-white/10 pb-6">
        <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-1">PRIVACY POLICY</span>
        <h1 class="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">TK MANAGEMENT 개인정보처리방침</h1>
        <p class="text-xs text-gray-400 font-mono">시행일자: 2026년 9월 30일</p>
      </div>
      <div class="text-xs sm:text-sm text-gray-300 space-y-4 leading-relaxed">
        <p>${section.description}</p>
        <p>TK MANAGEMENT는 이용자의 개인정보를 소중하게 보호하며, 「개인정보 보호법」 등 관련 법령을 철저히 준수합니다. 오디션 지원 및 문의 과정에서 수집된 정보는 명시된 목적 범위 내에서만 안전하게 처리됩니다.</p>
        <div class="bg-[#161A26] p-4 border border-white/5 rounded text-xs space-y-1 font-mono">
          <div>• 개인정보 보호 담당부서: TK MANAGEMENT 개인정보 보호 담당</div>
          <div>• 공식 이메일: taz0206@naver.com</div>
        </div>
      </div>
      <div class="pt-6 border-t border-white/10 flex justify-center gap-4 text-xs font-mono">
        <a href="/" class="text-sky-400 hover:underline">홈으로 이동</a>
        <span class="text-gray-600">|</span>
        <a href="/terms" class="text-sky-400 hover:underline">이용약관</a>
        <span class="text-gray-600">|</span>
        <a href="/contact" class="text-sky-400 hover:underline">문의하기</a>
      </div>
    </article>
  </div>
</div>`;
  } else {
    sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-3xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-3xl bg-[#111319] border border-white/10 p-6 sm:p-8 rounded-lg text-center shadow-2xl space-y-6">
      <div>
        <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-1">TK MANAGEMENT</span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">${section.h1}</h1>
        <p class="text-sm font-mono text-gray-400 uppercase mb-4 tracking-widest">${section.subtitle}</p>
        <p class="text-sm text-gray-300 leading-relaxed max-w-xl mx-auto">${section.description}</p>
      </div>
      ${officialActorLinksHtml}
      <div class="pt-4 border-t border-white/10 flex flex-wrap justify-center gap-4 text-xs font-mono">
        <a href="/" class="text-sky-400 hover:underline">홈으로 이동</a>
        <span class="text-gray-600">|</span>
        <a href="/management" class="text-sky-400 hover:underline">배우 매니지먼트</a>
        <span class="text-gray-600">|</span>
        <a href="/artists" class="text-sky-400 hover:underline">소속 배우 보기</a>
        <span class="text-gray-600">|</span>
        <a href="/audition" class="text-sky-400 hover:underline">신인배우 오디션</a>
        <span class="text-gray-600">|</span>
        <a href="/contact" class="text-sky-400 hover:underline">캐스팅 문의</a>
      </div>
    </article>
  </div>
</div>`;
  }

  html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, sectionRootHtml);

  return html;
}

/**
 * Main function that generates static HTML files into dist directory
 */
export function generateStaticPages(distDir: string): void {
  console.log(`[TK SEO] Starting static pages generation in: ${distDir}`);
  const indexPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.error(`[TK SEO ERROR] dist/index.html not found at: ${indexPath}`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf-8');

  // 1. Generate Static Actor Pages (4 official actors only)
  for (const actor of OFFICIAL_STATIC_ACTORS) {
    const actorDir = path.join(distDir, 'artists', actor.slug);
    if (!fs.existsSync(actorDir)) {
      fs.mkdirSync(actorDir, { recursive: true });
    }

    const actorHtml = buildActorHtml(baseHtml, actor);

    // Save as /artists/{slug}/index.html
    const actorIndexPath = path.join(actorDir, 'index.html');
    fs.writeFileSync(actorIndexPath, actorHtml, 'utf-8');

    // Save as /artists/{slug}.html as additional static fallback
    const actorHtmlPath = path.join(distDir, 'artists', `${actor.slug}.html`);
    fs.writeFileSync(actorHtmlPath, actorHtml, 'utf-8');

    console.log(`[TK SEO] Generated actor page: /artists/${actor.slug}/index.html (${actor.nameKo})`);
  }

  // 2. Generate Static Section Pages (artists, audition, news, contact, about)
  for (const section of STATIC_SECTIONS) {
    const sectionDir = path.join(distDir, section.path);
    if (!fs.existsSync(sectionDir)) {
      fs.mkdirSync(sectionDir, { recursive: true });
    }

    const sectionHtml = buildSectionHtml(baseHtml, section);

    // Save as /{path}/index.html
    const sectionIndexPath = path.join(sectionDir, 'index.html');
    fs.writeFileSync(sectionIndexPath, sectionHtml, 'utf-8');

    // Save as /{path}.html as additional static fallback
    const sectionHtmlPath = path.join(distDir, `${section.path}.html`);
    fs.writeFileSync(sectionHtmlPath, sectionHtml, 'utf-8');

    console.log(`[TK SEO] Generated section page: /${section.path}/index.html`);
  }

  console.log('[TK SEO] Successfully generated all static pre-rendered pages!');
}

// Execute if run directly from command line
if (process.argv[1] && (process.argv[1].endsWith('generate-static-pages.ts') || process.argv[1].endsWith('generate-static-pages.js'))) {
  const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(process.cwd(), 'dist');
  generateStaticPages(targetDir);
}
