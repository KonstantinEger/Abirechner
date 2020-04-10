import { range } from './services/utils';

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

    <button class="btn" onclick="handleCheckBtnClick()">check</button>
    <div id="checkResultContainer"></div>
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
      error: 'Eine Naturwissenschaft muss belegt werden.'
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

function handleCheckBtnClick(): void {
  const chosenCourses = range(1, 6)
  .map((num) => {
    return document.querySelector<HTMLSelectElement>(`#select-p${num}`)!.value;
  });

  const checkResult = checkValidConstell(chosenCourses);
  const contSelector = '#checkResultContainer';
  const $resCont = document.querySelector(contSelector)!;
  
  if (checkResult.isValid) {
    $resCont.innerHTML = '<div class="success">Prüfungsfächer möglich</div>';
  } else {
    $resCont.innerHTML = `<div class="error">${checkResult.error}</div>`;
  }
}

// eslint-disable-next-line
(globalThis as any).handleCheckBtnClick = handleCheckBtnClick;

function renderPage(pageHTML: string): void {
  const selector = '#calc-page-body';
  document.querySelector<HTMLDivElement>(selector)!.innerHTML = pageHTML;
}

function init(): void {
  const pageHTML = getPageHTML();
  renderPage(pageHTML);
}

export { init };