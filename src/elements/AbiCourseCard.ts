import { Course } from "../db";
import { replaceTemplates, avgArray } from './utils';

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

    #add-grade-btn {
      --fontsize: 15px;
      float: right;
      color: #dddddd;
      background-color: var(--theme);
      border: none;
      border-radius: 15px;
      font-size: var(--fontsize);
      height: calc(46px - var(--fontsize));
      margin-right: 10px;
      padding: 1px 12px;
    }

    #course-avg {
      float: right;
      color: var(--theme);
    }

    .grades-avg {
      float: right;
    }

    .course-card-body {
      padding-left: 13px;
    }
  </style>

  <div class="course-card" style="border-color:{{ COLOR }}">
    <div class="course-card-header">
      {{ NAME }}
      <span id="course-avg">&oslash;{{ COURSE_AVG }}</span>
      <button id="add-grade-btn">
        Hinzufügen
      </button>
    </div>

    <div class="course-card-body">
      <b>Klausuren</b>
      <span class="grades-avg">&oslash;{{ EXAMS_AVG }}</span>
      <br />
      {{ EXAMS }}
      <br />
      <b>Leistungskontrollen</b>
      <span class="grades-avg">&oslash;{{ MARKS_AVG }}</span>
      <br />
      {{ MARKS }}
      <br />
    </div>
  </div>
`;

export class AbiCourseCardElement extends HTMLElement {
  public static readonly selector = 'abi-course-card';
  private course: Course | null = null;
  private semester: number | null = null;

  /**
   * Defines the element as a custom element. Does nothing if the element
   * is already defined.
   */
  public static define(): void {
    if (window.customElements.get(AbiCourseCardElement.selector) === undefined) {
      window.customElements.define(AbiCourseCardElement.selector, this);
    }
  }

  public connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    if (!this.course || this.semester === null) throw new Error();

    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    const { courseAvg, examsAvg, marksAvg } = this.getAverages();

    replaceTemplates(
      this,
      [/{{ COLOR }}/, this.course.color],
      [/{{ NAME }}/, this.course.name],
      [/{{ COURSE_AVG }}/, courseAvg ?? '-'],
      [/{{ EXAMS_AVG }}/, examsAvg ?? '-'],
      [/{{ EXAMS }}/, this.course.exams[this.semester].toString()],
      [/{{ MARKS_AVG }}/, marksAvg ?? '-'],
      [/{{ MARKS }}/, this.course.marks[this.semester].toString()]
    );

    this.shadowRoot?.getElementById('add-grade-btn')?.addEventListener('click', () => {
      // open the add-grade-modal
      // wait for a selection
      // save the new grade in the database
      // update
      console.warn('not implemented yet');
    });
  }

  /**
   * Set a course and semester for rendering the element. Must be called
   * before the element gets connected to the DOM.
   */
  public setCourseAndSem(course: Course, semester: number): void {
    this.course = course;
    this.semester = semester;
  }

  private getAverages(): { 
    courseAvg: number | null;
    marksAvg: number | null;
    examsAvg: number | null;
  } {
    if (!this.course || this.semester === null) throw new Error();

    const examsAvg = avgArray(this.course.exams[this.semester]);
    const marksAvg = avgArray(this.course.marks[this.semester]);

    const courseAvg = (examsAvg !== null && marksAvg !== null)
      ? (examsAvg + marksAvg) / 2
      : (examsAvg === null && marksAvg === null)
        ? null
        : examsAvg ?? marksAvg;

    return {
      courseAvg,
      examsAvg,
      marksAvg
    };
   }
}
