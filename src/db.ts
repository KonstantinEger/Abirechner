import { DBSchema, IDBPDatabase, openDB } from 'idb';

export const DB_NAME = 'abi-db';
export const DB_VERSION = 1;

/**
 * Interface representing the data in the database.
 */
export interface Course {
  /** full name of the course */
  name: string;
  /** short name used as ID */
  short_name: string;
  /** css color used for rendering course cards */
  color: string;
  /** Array of 4 semesters, each semester is a `number[]`. Marks are 50% of the whole grade */
  marks: [number[], number[], number[], number[]];
  /** Array of 4 semesters, each semester is a `number[]`. Exams are 50% of the whole grade */
  exams: [number[], number[], number[], number[]];
}

/**
 * Interface representing the shape of the database.
 */
export interface AbiDBSchema extends DBSchema {
  /** Courses object store */
  courses: {
    value: Course;
    key: number;
    indexes: { 'by-short-name': string };
  };
}

/**
 * Returns a reference to the database.
 */
export function openDataBase(): Promise<IDBPDatabase<AbiDBSchema>> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade: (db) => {
      if (db.objectStoreNames.contains('courses') === false) {
        const store = db.createObjectStore('courses', {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('by-short-name', 'short_name');
      }
    },
    blocked: () => {
      console.warn(`${DB_NAME} is blocked...`);
    }
  });
}

/**
 * Check if the database has already been initialized and populated with courses.
 * If so, returns true, otherwise false.
 */
export async function coursesAreInDB(db: IDBPDatabase<AbiDBSchema>): Promise<boolean> {
  const tx = db.transaction('courses', 'readonly');
  return await tx.store.get(1) === undefined ? false : true;
}

/**
 * Populates the database with initial values. Every course is created with
 * empty marks and exams but with a unique color.
 */
export async function populateDB(db: IDBPDatabase<AbiDBSchema>): Promise<void> {
  const newCourse = (name: string, short_name: string, color: string): Course => {
    return {
      name,
      short_name,
      color,
      marks: [[], [], [], []],
      exams: [[], [], [], []]
    };
  }

  const tx = db.transaction('courses', 'readwrite');

  tx.store.add(newCourse('Biologie', 'bio', 'green'));
  tx.store.add(newCourse('Chemie', 'che', 'yellow'));
  tx.store.add(newCourse('Deutsch', 'deu', 'blue'));
  tx.store.add(newCourse('Englisch', 'eng', 'teal'));
  tx.store.add(newCourse('Französisch', 'fra', 'deepskyblue'));
  tx.store.add(newCourse('Geographie', 'geo', 'brown'));
  tx.store.add(newCourse('Geschichte', 'ges', 'orange'));
  tx.store.add(newCourse('GRW', 'grw', 'chocolate'));
  tx.store.add(newCourse('Informatik', 'inf', 'grey'));
  tx.store.add(newCourse('Kunst', 'kun', 'goldenrod'));
  tx.store.add(newCourse('Mathematik', 'mat', 'crimson'));
  tx.store.add(newCourse('Musik', 'mus', 'darkorchid'));
  tx.store.add(newCourse('Physik', 'phy', 'peru'));
  tx.store.add(newCourse('Sport', 'spo', 'cyan'));
  tx.store.add(newCourse('Transjob', 'tra', 'dimgrey'));

  await tx.done;
  return;
}