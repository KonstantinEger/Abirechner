import { displayAddGradeModal } from './components/AddGradeModal';
import { openDB } from './services/db';

globalThis.handleAddGrade = async (event) => {
  const { aborted, grade, type } = await displayAddGradeModal();

  if (aborted) return;

  const courseShortName = event.target.id.split('-')[0];
  const semester = parseInt(event.target.id.split('-')[1]);

  const tx = (await openDB()).transaction('courses', 'readwrite');
  const index = tx.store.index('by-short-name');
  const data = await index.get(courseShortName);

  switch (type) {
    case "mark": {
      data.marks[semester].push(grade);
      break;
    }
    case "exam": {
      data.exams[semester].push(grade);
      break;
    }
  }

  tx.store.put(data);
  await tx.done;

  location.reload();
}