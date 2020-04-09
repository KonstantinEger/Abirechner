interface AddGradeModalResult {
  aborted: boolean;
  gradeType: 'exam' | 'mark';
  grade: number;
}

function displayAddGradeModal(): Promise<AddGradeModalResult> {
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
          <input 
            type="number" min="0" max="15" 
            value="15" step="1" id="grade-input"
          />
          <div id="actions-container"></div>
        </div>
      </div>
    `;

    const doneBtn = document.createElement('button');
    doneBtn.innerText = 'FERTIG';
    doneBtn.addEventListener('click', () => {
      const gradeType = bgElement
        .querySelector<HTMLSelectElement>('select#type-select')!
        .value as 'exam' | 'mark';

      const grade = parseInt(
        bgElement.querySelector<HTMLInputElement>('input#grade-input')!.value
      );

      document.body.removeChild(bgElement);
      resolve({ aborted: false, gradeType, grade });
    });

    const abortBtn = document.createElement('button');
    abortBtn.classList.add('secundary');
    abortBtn.innerText = 'ABBRECHEN';
    abortBtn.addEventListener('click', () => {
      document.body.removeChild(bgElement);
      resolve({ aborted: true, grade: 0, gradeType: 'mark' });
    });

    const $actionsContainer = bgElement.querySelector('div#actions-container')!;
    $actionsContainer.appendChild(doneBtn);
    $actionsContainer.appendChild(abortBtn);
    document.body.insertBefore(bgElement, document.body.firstChild);
  });
}

export { displayAddGradeModal };
