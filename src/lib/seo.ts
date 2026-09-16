import { Artist } from '../types';

export const SITE_DOMAIN = 'https://www.tkm.kr';
export const DEFAULT_OG_IMAGE = 'https://www.tkm.kr/images/about/about-main.jpg';

export interface PageSEOConfig {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage?: string;
  breadcrumbName?: string;
}

export const SEO_PAGE_CONFIGS: Record<string, PageSEOConfig> = {
  home: {
    title: 'TK매니지먼트 | 배우 매니지먼트·신인배우 오디션',
    description: 'TK매니지먼트는 배우의 가능성과 개성을 바탕으로 함께 성장하는 배우 매니지먼트입니다. 소속 배우, 신인배우 오디션, 배우 캐스팅 및 매니지먼트 관련 정보를 확인하세요.',
    canonical: `${SITE_DOMAIN}/`,
    ogTitle: 'TK매니지먼트 | 배우 매니지먼트·신인배우 오디션',
    ogDescription: 'TK매니지먼트는 배우의 가능성과 개성을 바탕으로 함께 성장하는 배우 매니지먼트입니다. 소속 배우, 신인배우 오디션, 배우 캐스팅 및 매니지먼트 관련 정보를 확인하세요.',
    ogUrl: `${SITE_DOMAIN}/`,
    ogImage: DEFAULT_OG_IMAGE,
    breadcrumbName: '홈',
  },
  artists: {
    title: '소속 배우 | TK매니지먼트',
    description: 'TK매니지먼트 소속 배우들의 프로필과 경력, 활동 정보를 확인하세요.',
    canonical: `${SITE_DOMAIN}/artists`,
    ogTitle: '소속 배우 | TK매니지먼트',
    ogDescription: 'TK매니지먼트 소속 배우들의 프로필과 경력, 활동 정보를 확인하세요.',
    ogUrl: `${SITE_DOMAIN}/artists`,
    ogImage: DEFAULT_OG_IMAGE,
    breadcrumbName: '소속 배우',
  },
  audition: {
    title: '신인배우 오디션·배우 모집 | TK매니지먼트',
    description: 'TK매니지먼트 신인배우 모집 및 배우 오디션 안내. 새로운 가능성을 가진 배우들의 지원을 기다립니다.',
    canonical: `${SITE_DOMAIN}/audition`,
    ogTitle: '신인배우 오디션·배우 모집 | TK매니지먼트',
    ogDescription: 'TK매니지먼트 신인배우 모집 및 배우 오디션 안내. 새로운 가능성을 가진 배우들의 지원을 기다립니다.',
    ogUrl: `${SITE_DOMAIN}/audition`,
    ogImage: DEFAULT_OG_IMAGE,
    breadcrumbName: '신인배우 오디션',
  },
  news: {
    title: 'TK매니지먼트 뉴스 | 배우·매니지먼트 소식',
    description: 'TK매니지먼트의 배우 활동 및 매니지먼트 관련 최신 소식을 확인하세요.',
    canonical: `${SITE_DOMAIN}/news`,
    ogTitle: 'TK매니지먼트 뉴스 | 배우·매니지먼트 소식',
    ogDescription: 'TK매니지먼트의 배우 활동 및 매니지먼트 관련 최신 소식을 확인하세요.',
    ogUrl: `${SITE_DOMAIN}/news`,
    ogImage: DEFAULT_OG_IMAGE,
    breadcrumbName: '뉴스',
  },
  contact: {
    title: '문의 | TK매니지먼트',
    description: 'TK매니지먼트의 매니지먼트, 캐스팅, 오디션 및 기타 문의 방법을 확인하세요.',
    canonical: `${SITE_DOMAIN}/contact`,
    ogTitle: '문의 | TK매니지먼트',
    ogDescription: 'TK매니지먼트의 매니지먼트, 캐스팅, 오디션 및 기타 문의 방법을 확인하세요.',
    ogUrl: `${SITE_DOMAIN}/contact`,
    ogImage: DEFAULT_OG_IMAGE,
    breadcrumbName: '문의',
  },
  about: {
    title: 'TK매니지먼트 소개 | YOUR NEXT SCENE',
    description: '새로운 얼굴을 발견하고, 배우의 다음 장면을 만들어가는 프리미엄 액터스 매니지먼트 TK MANAGEMENT.',
    canonical: `${SITE_DOMAIN}/about`,
    ogTitle: 'TK매니지먼트 소개 | YOUR NEXT SCENE',
    ogDescription: '새로운 얼굴을 발견하고, 배우의 다음 장면을 만들어가는 프리미엄 액터스 매니지먼트 TK MANAGEMENT.',
    ogUrl: `${SITE_DOMAIN}/about`,
    ogImage: DEFAULT_OG_IMAGE,
    breadcrumbName: '회사 소개',
  },
};

/**
 * Returns canonical slug for URL path (e.g. 'artist-park-minwook' -> 'park-minwook')
 */
export function getArtistSlug(artist: Artist): string {
  const nameEnLower = (artist.nameEn || '').toLowerCase().trim();
  const nameKo = artist.nameKo || '';

  if (nameKo.includes('최은서') || nameEnLower.includes('eunseo')) {
    return 'choi-eunseo';
  }
  if (nameKo.includes('이은수') || nameEnLower.includes('eunsoo') || nameEnLower.includes('eunsu')) {
    return 'lee-eunsoo';
  }
  if (nameKo.includes('박민욱') || nameEnLower.includes('minwook') || nameKo.includes('박민준') || nameEnLower.includes('minjun')) {
    return 'park-minwook';
  }
  if (nameKo.includes('박현진') || nameEnLower.includes('hyunjin')) {
    return 'park-hyunjin';
  }

  // Fallback slug from english name or sanitized id
  if (artist.nameEn) {
    const slug = artist.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (slug) return slug;
  }
  return (artist.id || '').replace(/^artist-/, '');
}

