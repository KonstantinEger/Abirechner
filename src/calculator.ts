import { range } from './services/utils';
import { openDB } from './services/db';
import { getCourseCardData } from './components/CourseCard';

const placeholder = `
<option value="_" disabled selected hidden>
  -- Prüfungsfach auswählen --
</option>`;

function getPageHTML(): string {
  return `
    <header>
      Rechner
      <button onclick="animCloseCalculator()">
        zurück
      </button>
    </header>

    <select id="select-p1" onchange="handleCourseSelection(event)">
      <option value="deu">Deutsch</option>
      <option value="mat">Mathematik</option>
      ${placeholder}
    </select>

    <select disabled id="select-p2" onchange="handleCourseSelection(event)">
      <option value="eng">Englisch</option>
      <option value="fra">Französich</option>
      <option value="ges">Geschichte</option>
      <option value="phy">Physik</option>
      <option value="che">Chemie</option>
      <option value="bio">Biologie</option>
      <option value="kun">Kunst</option>
      ${placeholder}
    </select>

    <select disabled id="select-p3">
      ${placeholder}
    </select>

    <select disabled id="select-p4">
      ${placeholder}
    </select>

    <select disabled id="select-p5">
      ${placeholder}
    </select>

    <button class="btn" onclick="handleCalcBtnClick()">BERECHNEN</button>
    <div id="calcResultContainer"></div>
  `;
}

function handleCourseSelection(event: Event): void {
  const $selectEl = event.target as HTMLSelectElement;
  const selectVal = $selectEl.options[$selectEl.selectedIndex].value;

  switch ($selectEl.id) {
    case 'select-p1': {
      const $p2Select = document.querySelector('#select-p2')!;
      $p2Select.removeAttribute('disabled');
      const $p3Select = document.querySelector('#select-p3')!;
      $p3Select.innerHTML = `
        <option selected value="${selectVal === 'deu' ? 'mat' : 'deu'}">
          ${selectVal === 'deu' ? 'Mathematik' : 'Deutsch'}
        </option>
      `;
      break;
    }
    case 'select-p2': {
      const $p4Select = document.querySelector('#select-p4')!;
      const $p5Select = document.querySelector('#select-p5')!;
      $p4Select.removeAttribute('disabled');
      $p5Select.removeAttribute('disabled');

      const optionsHTML = `
        <option value="eng">Englisch</option>
        <option value="fra">Französich</option>
        <option value="ges">Geschichte</option>
        <option value="phy">Physik</option>
        <option value="che">Chemie</option>
        <option value="bio">Biologie</option>
        <option value="geo">Geographie</option>
        <option value="grw">GRW</option>
        <option value="eth">Ethik / Religion</option>
        <option value="mus">Musik</option>
        <option value="kun">Kunst</option>
        <option value="info">Informatik</option>
      `;
      $p4Select.innerHTML = placeholder + optionsHTML;
      $p5Select.innerHTML = placeholder + optionsHTML;
      break;
    }
  }
}

// eslint-disable-next-line
(globalThis as any).handleCourseSelection = handleCourseSelection;

interface ChoicesCheckResult {
  isValid: boolean;
  error: string;
}

