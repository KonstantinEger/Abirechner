import { Course } from "../db";

const template = document.createElement('template');
template.innerHTML = `
  <h1>Hello World</h1>
  <p><span id="course-name"></span> semester <span id="sem"></span></p>
`;

export class AbiCourseCardElement extends HTMLElement {
  public static readonly selector = 'abi-course-card';
  private course: Course | null = null;
  private semester: number | null = null;

  public static defineIfNot(): void {
    if (window.customElements.get(AbiCourseCardElement.selector) === undefined) {
      window.customElements.define(AbiCourseCardElement.selector, this);
    }
  }

  public connectedCallback(): void {
    this.attachShadow({ mode: 'open' });

    if (!this.course || this.semester === null) throw new Error();
    this.shadowRoot?.appendChild(template.content.cloneNode(true));
    this.shadowRoot?.getElementById('course-name')!.innerText = this.course.name;
    this.shadowRoot?.getElementById('sem')!.innerText = this.semester + 1 + '';
  }

  public setCourseAndSem(course: Course, sem: number): void {
    this.course = course;
    this.semester = sem;
  }
}