/**
 * Maps a slug back to a canonical artist ID for lookup
 */
export function mapSlugToArtistId(slug: string): string {
  const s = (slug || '').toLowerCase().trim();
  if (s === 'choi-eunseo' || s === 'eunseo' || s.includes('최은서')) {
    return 'artist-choi-eunseo';
  }
  if (s === 'lee-eunsoo' || s === 'lee-eunsu' || s === 'eunsoo' || s === 'eunsu' || s.includes('이은수')) {
    return 'artist-lee-eunsoo';
  }
  if (s === 'park-minwook' || s === 'minwook' || s === 'park-minjun' || s === 'minjun' || s.includes('박민욱') || s.includes('박민준')) {
    return 'artist-park-minwook';
  }
  if (s === 'park-hyunjin' || s === 'hyunjin' || s.includes('박현진')) {
    return 'artist-park-hyunjin';
  }
  if (s.startsWith('artist-')) {
    return s;
  }
  return `artist-${s}`;
}

/**
 * Returns actor-specific SEO metadata
 */
export function getArtistSEOConfig(artist: Artist): PageSEOConfig {
  const slug = getArtistSlug(artist);
  const photoUrl = artist.profileImageUrl || artist.image || artist.profileImage || DEFAULT_OG_IMAGE;

  return {
    title: `${artist.nameKo} | TK매니지먼트`,
    description: `TK매니지먼트 소속 배우 ${artist.nameKo}(${artist.nameEn})의 프로필과 필모그래피, 활동 정보를 확인하세요.`,
    canonical: `${SITE_DOMAIN}/artists/${slug}`,
    ogTitle: `${artist.nameKo} | TK매니지먼트`,
    ogDescription: `TK매니지먼트 소속 배우 ${artist.nameKo}(${artist.nameEn})의 공식 프로필과 활동 정보.`,
    ogUrl: `${SITE_DOMAIN}/artists/${slug}`,
    ogImage: photoUrl,
    breadcrumbName: artist.nameKo,
  };
}

/**
 * Helper to dynamically update HTML meta tags and document.title
 */
function setOrCreateMeta(selector: string, attrName: string, attrValue: string, content: string) {
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setOrCreateCanonical(canonicalUrl: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', canonicalUrl);
}

/**
 * Dynamically injects or updates JSON-LD structured data for BreadcrumbList and Person
 */
function updateDynamicJsonLd(schema: object) {
  const scriptId = 'tk-dynamic-jsonld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema, null, 2);
}

/**
 * Applies full technical SEO for any view / artist selection
 */
export function applyPageSEO(view: string, artist?: Artist | null) {
  if (typeof document === 'undefined') return;

  let config: PageSEOConfig;
  let dynamicSchema: object | null = null;

  if (artist) {
    config = getArtistSEOConfig(artist);
    const slug = getArtistSlug(artist);
    const photoUrl = artist.profileImageUrl || artist.image || artist.profileImage || undefined;

    // Build Schema.org Person and BreadcrumbList for this actor
    dynamicSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": `${SITE_DOMAIN}/artists/${slug}#person`,
          "name": artist.nameKo,
          "alternateName": artist.nameEn || undefined,
          "jobTitle": "배우 (Actor)",
          "worksFor": {
            "@type": "Organization",
            "name": "TK매니지먼트",
            "url": `${SITE_DOMAIN}/`
          },
          "image": photoUrl,
          "gender": artist.gender === 'Female' ? 'https://schema.org/Female' : 'https://schema.org/Male',
          "birthDate": artist.birth ? artist.birth.replace(/\./g, '-') : undefined,
          "height": artist.height ? `${artist.height} cm` : undefined,
          "alumniOf": artist.education || undefined,
          "url": `${SITE_DOMAIN}/artists/${slug}`
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${SITE_DOMAIN}/artists/${slug}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "홈",
              "item": `${SITE_DOMAIN}/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "소속 배우",
              "item": `${SITE_DOMAIN}/artists`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": artist.nameKo,
              "item": `${SITE_DOMAIN}/artists/${slug}`
            }
          ]
        }
      ]
    };
  } else {
    config = SEO_PAGE_CONFIGS[view] || SEO_PAGE_CONFIGS.home;

    if (view && view !== 'home' && config.breadcrumbName) {
      dynamicSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "홈",
            "item": `${SITE_DOMAIN}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": config.breadcrumbName,
            "item": config.canonical
          }
        ]
      };
    } else {
      dynamicSchema = null;
    }
  }

  // 1. Update Title
  document.title = config.title;

  // 2. Update Meta Description
  setOrCreateMeta('meta[name="description"]', 'name', 'description', config.description);

  // 3. Update Canonical URL
  setOrCreateCanonical(config.canonical);

  // 4. Update OpenGraph Tags
  setOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', config.ogTitle);
  setOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', config.ogDescription);
  setOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', config.ogUrl);
  if (config.ogImage) {
    setOrCreateMeta('meta[property="og:image"]', 'property', 'og:image', config.ogImage);
  }

  // 5. Update Twitter Card Tags
  setOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', config.ogTitle);
  setOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', config.ogDescription);
  if (config.ogImage) {
    setOrCreateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', config.ogImage);
  }

  // 6. Update Dynamic JSON-LD structured data
  if (dynamicSchema) {
    updateDynamicJsonLd(dynamicSchema);
  } else {
    const existing = document.getElementById('tk-dynamic-jsonld');
    if (existing) existing.remove();
  }
}
