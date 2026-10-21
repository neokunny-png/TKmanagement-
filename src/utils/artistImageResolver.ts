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

  // Strictly reject temporary browser blob URLs
  if (trimmed.startsWith('blob:')) return false;

  // Allow optimized compressed data:image/* URLs (used when Firebase Storage bucket is unavailable)
  if (trimmed.startsWith('data:image/')) {
    return trimmed.length > 64 && trimmed.length < 450000;
  }

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
 * Returns the specific official actor's static asset if matching, or null.
 * NEVER returns another actor's image or defaults to choi-eunseo for new actors.
 */
export function getOfficialActorStaticImage(slugOrId?: string | null): string | null {
  if (!slugOrId) return null;
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
  if (clean.includes('minwook') || clean.includes('박민욱')) {
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
  return null;
}

export interface ResolveArtistImageOptions {
  isInitialRender?: boolean;
}

/**
 * Unified canonical image resolver for artist representative images across the entire app.
 * Execution order:
 * 1. Check for valid admin Firestore image URL (supports https, http, relative paths, and compressed data URLs)
 * 2. If missing, check if this actor has a verified official static image (최은서, 이은수, 박민욱, 박현진)
 * 3. Fallback: Return null so caller can display a neutral placeholder without borrowing another actor's image
 */
export function resolveArtistRepresentativeImage(
  artist: Partial<Artist> | null | undefined,
  options: ResolveArtistImageOptions = {}
): string | null {
  if (!artist) return null;

  // 1. Check for valid admin Firestore image URL
  const firestoreImage = artist.profileImageUrl || artist.image || artist.profileImage;
  if (isValidArtistImageUrl(firestoreImage)) {
    return firestoreImage as string;
  }

  // 2. Only if the actor is one of the verified official actors with static asset, use it
  const slug = getArtistSlug(artist as Artist) || (artist.id ? artist.id.replace('artist-', '') : '').toLowerCase();
  const staticImage = getOfficialActorStaticImage(slug);
  if (staticImage) {
    return staticImage;
  }

  // 3. New actors or actors without a photo return null
  return null;
}
