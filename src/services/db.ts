import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ICourse {
  name: string;
  short_name: string;
  color: string;
  marks: [number[], number[], number[], number[]];
  exams: [number[], number[], number[], number[]];
}

interface IAbiDBSchema extends DBSchema {
  courses: {
    value: ICourse;
    key: number;
    indexes: { 'by-short-name': string };
  }
}

function openDataBase(): Promise<IDBPDatabase<IAbiDBSchema>> {
  return openDB<IAbiDBSchema>('abi-db', 1, {
    upgrade(db) {
      const store = db.createObjectStore('courses', {
        keyPath: 'id',
        autoIncrement: true
      });
      store.createIndex('by-short-name', 'short_name');
    },
    blocked() {
      console.log('blocked');
    }
  });
}

async function coursesAreInDB(db: IDBPDatabase<IAbiDBSchema>): Promise<boolean> {
  const tx = db.transaction('courses');
  return await tx.store.get(1) === undefined ? false : true;
}

async function createCoursesInDB(db: IDBPDatabase<IAbiDBSchema>): Promise<void> {
  function newCourseObj(name: string, shortName: string, color: string): ICourse {
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
  return;
}

export {
  openDataBase as openDB,
  coursesAreInDB,
  createCoursesInDB,
  ICourse,
  IAbiDBSchema
};
