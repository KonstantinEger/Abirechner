import * as idb from 'https://unpkg.com/idb?module';

export function openDB() {
  return idb.openDB('abi-db', 1, {
    upgrade(db) {
      const store = db.createObjectStore('courses', {
        keyPath: 'id',
        autoIncrement: true
      });
      store.createIndex('by-short-name', 'short_name');
    }
  });
}

export async function coursesAreInDB(db) {
  const tx = db.transaction('courses');
  return await tx.store.get(1) === undefined ? false : true;
}

export async function createCoursesInDB(db) {
  function newCourseObj(name, shortName, color) {
    return {
      name: name,
      short_name: shortName,
      color: color,
      marks: [[], [], [], []],
      exams: [[], [], [], []]
    };
  }

  const tx = db.transaction('courses', 'readwrite');

  tx.store.add(newCourseObj('Biologie', 'bio', 'green'));
  tx.store.add(newCourseObj('Chemie', 'che', 'yellow'));
  tx.store.add(newCourseObj('Deutsch', 'deu', 'blue'));
  tx.store.add(newCourseObj('Englisch', 'eng', 'teal'));
  tx.store.add(newCourseObj('Geographie', 'geo', 'brown'));
  tx.store.add(newCourseObj('Geschichte', 'ges', 'orange'));
  tx.store.add(newCourseObj('Informatik', 'inf', 'grey'));
  tx.store.add(newCourseObj('Mathematik', 'mat', 'crimson'));
  tx.store.add(newCourseObj('Musik', 'mus', 'darkorchid'));
  tx.store.add(newCourseObj('Physik', 'phy', 'peru'));
  tx.store.add(newCourseObj('Sport', 'spo', 'cyan'));

  await tx.done;
}