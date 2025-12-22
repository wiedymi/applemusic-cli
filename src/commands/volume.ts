/**
 * @fileoverview Volume control command for Apple Music.
 * @module commands/volume
 */

import { osascript } from "../osascript";
import { parseArgs } from "../args";

/**
 * Gets or sets the Apple Music volume level.
 *
 * @param args - Command arguments. If empty, displays current volume.
 *               If a number (0-100) is provided, sets the volume.
 *
 * @example
 * ```ts
 * // Get current volume
 * await vol([]);
 *
 * // Set volume to 50%
 * await vol(['50']);
 * ```
 */
export async function vol(args: string[]): Promise<void> {
  const { positional } = parseArgs(args);
  const level = positional[0];

  if (level === undefined) {
    const vol = await osascript('tell application "Music" to get sound volume');
    console.log(`🔊 Volume: ${vol}%`);
  } else {
    const n = parseInt(level);
    if (isNaN(n) || n < 0 || n > 100) {
      console.log("Volume must be 0-100");
      return;
    }
    await osascript(`tell application "Music" to set sound volume to ${n}`);
    console.log(`🔊 Volume: ${n}%`);
  }
}
