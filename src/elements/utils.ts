/**
 * Averages an array. If not possible, returns null.
 */
export function avgArray(arr: number[]): number | null {
  return arr.length === 0
    ? null
    : arr.reduce((sum, n) => sum + n, 0) / arr.length;
}

/**
 * Replace placeholders in the inner HTML of the element.
 * @param values Array of tuples with a matcher and a replace value.
 * ```js
 * replaceTemplates(el, [/RegExp/, 'replaceWithThis']);
 * ```
 */
export function replaceTemplates(el: HTMLElement, ...values: [string | RegExp, any][]): void {
  if (!el.shadowRoot)
    return console.error('element does not have a shadow root');

  let innerHTML = el.shadowRoot.innerHTML;
  for (const arg of values) {
    innerHTML = innerHTML.replace(arg[0], arg[1]);
  }
  el.shadowRoot.innerHTML = innerHTML;
}