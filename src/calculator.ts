function init(): void {
  const pageBodyHTML = `
    <h1>Rechner</h1>
  `;

  document.querySelector<HTMLDivElement>('#calc-page-body')!
    .innerHTML = pageBodyHTML;
}

export { init };