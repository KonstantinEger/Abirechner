import { preciseRound } from './utils';

function displaySemesterAvg(sem: number, avg: number | null): void {
  const $allHeaders = document.querySelectorAll<HTMLDivElement>('div.semester-header');
  const $header = $allHeaders[sem];

  const avgDisplay = avg === null ? '-' : preciseRound(avg, 2);

  $header.querySelector<HTMLSpanElement>('span.semester-avg')!
    .innerHTML = `&oslash;${avgDisplay}`;
}

export { displaySemesterAvg };