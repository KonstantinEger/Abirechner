import { openDataBase, coursesAreInDB, populateDB } from "./db";
import { range } from "./utils/range";
import { AbiCourseCardElement } from "./elements/AbiCourseCard";

AbiCourseCardElement.define();

(async () => {
  const db = await openDataBase();

  if (!await coursesAreInDB(db)) await populateDB(db);

  const courses = await db.transaction('courses').store.getAll();

  for (const semIdx of range(4)) {
    const parentEL = document.querySelector(`#semester-${semIdx}-body`);

    for (const course of courses) {
      const courseCardEL = document.createElement('abi-course-card') as AbiCourseCardElement;
      courseCardEL.setCourseAndSem(course, semIdx);
      parentEL?.appendChild(courseCardEL);
    }
  }
})();