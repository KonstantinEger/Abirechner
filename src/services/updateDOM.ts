import { preciseRound } from './utils';

function displaySemesterAvg(sem: number, avg: number | null): void {
  const selector = 'div.semester-header';
  const $allHeaders = document.querySelectorAll<HTMLDivElement>(selector);
  const $header = $allHeaders[sem];

  const avgDisplay = avg === null ? '-' : preciseRound(avg, 2);

  $header.querySelector<HTMLSpanElement>('span.semester-avg')!
    .innerHTML = `&oslash;${avgDisplay}`;
}

export { displaySemesterAvg };