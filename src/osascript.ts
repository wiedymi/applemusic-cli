/**
 * @fileoverview AppleScript execution helpers for communicating with Apple Music.
 * @module osascript
 */

const $ = Bun.$;

/**
 * Executes an AppleScript command and returns the result as a string.
 *
 * @param script - The AppleScript code to execute
 * @returns The trimmed output from the script execution
 * @throws Will throw if the AppleScript execution fails
 *
 * @example
 * ```ts
 * const trackName = await osascript('tell application "Music" to get name of current track');
 * ```
 */
export async function osascript(script: string): Promise<string> {
  const result = await $`osascript -e ${script}`.text();
  return result.trim();
}

/**
 * Executes an AppleScript command that returns a list and parses it into an array.
 * AppleScript returns lists as comma-separated strings, which this function splits.
 *
 * @param script - The AppleScript code to execute (should return a list)
 * @returns An array of strings parsed from the AppleScript list output
 *
 * @example
 * ```ts
 * const playlists = await osascriptList('tell application "Music" to get name of every playlist');
 * // Returns: ["Library", "Music", "My Playlist", ...]
 * ```
 */
export async function osascriptList(script: string): Promise<string[]> {
  const result = await osascript(script);
  if (!result) return [];
  return result.split(", ").map(s => s.trim()).filter(Boolean);
}
