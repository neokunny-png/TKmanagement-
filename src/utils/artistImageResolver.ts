import { Artist } from '../types';
import { OFFICIAL_ACTOR_IMAGES, isOfficialSlug, getArtistSlug } from '../lib/seo';

/**
 * Validates whether an artist image URL is acceptable for production display.
 * Strictly rejects:
 * - null, undefined, empty strings
 * - data: (Base64)
 * - blob:
 * - placeholder, dummy, default, stock, foreign model placeholders
 */
export function isValidArtistImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Strictly forbidden patterns
  if (trimmed.startsWith('data:')) return false;
  if (trimmed.startsWith('blob:')) return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('placeholder') ||
    lower.includes('dummy') ||
    lower.includes('default') ||
    lower.includes('stock') ||
    lower.includes('model') ||
    lower.includes('unsplash') ||
    lower.includes('pexels')
  ) {
    return false;
  }

  // Must be absolute HTTPS/HTTP or relative root path
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/')
  );
}

/**
 * Retrieves the verified official static image for a given actor slug or ID.
 * Always resolves to the specific actor's own static asset.
 * NEVER returns another actor's image or artists[0].
 */
export function getOfficialActorStaticImage(slugOrId?: string | null): string {
  if (!slugOrId) return OFFICIAL_ACTOR_IMAGES['choi-eunseo'];
  const clean = slugOrId.replace(/^artist-/, '').toLowerCase().trim();
  if (clean in OFFICIAL_ACTOR_IMAGES) {
    return OFFICIAL_ACTOR_IMAGES[clean];
  }
  // Check common aliases and Korean variants
  if (clean.includes('choi') || clean.includes('eunseo') || clean.includes('최은서')) {
    return OFFICIAL_ACTOR_IMAGES['choi-eunseo'];
  }
  if (clean.includes('lee') || clean.includes('eunsoo') || clean.includes('eunsu') || clean.includes('이은수')) {
    return OFFICIAL_ACTOR_IMAGES['lee-eunsoo'];
  }
  if (clean.includes('minwook') || clean.includes('minjun') || clean.includes('박민욱') || clean.includes('박민준')) {
    return OFFICIAL_ACTOR_IMAGES['park-minwook'];
  }
  if (clean.includes('hyunjin') || clean.includes('박현진')) {
    return OFFICIAL_ACTOR_IMAGES['park-hyunjin'];
  }
  // Try partial match against official slugs
  for (const officialSlug of Object.keys(OFFICIAL_ACTOR_IMAGES)) {
    if (clean.includes(officialSlug)) {
      return OFFICIAL_ACTOR_IMAGES[officialSlug];
    }
  }
  return OFFICIAL_ACTOR_IMAGES['choi-eunseo'];
}

export interface ResolveArtistImageOptions {
  isInitialRender?: boolean;
}

/**
 * Unified canonical image resolver for artist representative images across the entire app.
 * Execution order:
 * 1. Frame 0 / Initial Render: Immediately use actor's official static image (zero network wait, zero FOUC)
 * 2. Firestore complete: If Firestore has a valid admin-registered URL (https://...), use it
 * 3. Fallback: If Firestore URL is missing, deleted, or invalid, fall back to actor's own official static image
 */
export function resolveArtistRepresentativeImage(
  artist: Partial<Artist> | null | undefined,
  options: ResolveArtistImageOptions = {}
): string {
  if (!artist) return OFFICIAL_ACTOR_IMAGES['choi-eunseo'];

  const slug = getArtistSlug(artist as Artist) || (artist.id ? artist.id.replace('artist-', '') : '').toLowerCase();
  const staticImage = getOfficialActorStaticImage(slug);

  // 1. Initial Frame 0 render always uses static official image
  if (options.isInitialRender === true) {
    return staticImage;
  }

  // 2. Check for valid admin Firestore image URL
  const firestoreImage = artist.profileImageUrl || artist.image || artist.profileImage;
  if (isValidArtistImageUrl(firestoreImage)) {
    return firestoreImage as string;
  }

  // 3. Fallback to actor's official static image
  return staticImage;
}
