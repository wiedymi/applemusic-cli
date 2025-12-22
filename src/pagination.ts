/**
 * @fileoverview Pagination utilities for list commands.
 * @module pagination
 */

/**
 * Result of paginating a list of items.
 * @template T - The type of items being paginated
 */
export interface Page<T> {
  /** Items on the current page */
  items: T[];
  /** Total number of items before pagination */
  total: number;
  /** Human-readable string showing current range (e.g., "1-10 of 50") */
  showing: string;
  /** Whether there are more items after this page */
  hasMore: boolean;
  /** The offset to use for the next page */
  nextOffset: number;
}

/**
 * Paginates an array of items based on limit and offset.
 *
 * @template T - The type of items being paginated
 * @param items - The full array of items to paginate
 * @param limit - Maximum number of items to return (0 = unlimited)
 * @param offset - Number of items to skip from the beginning
 * @returns Paginated result with items and metadata
 *
 * @example
 * ```ts
 * const allSongs = ['Song A', 'Song B', 'Song C', 'Song D', 'Song E'];
 * const page = paginate(allSongs, 2, 2);
 * // page.items: ['Song C', 'Song D']
 * // page.showing: '3-4 of 5'
 * // page.hasMore: true
 * // page.nextOffset: 4
 * ```
 */
export function paginate<T>(items: T[], limit: number, offset: number): Page<T> {
  const total = items.length;
  const start = offset;
  const end = limit > 0 ? Math.min(offset + limit, total) : total;
  const page = items.slice(start, end);
  const showing = total === 0 ? '0' : `${start + 1}-${end} of ${total}`;
  const hasMore = limit > 0 && offset + limit < total;

  return {
    items: page,
    total,
    showing,
    hasMore,
    nextOffset: offset + limit,
  };
}

/**
 * Prints a hint to the console showing how to get the next page of results.
 *
 * @param page - The current page result
 */
export function printPaginationHint(page: Page<unknown>): void {
  if (page.hasMore) {
    console.log(`\n   Use --offset ${page.nextOffset} to see more`);
  }
}