function checkValidConstell(constell: string[]): ChoicesCheckResult {
  /**
   * RULES:
   * 1) DEU and MAT are required!
   * 2) One of the possible advanced-courses-2 is required!
   * 3) One of GES, GEO or GRW is required!
   * 4) One of PHY, BIO or CHE is required!
   * 5) There cannot be any duplicates!
   */

  // RULE 1
  if (!constell.includes('deu') || !constell.includes('mat')) {
    return {
      isValid: false,
      error: 'Mathematik und Deutsch müssen geprüft werden.'
    };
  }

  // RULE 2
  {
    const result = ['eng', 'fra', 'ges', 'phy', 'che', 'bio', 'kun']
    .map((course) => constell.includes(course))
    .reduce((found, course) => {
      if (course === true) {
        return true;
      } else return found;
    }, false);

    if (result === false) {
      return {
        isValid: false,
        error: 'Eines der Leistungskursfächer muss geprüft werden.'
      };
    }
  }

  // RULE 3
  if (
    !constell.includes('ges') &&
    !constell.includes('geo') &&
    !constell.includes('grw')
  ) {
    return {
      isValid: false,
      error: 'Eines der Fächer aus dem Gesellschaftlichen Aufgabenbereich muss geprüft werden.'
    };
  }

  // RULE 4
  if (
    !constell.includes('phy') &&
    !constell.includes('bio') &&
    !constell.includes('che')
  ) {
    return {
      isValid: false,
      error: 'Eine Naturwissenschaft muss geprüft werden.'
    };
  }

  // RULE 5
  if (new Set(constell).size !== constell.length) {
    return {
      isValid: false,
      error: 'Kein Kurs kann doppelt geprüft werden.'
    };
  }

  return { isValid: true, error: '' };
}

interface FinalResult {
  points: { A: number; B: number };
  grade: number;
  semestersUsed: { shortName: string; points: number[] }[];
}

interface AveragedCourse {
  shortName: string;
  semesters: number[];
}

async function calcFinalResult(testNames: string[]): Promise<FinalResult> {
  const db = await openDB();
  const courses: AveragedCourse[] =
    (await db.transaction('courses').store.getAll())
    .map((course) => {
      const semesters: number[] =
        range(0, 5)
        .map((semIndex) => {
          const { courseAvg } = getCourseCardData(semIndex, course);
          if (courseAvg === null) {
            // What if it's a course you dont have? E.g. INF
            // these need to be ignored => need a settigs page to define which
            // courses should be ignored
            throw new Error(`Err calc average ${course.name} Sem: ${semIndex}`);
          }
          return courseAvg;
        });

      return { shortName: course.short_name, semesters };
    });
  const useSemesters: { shortName: string; points: number }[] = [];

  // BLOCK A:
  // ! advanced-courses are included 2x
  // ! total amount of semesters must equal 40
  // => fill with the best ones which haven't been used already at the end.

  {
    const advancedCourses = courses.filter((course) => {
      if (
        course.shortName === testNames[0] ||
        course.shortName === testNames[1]
      ) return true;
      else return false;
    });
    
    advancedCourses.forEach((course) => {
      range(0, 5).forEach((sem) => {
        // Dont have to do it twice bc they'll be added again w/ tested courses
        useSemesters.push({
          shortName: course.shortName,
          points: course.semesters[sem]
        });
      });
    });
  }

  // get all semester averages for the courses which are tested (testNames)
  {
    const testedCourses = courses.filter((course) => {
      for (let i = 0; i < testNames.length; i++) {
        if (course.shortName === testNames[i]) return true;
      }
      return false;
    });

    testedCourses.forEach((course) => {
      range(0, 5).forEach((sem) => {
        useSemesters.push({
          shortName: course.shortName,
          points: course.semesters[sem]
        });
      });
    });
  }
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

async function handleCalcBtnClick(): Promise<void> {
  const chosenCourses = range(1, 6)
  .map((num) => {
    return document.querySelector<HTMLSelectElement>(`#select-p${num}`)!.value;
  });

  const checkResult = checkValidConstell(chosenCourses);
  const contSelector = '#calcResultContainer';
  const $resCont = document.querySelector(contSelector)!;
  
  if (checkResult.isValid) {
    $resCont.innerHTML = '<div class="success">Prüfungsfächer möglich</div>';
  } else {
    $resCont.innerHTML = `<div class="error">${checkResult.error}</div>`;
    return;
  }

  await calcFinalResult(chosenCourses);
}

// eslint-disable-next-line
(globalThis as any).handleCalcBtnClick = handleCalcBtnClick;

function renderPage(pageHTML: string): void {
  const selector = '#calc-page-body';
  document.querySelector<HTMLDivElement>(selector)!.innerHTML = pageHTML;
}

function init(): void {
  const pageHTML = getPageHTML();
  renderPage(pageHTML);
}

export { init };