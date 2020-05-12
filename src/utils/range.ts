/**
 * Returns an array of numbers from `from` to `to - 1`. Usage:
 * ```js
 * for (const index of range(0, 4)) {
 *  console.log(index);
 * }
 * // 0
 * // 1
 * // 2
 * // 3
 * ```
 * @param from First value in the range.
 * @param to Upper value of the range. Non inclusive
 */
export function range(from: number, to: number): number[] {
  return [...Array(to - from).keys()].map((index) => index + from);
}