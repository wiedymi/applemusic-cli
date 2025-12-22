/**
 * @fileoverview Playback option commands (shuffle, repeat) for Apple Music.
 * @module commands/options
 */

import { osascript } from "../osascript";
import { parseArgs } from "../args";

/** Valid shuffle states */
type ShuffleState = 'on' | 'off';

/** Valid repeat modes */
type RepeatMode = 'off' | 'one' | 'all';

/**
 * Gets or sets the shuffle state.
 *
 * @param args - Command arguments. If empty, displays current state.
 *               If 'on' or 'off' provided, sets the shuffle state.
 */
export async function shuffle(args: string[]): Promise<void> {
  const { positional } = parseArgs(args);
  const state = positional[0] as ShuffleState | undefined;

  if (state === undefined) {
    const enabled = await osascript('tell application "Music" to get shuffle enabled');
    console.log(`🔀 Shuffle: ${enabled === 'true' ? 'on' : 'off'}`);
  } else if (state === 'on') {
    await osascript('tell application "Music" to set shuffle enabled to true');
    console.log("🔀 Shuffle: on");
  } else if (state === 'off') {
    await osascript('tell application "Music" to set shuffle enabled to false');
    console.log("🔀 Shuffle: off");
  } else {
    console.log("Usage: am shuffle [on|off]");
  }
}

/**
 * Gets or sets the repeat mode.
 *
 * @param args - Command arguments. If empty, displays current mode.
 *               If 'off', 'one', or 'all' provided, sets the repeat mode.
 *
 * @remarks
 * - 'off': No repeat
 * - 'one': Repeat current track
 * - 'all': Repeat entire playlist/queue
 */
export async function repeat(args: string[]): Promise<void> {
  const { positional } = parseArgs(args);
  const state = positional[0] as RepeatMode | undefined;

  if (state === undefined) {
    const mode = await osascript('tell application "Music" to get song repeat');
    const modes: Record<string, string> = { off: 'off', one: 'one', all: 'all' };
    console.log(`🔁 Repeat: ${modes[mode] || mode}`);
  } else if (['off', 'one', 'all'].includes(state)) {
    await osascript(`tell application "Music" to set song repeat to ${state}`);
    console.log(`🔁 Repeat: ${state}`);
  } else {
    console.log("Usage: am repeat [off|one|all]");
  }
}
