import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { getCourseCardData } from '../components/CourseCard';
import { avgArray } from './utils';

interface Course {
  name: string;
  short_name: string;
  color: string;
  marks: [number[], number[], number[], number[]];
  exams: [number[], number[], number[], number[]];
}

interface AbiDBSchema extends DBSchema {
  courses: {
    value: Course;
    key: number;
    indexes: { 'by-short-name': string };
  };
}

function openDataBase(): Promise<IDBPDatabase<AbiDBSchema>> {
  return openDB<AbiDBSchema>('abi-db', 1, {
    upgrade(db: IDBPDatabase<AbiDBSchema>) {
      if (db.objectStoreNames.contains('courses') === false) {
        const store = db.createObjectStore('courses', {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('by-short-name', 'short_name');
      }
    },
    blocked() {
      console.log('blocked');
    }
  });
}

async function coursesAreInDB(db: IDBPDatabase<AbiDBSchema>): Promise<boolean> {
  const tx = db.transaction('courses');
  return await tx.store.get(1) === undefined ? false : true;
}

async function createCoursesInDB(db: IDBPDatabase<AbiDBSchema>): Promise<void> {
  function newCourseObj(name: string, short: string, color: string): Course {
    return {
      name: name,
      'short_name': short,
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
  tx.store.add(newCourseObj('Französisch', 'fra', 'deepskyblue'));
  tx.store.add(newCourseObj('Geographie', 'geo', 'brown'));
  tx.store.add(newCourseObj('Geschichte', 'ges', 'orange'));
  tx.store.add(newCourseObj('GRW', 'grw', 'chocolate'));
  tx.store.add(newCourseObj('Informatik', 'inf', 'grey'));
  tx.store.add(newCourseObj('Kunst', 'kun', 'goldenrod'));
  tx.store.add(newCourseObj('Mathematik', 'mat', 'crimson'));
  tx.store.add(newCourseObj('Musik', 'mus', 'darkorchid'));
  tx.store.add(newCourseObj('Physik', 'phy', 'peru'));
  tx.store.add(newCourseObj('Sport', 'spo', 'cyan'));
  tx.store.add(newCourseObj('Transjob', 'tra', 'dimgrey'));

  await tx.done;
  return;
}

async function getSemesterAverage(semester: number): Promise<number | null> {
  const db = await openDataBase();
  const courses = await db.transaction('courses').store.getAll();

  const averages: Array<number> = [];
  for (const course of courses) {
    const { courseAvg } = getCourseCardData(semester, course);
    if (courseAvg !== null) averages.push(courseAvg);
  }

  return averages.length === 0
    ? null
    : avgArray(averages);
}

interface FinalResult {
  points: { A: number; B: number };
  grade: number;
  semestersUsed: { shortName: string; points: number[] }[];
}

async function calcFinalResult(/*testNames: string[]*/): Promise<FinalResult> {
  // BLOCK A:
  // ! advanced-courses are included 2x
  // ! total amount of semesters must equal 40
  // => fill with the best ones which haven't been used already at the end.

  // get all semester averages for the courses which are tested (testNames)
  // ! each of the following rules must check if it's already been fulfilled
  // ! best semesters are included first
  // 4 semester averages of a foreign language
  // 2 semester averages of KUN or MUS
  // 4 semester averages of GES
  // 8 semester averages of PHY, BIO or CHEM
  // 2 semester averages of GEO or GRW
  // 2 semester averages of ETH

  // calculate points for block A
  // points => ((sum of used semesters) / (num of used semesters)) * 40
  // points are rounded

  // BLOCK B
  // average the semester averages for each examined course
  // sum up these averages
  // multiply by 4

  // final points = sum of BlockA & BlockB

  // TABLE FOR POINTS => GRADE
  // 300                => 4.0
  // 301 to 301+17=318  => 3.9
  // 319 to 319+17=336  => 3.8
  // ...
  // 805 to 805+17=822  => 1.1
  // 823 to 900         => 1.0

  return {
    points: { A: 0, B: 0 },
    grade: 0,
    semestersUsed: []
  }
}

export {
  openDataBase as openDB,
  calcFinalResult,
  coursesAreInDB,
  createCoursesInDB,
  getSemesterAverage,
  Course,
  AbiDBSchema,
};
