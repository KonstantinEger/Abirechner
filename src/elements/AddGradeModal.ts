import { GradeType } from "../db";

const template = document.createElement('template');
template.innerHTML = `
  <div class="modal-background">
    <div class="modal">
      <div class="modal-header">
        Neue Note Hinzufügen:
      </div>

      <div class="modal-body">
        <select id="type-select">
          <option value="EXAM" selected>Klausur</option>
          <option value="MARK">Sonstige Note</option>
        </select>
        <input type="number" min="0" max="15" value="15" step="1" id="grade-input" />

        <button class="btn btn-primary" id="done-btn">fertig</button>
        <button class="btn btn-secundary" id="abort-btn">abbrechen</button>
      </div>
    </div>
  </div>
`;

interface ModalResult {
  type: GradeType;
  success: boolean;
  value: number;
}

export class AddGradeModalElement extends HTMLElement {
  public static readonly selector = 'add-grade-modal';
  private onModalCloseCallback: (result?: ModalResult) => void = () => console.warn('No listener');

  public static define(): void {
    if (window.customElements.get(AddGradeModalElement.selector) === undefined) {
      window.customElements.define(AddGradeModalElement.selector, this);
    }
  }

  public connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    const once = true;

    this.shadowRoot!.getElementById('done-btn')!.addEventListener('click', () => {
      const type = (this.shadowRoot!.getElementById('type-select') as HTMLSelectElement).value as GradeType;
      const value = parseInt((this.shadowRoot!.getElementById('grade-input') as HTMLInputElement).value);
      // TODO: validation
      this.onModalCloseCallback({ success: true, type, value });
    }, { once });
  
    this.shadowRoot!.getElementById('abort-btn')!.addEventListener('click', () => {
      this.onModalCloseCallback({ success: false, type: 'EXAM', value: 0 });
    }, { once });
  }

  public get result(): Promise<ModalResult> {
    return new Promise((resolve) => {
      this.onModalCloseCallback = (result) => resolve(result);
    });
  }
}
