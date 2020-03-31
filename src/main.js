import { openDB, coursesAreInDB, createCoursesInDB } from './services/db.js';

document.body.onload = async () => {
  const db = await openDB();

  if (!(await coursesAreInDB(db))) {
    await createCoursesInDB(db);
  }

  // construct the cards for each course in each semester

  // populate the dom
};
