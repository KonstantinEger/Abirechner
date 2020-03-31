import { openDB, coursesAreInDB, createCoursesInDB } from './services/db.js';

document.body.onload = async () => {
  const db = await openDB();

  if (!(await coursesAreInDB(db))) {
    await createCoursesInDB(db);
  }

  // construct the cards for each course in each semester
  {
    const tx = db.transaction('courses');
    const courses = await tx.store.getAll();
    console.log(courses);
    for (let sem = 0; sem < 4; sem++) {
      const $parentEl = document.querySelector(`#semester-${sem + 1}-body`);
      for (let course of courses) {
        $parentEl.innerHTML += getCourseCardHTML(sem, course);
      }
    }
  }

  // populate the dom
};

function getCourseCardHTML(semester, course) {
  return `
    <div class="course-card" id="${course.short_name}" style="border-color: ${course.color};">
      <div class="course-card-header" >
        ${course.name}
      </div>
      <div class="course-card-body">
        <b>Klausuren</b>
          <br />
          ${course.exams[semester].reduce((acc, exam) => `${acc} ${exam},`, '')}
          <br />
        <b>Leistungskontrollen</b>
          <br />
          ${course.marks[semester].reduce((acc, mark) => `${acc} ${mark},`, '')}
          <br />
      <div>
    </div>
  `;
}
