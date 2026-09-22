import fs from 'fs';
import path from 'path';

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
    title: '최은서 배우 | TK매니지먼트',
    description: '최은서 배우의 프로필과 활동 정보를 확인하세요. TK매니지먼트 소속 배우 최은서의 공식 프로필 페이지입니다.',
    canonical: 'https://www.tkm.kr/artists/choi-eunseo',
    image: 'https://www.tkm.kr/images/actors/choi-eunseo-v5-8fe5a05d.jpg',
    alt: 'TK매니지먼트 소속 배우 최은서 프로필',
    gender: 'Female',
  },
  {
    slug: 'lee-eunsoo',
    nameKo: '이은수',
    nameEn: 'LEE EUN SOO',
    title: '이은수 배우 | TK매니지먼트',
    description: '이은수 배우의 프로필과 활동 정보를 확인하세요. TK매니지먼트 소속 배우 이은수의 공식 프로필 페이지입니다.',
    canonical: 'https://www.tkm.kr/artists/lee-eunsoo',
    image: 'https://www.tkm.kr/images/actors/lee-eunsoo-v5-26e9ac09.jpg',
    alt: 'TK매니지먼트 소속 배우 이은수 프로필',
    gender: 'Female',
  },
  {
    slug: 'park-minwook',
    nameKo: '박민욱',
    nameEn: 'PARK MIN WOOK',
    title: '박민욱 배우 | TK매니지먼트',
    description: '박민욱 배우의 프로필과 활동 정보를 확인하세요. TK매니지먼트 소속 배우 박민욱의 공식 프로필 페이지입니다.',
    canonical: 'https://www.tkm.kr/artists/park-minwook',
    image: 'https://www.tkm.kr/images/actors/park-minwook-v5-973012cc.jpg',
    alt: 'TK매니지먼트 소속 배우 박민욱 프로필',
    gender: 'Male',
  },
  {
    slug: 'park-hyunjin',
    nameKo: '박현진',
    nameEn: 'PARK HYUN JIN',
    title: '박현진 배우 | TK매니지먼트',
    description: '박현진 배우의 프로필과 활동 정보를 확인하세요. TK매니지먼트 소속 배우 박현진의 공식 프로필 페이지입니다.',
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
    path: 'artists',
    title: '소속 배우 | TK매니지먼트',
    description: 'TK매니지먼트 소속 배우들의 프로필과 경력, 활동 정보를 확인하세요.',
    canonical: 'https://www.tkm.kr/artists',
    ogTitle: '소속 배우 | TK매니지먼트',
    ogDescription: 'TK매니지먼트 소속 배우들의 프로필과 경력, 활동 정보를 확인하세요.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK매니지먼트 소속 배우',
    h1: '소속 배우',
    subtitle: 'TK MANAGEMENT ARTISTS',
    breadcrumbName: '소속 배우',
  },
  {
    path: 'audition',
    title: '신인배우 오디션·배우 모집 | TK매니지먼트',
    description: 'TK매니지먼트 신인배우 모집 및 배우 오디션 안내. 새로운 가능성을 가진 배우들의 지원을 기다립니다.',
    canonical: 'https://www.tkm.kr/audition',
    ogTitle: '신인배우 오디션·배우 모집 | TK매니지먼트',
    ogDescription: 'TK매니지먼트 신인배우 모집 및 배우 오디션 안내. 새로운 가능성을 가진 배우들의 지원을 기다립니다.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK매니지먼트 신인배우 오디션',
    h1: '신인배우 오디션',
    subtitle: 'AUDITION & CASTING',
    breadcrumbName: '오디션',
  },
  {
    path: 'news',
    title: 'TK매니지먼트 뉴스 | 배우·매니지먼트 소식',
    description: 'TK매니지먼트의 배우 활동 및 매니지먼트 관련 최신 소식을 확인하세요.',
    canonical: 'https://www.tkm.kr/news',
    ogTitle: 'TK매니지먼트 뉴스 | 배우·매니지먼트 소식',
    ogDescription: 'TK매니지먼트의 배우 활동 및 매니지먼트 관련 최신 소식을 확인하세요.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK매니지먼트 뉴스',
    h1: '뉴스',
    subtitle: 'PRESS & UPDATES',
    breadcrumbName: '뉴스',
  },
  {
    path: 'contact',
    title: '문의 | TK매니지먼트',
    description: 'TK매니지먼트의 매니지먼트, 캐스팅, 오디션 및 기타 문의 방법을 확인하세요.',
    canonical: 'https://www.tkm.kr/contact',
    ogTitle: '문의 | TK매니지먼트',
    ogDescription: 'TK매니지먼트의 매니지먼트, 캐스팅, 오디션 및 기타 문의 방법을 확인하세요.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK매니지먼트 문의',
    h1: '문의',
    subtitle: 'CONTACT & LOCATION',
    breadcrumbName: '문의',
  },
  {
    path: 'about',
    title: 'TK매니지먼트 소개 | YOUR NEXT SCENE',
    description: '새로운 얼굴을 발견하고, 배우의 다음 장면을 만들어가는 프리미엄 액터스 매니지먼트 TK MANAGEMENT.',
    canonical: 'https://www.tkm.kr/about',
    ogTitle: 'TK매니지먼트 소개 | YOUR NEXT SCENE',
    ogDescription: '새로운 얼굴을 발견하고, 배우의 다음 장면을 만들어가는 프리미엄 액터스 매니지먼트 TK MANAGEMENT.',
    ogImage: 'https://www.tkm.kr/images/about/about-main.jpg',
    ogImageAlt: 'TK매니지먼트 소개',
    h1: 'TK매니지먼트 소개',
    subtitle: 'ABOUT TK MANAGEMENT',
    breadcrumbName: '회사 소개',
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
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${actor.canonical}#person`,
        "name": actor.nameKo,
        "alternateName": actor.nameEn,
        "url": actor.canonical,
        "image": actor.image,
        "jobTitle": "배우 (Actor)",
        "worksFor": {
          "@type": "Organization",
          "@id": "https://www.tkm.kr/#organization",
          "name": "TK매니지먼트",
          "url": "https://www.tkm.kr/"
        }
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

  // 7. Inject meaningful pre-rendered HTML with strict H1 and alt text inside #root
  const actorRootHtml = `<div id="root">
  <div class="tk-actor-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-2xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <a href="/artists" class="hover:text-white transition-colors">소속 배우</a> &gt; <span class="text-white">${actor.nameKo}</span>
    </nav>
    <article class="w-full max-w-2xl bg-[#111319] border border-white/10 p-6 sm:p-8 rounded-lg text-center shadow-2xl">
      <div class="aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded mb-6 border border-white/10 bg-black/40">
        <img src="${actor.image}" alt="${actor.alt}" class="w-full h-full object-cover" />
      </div>
      <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-1">TK MANAGEMENT ACTOR</span>
      <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">${actor.nameKo}</h1>
      <p class="text-sm font-mono text-gray-400 uppercase mb-4 tracking-widest">${actor.nameEn}</p>
      <p class="text-sm text-gray-300 leading-relaxed max-w-lg mx-auto mb-6">${actor.description}</p>
      <div class="pt-4 border-t border-white/10 flex justify-center gap-4 text-xs font-mono">
        <a href="/artists" class="text-sky-400 hover:underline">소속 배우 목록</a>
        <span class="text-gray-600">|</span>
        <a href="/contact" class="text-sky-400 hover:underline">캐스팅 및 비즈니스 문의</a>
      </div>
    </article>
  </div>
</div>`;

  html = html.replace(/<div id="root"><\/div>/i, actorRootHtml);

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

  // 6. Inject Schema.org BreadcrumbList
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
  };

  const jsonLdString = `\n    <!-- Section Schema.org JSON-LD (Pre-rendered) -->\n    <script type="application/ld+json" id="section-jsonld">\n${JSON.stringify(jsonLdData, null, 2)}\n    </script>\n  </head>`;
  html = html.replace('</head>', jsonLdString);

  // 7. Pre-rendered section root
  const sectionRootHtml = `<div id="root">
  <div class="tk-section-seo-prerender bg-[#0B0C10] text-[#E5E7EB] min-h-screen py-16 px-4 flex flex-col items-center justify-center">
    <nav aria-label="Breadcrumb" class="w-full max-w-2xl mb-6 text-xs text-gray-400 font-mono">
      <a href="/" class="hover:text-white transition-colors">홈</a> &gt; <span class="text-white">${section.breadcrumbName}</span>
    </nav>
    <article class="w-full max-w-2xl bg-[#111319] border border-white/10 p-6 sm:p-8 rounded-lg text-center shadow-2xl">
      <span class="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-1">TK MANAGEMENT</span>
      <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">${section.h1}</h1>
      <p class="text-sm font-mono text-gray-400 uppercase mb-4 tracking-widest">${section.subtitle}</p>
      <p class="text-sm text-gray-300 leading-relaxed max-w-lg mx-auto mb-6">${section.description}</p>
      <div class="pt-4 border-t border-white/10 flex justify-center gap-4 text-xs font-mono">
        <a href="/" class="text-sky-400 hover:underline">홈으로 이동</a>
        <span class="text-gray-600">|</span>
        <a href="/artists" class="text-sky-400 hover:underline">소속 배우 보기</a>
      </div>
    </article>
  </div>
</div>`;

  html = html.replace(/<div id="root"><\/div>/i, sectionRootHtml);

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
