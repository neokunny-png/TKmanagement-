import { Artist } from '../types';

/**
 * TK MANAGEMENT — ARTISTS INITIAL STATE
 * Initial state is strictly 0 artists ([]).
 * Artists are solely registered, modified, and managed via the Admin panel in Firestore.
 */
export const ARTISTS: Artist[] = [];

/**
 * Helper to retrieve actor image or null.
 * Strictly no fallback to AI or external stock images.
 */
export function getOfficialActorImage(artist?: Artist | null): string | null {
  if (!artist) return null;
  return artist.profileImageUrl || artist.image || artist.profileImage || null;
}
