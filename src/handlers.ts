import { displayAddGradeModal } from './components/AddGradeModal';
import { openDB } from './services/db';

globalThis.handleAddGrade = async (event: MouseEvent) => {
  const { aborted, grade, gradeType } = await displayAddGradeModal();

  if (aborted === true) return;

  const $triggerBtn = <HTMLButtonElement>event.target;
  const courseShortName = $triggerBtn.id.split('-')[0];
  const semester = parseInt($triggerBtn.id.split('-')[1]);

  const tx = (await openDB()).transaction('courses', 'readwrite');
  const index = tx.store.index('by-short-name');
  const data = await index.get(courseShortName);

  switch (gradeType) {
    case 'mark': {
      data.marks[semester].push(grade);
      break;
    }
    case 'exam': {
      data.exams[semester].push(grade);
      break;
    }
  }

  tx.store.put(data);
  await tx.done;

  location.reload();
};
