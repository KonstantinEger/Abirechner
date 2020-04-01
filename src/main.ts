import { openDB, coursesAreInDB, createCoursesInDB } from './services/db';
import { getCourseCardHTML } from './components/CourseCard';

import('./handlers');

document.body.onload = async () => {
  const db = await openDB();

  if (!(await coursesAreInDB(db))) {
    await createCoursesInDB(db);
  }

  {
    const tx = db.transaction('courses');
    const courses = await tx.store.getAll();
    for (let sem = 0; sem < 4; sem++) {
      const $parentEl = document.querySelector(`#semester-${sem + 1}-body`);
      for (let course of courses) {
        $parentEl.innerHTML += getCourseCardHTML(sem, course);
      }
    }
  }
};
