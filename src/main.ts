import { openDataBase, coursesAreInDB, populateDB } from "./db";
import { range } from "./utils/range";
import { AbiCourseCardElement } from "./elements/AbiCourseCard";

AbiCourseCardElement.defineIfNot();

(async () => {
  const db = await openDataBase();

  if (!await coursesAreInDB(db)) await populateDB(db);

  const tx = db.transaction('courses');
  const courses = await tx.store.getAll();

  for (const semIdx of range(0, 4)) {
    const parentEL = document.querySelector(`#semester-${semIdx}-body`);

    for (const course of courses) {
      const courseCardEL = document.createElement('abi-course-card') as AbiCourseCardElement;
      courseCardEL.setCourse(course);
      parentEL?.appendChild(courseCardEL);
    }
  }
})();