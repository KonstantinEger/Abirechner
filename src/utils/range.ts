/**
 * Returns an array of numbers from `0` or `from` to `to - 1`.
 * ```js
 * for (const idx of range(someArray.length)) {...}
 * for (const idx of range(3, someArray.length)) {...}
 * ```
 */
export function range(from: number, to?: number): number[] {
  if (to === undefined) {
    to = from;
    from = 0;
  }

  return [...Array(to - from).keys()].map((index) => index + from);
}