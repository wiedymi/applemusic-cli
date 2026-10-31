/**
 * @fileoverview Command registry - maps command names to their handler functions.
 * @module commands
 */

import { play, pause, stop, next, prev, toggle } from "./playback";
import { now } from "./now";
import { vol } from "./volume";
import { playlists, playlist, tracks } from "./playlists";
import { songs, search, song } from "./library";
import { albums, album } from "./albums";
import { shuffle, repeat } from "./options";
import { help } from "./help";

/**
 * A command handler function that receives parsed arguments.
 */
export type Command = (args: string[]) => Promise<void> | void;

/**
 * Registry of all available CLI commands.
 * Keys are the command names used in the CLI, values are handler functions.
 */
export const commands: Record<string, Command> = {
  // Playback controls
  play: () => play(),
  pause: () => pause(),
  stop: () => stop(),
  next: () => next(),
  prev: () => prev(),
  toggle: () => toggle(),

  // Now playing info
  now: () => now(),

  // Volume control
  vol,

  // Playlist management
  playlists,
  playlist,
  tracks,

  // Library browsing
  songs,
  search,
  song,
  albums,
  album,

  // Playback options
  shuffle,
  repeat,

  // Help
  help: () => help(),
};
