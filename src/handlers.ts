import { displayAddGradeModal } from './components/AddGradeModal';
import { getCourseCardData } from './components/CourseCard';
import { openDB, getSemesterAverage } from './services/db';
import { displaySemesterAvg } from './services/updateDOM';

async function handleAddGrade(event: MouseEvent): Promise<void> {
  const { aborted, grade, gradeType } = await displayAddGradeModal();

  if (aborted === true) return;

  const $triggerBtn = event.target as HTMLButtonElement;
  const courseShortName = $triggerBtn.id.split('-')[0];
  const semester = parseInt($triggerBtn.id.split('-')[1]);

  const tx = (await openDB()).transaction('courses', 'readwrite');
  const index = tx.store.index('by-short-name');
  const course = await index.get(courseShortName);

  if (course === undefined) return;

  switch (gradeType) {
    case 'mark': {
      course.marks[semester].push(grade);
      break;
    }
    case 'exam': {
      course.exams[semester].push(grade);
      break;
    }
  }

  tx.store.put(course);
  await tx.done;

  const { html } = getCourseCardData(semester, course);
  const selector = `div#${courseShortName}-${semester}.course-card`;
  const $prevElement = document.querySelector(selector)!;
  $prevElement.outerHTML = html;

  displaySemesterAvg(semester, await getSemesterAverage(semester));
}

function animToCalculator(): void {
  const $calcPage = document.querySelector<HTMLDivElement>('.page#calculator-page')!;
  $calcPage.style.transition = '0.2s ease-out';
  $calcPage.style.transform = 'translateX(-100vw)';
}

/* eslint-disable */
(globalThis as any).handleAddGrade = handleAddGrade;
(globalThis as any).animToCalculator = animToCalculator;
/* eslint-enable */
