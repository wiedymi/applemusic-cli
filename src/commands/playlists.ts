/**
 * @fileoverview Playlist management commands for Apple Music.
 * @module commands/playlists
 */

import { osascript, osascriptList } from "../osascript";
import { parseArgs, getLimit, getOffset } from "../args";
import { paginate, printPaginationHint } from "../pagination";

/**
 * Track information returned from playlist queries.
 */
interface Track {
  name: string;
  artist: string;
}

/**
 * Lists all playlists in the Apple Music library.
 * Supports pagination via --limit and --offset flags.
 *
 * @param args - Command arguments (supports --limit, --offset)
 */
export async function playlists(args: string[]): Promise<void> {
  const { flags } = parseArgs(args);
  const limit = getLimit(flags);
  const offset = getOffset(flags);

  const names = await osascriptList('tell application "Music" to get name of every playlist');
  const page = paginate(names, limit, offset);

  console.log(`📋 Playlists (${page.showing}):`);
  page.items.forEach((name, i) => console.log(`   ${offset + i + 1}. ${name}`));
  printPaginationHint(page);
}

/**
 * Plays a playlist by name.
 *
 * @param args - Command arguments. Positional args are joined to form the playlist name.
 *
 * @example
 * ```ts
 * // Play "My Playlist"
 * await playlist(['My', 'Playlist']);
 * ```
 */
export async function playlist(args: string[]): Promise<void> {
  const { positional } = parseArgs(args);
  const name = positional.join(' ');

  if (!name) {
    console.log("Usage: am playlist <name>");
    return;
  }
  try {
    await osascript(`tell application "Music" to play playlist "${name}"`);
    console.log(`▶ Playing playlist: ${name}`);
  } catch {
    console.log(`Playlist "${name}" not found`);
  }
}

/**
 * Lists tracks in a playlist or the current playlist.
 * Supports pagination via --limit and --offset flags.
 *
 * @param args - Command arguments. Positional args form the playlist name.
 *               If no name provided, lists tracks from current playlist.
 */
export async function tracks(args: string[]): Promise<void> {
  const { flags, positional } = parseArgs(args);
  const limit = getLimit(flags);
  const offset = getOffset(flags);
  const playlistName = positional.join(' ');

  const target = playlistName
    ? `playlist "${playlistName}"`
    : 'current playlist';

  try {
    const names = await osascriptList(`tell application "Music" to get name of every track of ${target}`);
    const artists = await osascriptList(`tell application "Music" to get artist of every track of ${target}`);

    const trackList: Track[] = names.map((name, i) => ({
      name,
      artist: artists[i] || 'Unknown',
    }));
    const page = paginate(trackList, limit, offset);

    console.log(`🎶 Tracks in ${playlistName || 'current playlist'} (${page.showing}):`);
    page.items.forEach((t, i) => {
      console.log(`   ${offset + i + 1}. ${t.name} - ${t.artist}`);
    });
    printPaginationHint(page);
  } catch {
    console.log(`Could not get tracks`);
  }
}
