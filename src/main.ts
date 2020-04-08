import { openDB, coursesAreInDB, createCoursesInDB, getSemesterAverage } from './services/db';
import { displaySemesterAvg } from './services/updateDOM';
import { range } from './services/utils';
import { getCourseCardData } from './components/CourseCard';

import('./handlers');

(async (): Promise<void> => {
  const db = await openDB();

  if (!(await coursesAreInDB(db))) {
    await createCoursesInDB(db);
  }

  {
    const tx = db.transaction('courses');
    const courses = await tx.store.getAll();
    for (const sem of range(0, 4)) {
      const $parentEl = document.querySelector(`#semester-${sem + 1}-body`)!;
      for (const course of courses) {
        const { html } = getCourseCardData(sem, course);
        $parentEl.insertAdjacentHTML('beforeend', html);
      }

      displaySemesterAvg(sem, await getSemesterAverage(sem));
    }
  }
})();
