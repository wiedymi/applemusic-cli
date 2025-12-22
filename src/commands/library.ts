/**
 * @fileoverview Library browsing and search commands for Apple Music.
 * @module commands/library
 */

import { osascript, osascriptList } from "../osascript";
import { parseArgs, getLimit, getOffset } from "../args";
import { paginate, printPaginationHint } from "../pagination";

/**
 * Song information returned from library queries.
 */
interface Song {
  name: string;
  artist: string;
}

/**
 * Lists all songs in the Apple Music library.
 * Supports pagination via --limit and --offset flags.
 * Default limit is 20.
 *
 * @param args - Command arguments (supports --limit, --offset)
 */
export async function songs(args: string[]): Promise<void> {
  const { flags } = parseArgs(args);
  const limit = getLimit(flags, 20);
  const offset = getOffset(flags);

  const names = await osascriptList('tell application "Music" to get name of every track of playlist "Library"');
  const artists = await osascriptList('tell application "Music" to get artist of every track of playlist "Library"');

  const allSongs: Song[] = names.map((name, i) => ({
    name,
    artist: artists[i] || 'Unknown',
  }));
  const page = paginate(allSongs, limit, offset);

  console.log(`🎵 Library (${page.showing}):`);
  page.items.forEach((s, i) => {
    console.log(`   ${offset + i + 1}. ${s.name} - ${s.artist}`);
  });
  printPaginationHint(page);
}

/**
 * Searches the Apple Music library for tracks matching a query.
 * Searches both track names and artist names.
 * Supports pagination via --limit and --offset flags.
 *
 * @param args - Command arguments. Positional args form the search query.
 *
 * @remarks
 * Only searches local/downloaded tracks. Streaming catalog is not searchable via AppleScript.
 */
export async function search(args: string[]): Promise<void> {
  const { flags, positional } = parseArgs(args);
  const query = positional.join(' ');
  const limit = getLimit(flags, 20);
  const offset = getOffset(flags);

  if (!query) {
    console.log("Usage: am search <query> [--limit N] [--offset N]");
    return;
  }

  const script = `
    tell application "Music"
      set results to (every track whose name contains "${query}" or artist contains "${query}")
      set output to {}
      repeat with t in results
        set end of output to (name of t) & " - " & (artist of t)
      end repeat
      return output
    end tell
  `;
  const results = await osascriptList(script);

  if (results.length === 0) {
    console.log(`No results for "${query}"`);
    return;
  }

  const page = paginate(results, limit, offset);

  console.log(`🔍 Results for "${query}" (${page.showing}):`);
  page.items.forEach((r, i) => console.log(`   ${offset + i + 1}. ${r}`));
  printPaginationHint(page);
}

/**
 * Plays the first song whose name contains the given query.
 *
 * @param args - Command arguments. Positional args form the song name to search for.
 *
 * @example
 * ```ts
 * // Play "Come As You Are"
 * await song(['Come', 'As', 'You', 'Are']);
 * ```
 */
export async function song(args: string[]): Promise<void> {
  const { positional } = parseArgs(args);
  const name = positional.join(' ');

  if (!name) {
    console.log("Usage: am song <name>");
    return;
  }
  try {
    await osascript(`tell application "Music" to play (first track whose name contains "${name}")`);
    console.log(`▶ Playing: ${name}`);
  } catch {
    console.log(`Song "${name}" not found`);
  }
}
