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
      <option value="mat">Mathe</option>
      <option value="" disabled selected hidden>Schriftliche Prüfung</option>
    </select>

    <select disabled id="select-p2" onchange="handleCourseSelection(event)">
      <option value="eng">Englisch</option>
      <option value="fra">Französich</option>
      <option value="ges">Geschichte</option>
      <option value="phy">Physik</option>
      <option value="che">Chemie</option>
      <option value="bio">Biologie</option>
      <option value="kun">Kunst</option>
      <option value="" disabled selected hidden>Schriftliche Prüfung</option>
    </select>

    <select disabled id="select-p3">
      <option value="" disabled selected hidden>Schriftliche Prüfung</option>
    </select>

    <select disabled id="select-p4">
      <option value="" disabled selected hidden>Mündliche Prüfung</option>
    </select>

    <select disabled id="select-p5">
      <option value="" disabled selected hidden>Mündliche Prüfung</option>
    </select>
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
          ${selectVal === 'deu' ? 'Mathe' : 'Deutsch'}
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
      $p4Select.insertAdjacentHTML('beforeend', optionsHTML);
      $p5Select.insertAdjacentHTML('beforeend', optionsHTML);
      break;
    }
  }
}

// eslint-disable-next-line
(globalThis as any).handleCourseSelection = handleCourseSelection;

function renderPage(pageHTML: string): void {
  const selector = '#calc-page-body';
  document.querySelector<HTMLDivElement>(selector)!.innerHTML = pageHTML;
}

function init(): void {
  const pageHTML = getPageHTML();
  renderPage(pageHTML);
}

export { init };