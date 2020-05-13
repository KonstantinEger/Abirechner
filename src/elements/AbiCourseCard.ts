import { Course } from "../db";

const template = document.createElement('template');
template.innerHTML = `
  <style>
    .course-card {
      padding: 10px;
      margin: 15px;
      border-radius: 5px;
      background-color: var(--bg-color-lighten);
      border-left: 3px solid var(--bg-color-lighten);
    }

    .course-card-header {
      padding: 10px 0px 10px 10px;
      font-size: 1.2em;
    }

    .course-card-body {
      padding-left: 13px;
    }
  </style>
  <div class="course-card" style="border-color:{{ COLOR }}">
    <div class="course-card-header">
      {{ NAME }}
    </div>

    <div class="course-card-body">
      <b>Klausuren</b> <br />
      {{ EXAMS }}
      <br />
      <b>Leistungskontrollen</b> <br />
      {{ MARKS }}
      <br />
    </div>
  </div>
`;

export class AbiCourseCardElement extends HTMLElement {
  public static readonly selector = 'abi-course-card';
  public shadowRoot: ShadowRoot;
  private course: Course | null = null;
  private semester: number | null = null;

  constructor() {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });
  }

  public static defineIfNot(): void {
    if (window.customElements.get(AbiCourseCardElement.selector) === undefined) {
      window.customElements.define(AbiCourseCardElement.selector, this);
    }
  }

  public connectedCallback(): void {
    if (!this.course || this.semester === null) throw new Error();

    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.replaceTemp(
      [/{{ COLOR }}/, this.course.color],
      [/{{ NAME }}/, this.course.name],
      [/{{ EXAMS }}/, this.course.exams[this.semester].toString()],
      [/{{ MARKS }}/, this.course.marks[this.semester].toString()]
    );
  }

  public setCourseAndSem(course: Course, sem: number): void {
    this.course = course;
    this.semester = sem;
  }

  private replaceTemp(...values: [string | RegExp, string][]): void {
    let innerHTML = this.shadowRoot.innerHTML;
    for (const arg of values) {
      innerHTML = innerHTML.replace(arg[0], arg[1]);
    }
    this.shadowRoot.innerHTML = innerHTML;
  }
}
