import { GradeType } from "../db";

const template = document.createElement('template');
template.innerHTML = `
  <h1>Hello World 1234</h1>
  <button id="complete-btn">complete</button>
  <button id="abort-btn">abort</button>
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

    this.shadowRoot?.getElementById('complete-btn')?.addEventListener('click', () => {
      this.onModalCloseCallback({ success: true, type: 'EXAM', value: 0 });
    });

    this.shadowRoot?.getElementById('abort-btn')?.addEventListener('click', () => {
      this.onModalCloseCallback({ success: false, type: 'EXAM', value: 0 });
    });
  }

  public get result(): Promise<ModalResult> {
    return new Promise((resolve) => {
      this.onModalCloseCallback = (result) => resolve(result);
    });
  }
}
