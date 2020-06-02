import { openDataBase, coursesAreInDB, populateDB, Course } from "./db";
import { range } from "./utils/range";
import { AbiCourseCardElement } from "./elements/AbiCourseCard";

AbiCourseCardElement.define();

(async () => {
  const db = await openDataBase();

  if (!await coursesAreInDB(db)) await populateDB(db);

  const setParent = (parentEL: HTMLDivElement) => (
    (semIdx: number) => (
      (course: Course) => {
        const courseCardEL = document.createElement('abi-course-card') as AbiCourseCardElement;
        courseCardEL.setCourseAndSem(course, semIdx);
        parentEL.appendChild(courseCardEL);
      }
    )
  )

  const courses = await db.transaction('courses').store.getAll();

  range(4).forEach((semIdx) => {
    const parent = document.querySelector(`#semester-${semIdx}-body`) as HTMLDivElement;
    const setSem = setParent(parent);
    const createCourse = setSem(semIdx);
    courses.forEach(createCourse);
  });
})();