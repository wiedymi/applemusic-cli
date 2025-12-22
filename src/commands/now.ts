/**
 * @fileoverview Now playing command - displays current track information.
 * @module commands/now
 */

import { osascript } from "../osascript";

/**
 * Formats seconds into a MM:SS time string.
 *
 * @param seconds - Total seconds to format
 * @returns Formatted time string (e.g., "3:45")
 */
function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
}

/**
 * Displays information about the currently playing track.
 * Shows track name, artist, album, and playback position.
 */
export async function now(): Promise<void> {
  try {
    const name = await osascript('tell application "Music" to get name of current track');
    const artist = await osascript('tell application "Music" to get artist of current track');
    const album = await osascript('tell application "Music" to get album of current track');
    const position = await osascript('tell application "Music" to get player position');
    const duration = await osascript('tell application "Music" to get duration of current track');

    const pos = Math.floor(parseFloat(position));
    const dur = Math.floor(parseFloat(duration));

    console.log(`🎵 ${name}`);
    console.log(`   ${artist} - ${album}`);
    console.log(`   ${formatTime(pos)} / ${formatTime(dur)}`);
  } catch {
    console.log("Nothing playing");
  }
}
