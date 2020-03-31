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
  function newCourseObj(name, shortName) {
    return {
      name: name,
      short_name: shortName,
      marks: [[], [], [], []],
      exams: [[], [], [], []]
    };
  }

  const tx = db.transaction('courses', 'readwrite');

  tx.store.add(newCourseObj('Biologie', 'bio'));
  tx.store.add(newCourseObj('Chemie', 'che'));
  tx.store.add(newCourseObj('Deutsch', 'deu'));
  tx.store.add(newCourseObj('Englisch', 'eng'));
  tx.store.add(newCourseObj('Geographie', 'geo'));
  tx.store.add(newCourseObj('Geschichte', 'ges'));
  tx.store.add(newCourseObj('Informatik', 'inf'));
  tx.store.add(newCourseObj('Mathematik', 'mat'));
  tx.store.add(newCourseObj('Musik', 'mus'));
  tx.store.add(newCourseObj('Physik', 'phy'));
  tx.store.add(newCourseObj('Sport', 'spo'));

  await tx.done;
}