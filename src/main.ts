import { openDB, coursesAreInDB, createCoursesInDB, getSemesterAverage } from './services/db';
import { getCourseCardData } from './components/CourseCard';
import { displaySemesterAvg } from './services/updateDOM';

import('./handlers');

(async () => {
  const db = await openDB();

  if (!(await coursesAreInDB(db))) {
    await createCoursesInDB(db);
  }

  {
    const tx = db.transaction('courses');
    const courses = await tx.store.getAll();
    for (let sem = 0; sem < 4; sem++) {
      const $parentEl = document.querySelector(`#semester-${sem + 1}-body`)!;
      for (let course of courses) {
        const { html } = getCourseCardData(sem, course);
        $parentEl.innerHTML += html;
      }

      displaySemesterAvg(sem, await getSemesterAverage(sem));
    }
  }
})();
