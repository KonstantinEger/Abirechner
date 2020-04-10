function init(): void {
  const pageBodyHTML = `
    <header>
      Rechner
      <button onclick="animCloseCalculator()">
        zurück
      </button>
    </header>
    <h1>Rechner</h1>
  `;

  document.querySelector<HTMLDivElement>('#calc-page-body')!
    .innerHTML = pageBodyHTML;
}

export { init };