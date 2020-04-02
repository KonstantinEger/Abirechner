import { displayAddGradeModal } from './components/AddGradeModal';
import { getCourseCardHTML } from './components/CourseCard';
import { openDB } from './services/db';

globalThis.handleAddGrade = async (event: MouseEvent) => {
  const { aborted, grade, gradeType } = await displayAddGradeModal();

  if (aborted === true) return;

  const $triggerBtn = <HTMLButtonElement>event.target;
  const courseShortName = $triggerBtn.id.split('-')[0];
  const semester = parseInt($triggerBtn.id.split('-')[1]);

  const tx = (await openDB()).transaction('courses', 'readwrite');
  const index = tx.store.index('by-short-name');
  const course = await index.get(courseShortName);

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

  const cardHTML = getCourseCardHTML(semester, course);
  const selector = `div#${courseShortName}-${semester}.course-card`;
  const $prevElement = document.querySelector(selector);
  $prevElement.outerHTML = cardHTML;
};
