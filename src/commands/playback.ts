/**
 * @fileoverview Playback control commands for Apple Music.
 * @module commands/playback
 */

import { osascript } from "../osascript";

/**
 * Starts or resumes playback in Apple Music.
 */
export async function play(): Promise<void> {
  await osascript('tell application "Music" to play');
  console.log("▶ Playing");
}

/**
 * Pauses the current playback in Apple Music.
 */
export async function pause(): Promise<void> {
  await osascript('tell application "Music" to pause');
  console.log("⏸ Paused");
}

/**
 * Stops playback completely in Apple Music.
 */
export async function stop(): Promise<void> {
  await osascript('tell application "Music" to stop');
  console.log("⏹ Stopped");
}

/**
 * Skips to the next track in the current queue.
 */
export async function next(): Promise<void> {
  await osascript('tell application "Music" to next track');
  console.log("⏭ Next track");
}

/**
 * Returns to the previous track in the current queue.
 */
export async function prev(): Promise<void> {
  await osascript('tell application "Music" to previous track');
  console.log("⏮ Previous track");
}

/**
 * Toggles between play and pause states.
 */
export async function toggle(): Promise<void> {
  await osascript('tell application "Music" to playpause');
  console.log("⏯ Toggled playback");
}
