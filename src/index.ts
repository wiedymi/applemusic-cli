#!/usr/bin/env bun
/**
 * @fileoverview Apple Music CLI entry point.
 *
 * Control Apple Music from the terminal using AppleScript (macOS only).
 *
 * @example
 * ```bash
 * # Run via bun
 * bun run src/index.ts play
 *
 * # Or via alias
 * am play
 * am now
 * am playlists --limit 10
 * ```
 *
 * @packageDocumentation
 */

import { commands } from "./commands";

const [cmd, ...args] = Bun.argv.slice(2);

if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
  commands.help([]);
} else if (cmd in commands) {
  await commands[cmd](args);
} else {
  console.log(`Unknown command: ${cmd}`);
  console.log('Run "am help" for usage');
}
