/**
 * @fileoverview Command-line argument parsing utilities.
 * @module args
 */

/**
 * Parsed command-line arguments containing flags and positional arguments.
 */
export interface ParsedArgs {
  /** Key-value pairs from --flag or --flag=value arguments */
  flags: Record<string, string>;
  /** Non-flag arguments in order of appearance */
  positional: string[];
}

/**
 * Parses command-line arguments into flags and positional arguments.
 * Supports `--flag=value`, `--flag value`, and `--flag` (boolean) formats.
 *
 * @param args - Array of argument strings to parse
 * @returns Parsed flags and positional arguments
 *
 * @example
 * ```ts
 * const { flags, positional } = parseArgs(['search', 'nirvana', '--limit', '10']);
 * // flags: { limit: '10' }
 * // positional: ['search', 'nirvana']
 * ```
 */
export function parseArgs(args: string[]): ParsedArgs {
  const flags: Record<string, string> = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      if (arg.includes('=')) {
        const [key, val] = arg.slice(2).split('=');
        flags[key] = val;
      } else {
        const key = arg.slice(2);
        const next = args[i + 1];
        if (next && !next.startsWith('--')) {
          flags[key] = next;
          i++;
        } else {
          flags[key] = 'true';
        }
      }
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional };
}

/**
 * Extracts the limit value from parsed flags.
 *
 * @param flags - Parsed flags object
 * @param defaultLimit - Default limit if not specified (0 = unlimited)
 * @returns The limit value as a number
 */
export function getLimit(flags: Record<string, string>, defaultLimit = 0): number {
  return parseInt(flags.limit || flags.l || String(defaultLimit));
}

/**
 * Extracts the offset value from parsed flags.
 *
 * @param flags - Parsed flags object
 * @returns The offset value as a number (defaults to 0)
 */
export function getOffset(flags: Record<string, string>): number {
  return parseInt(flags.offset || flags.o || '0');
}
