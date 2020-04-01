function displayAddGradeModal() {
  return new Promise((resolve) => {
    const bgElement = document.createElement('div');
    bgElement.className = 'modal-bg';
    bgElement.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          Neue Note hinzufügen:
        </div>
        <div class="modal-body">
          <select id="type-select">
            <option value="exam" selected>Klausur</option>
            <option value="mark" selected>Sonstige Note</option>
          </select>
          <input type="number" min="0" max="15" value="15" step="1" id="grade-input" />
          <div id="done-btn-container"></div>
        </div>
      </div>
    `;
    const doneBtn = document.createElement('button');
    doneBtn.innerText = 'Fertig';
    doneBtn.addEventListener('click', () => {
      const type = bgElement.querySelector('select#type-select').value;
      const grade = parseInt(bgElement.querySelector('input#grade-input').value);
      document.body.removeChild(bgElement);
      resolve({ type, grade });
    });
    bgElement.querySelector('div#done-btn-container').appendChild(doneBtn);
    document.body.insertBefore(bgElement, document.body.firstChild);
  });
}

export { displayAddGradeModal };
