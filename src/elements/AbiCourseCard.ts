import { Course } from "../db";

export class AbiCourseCardElement extends HTMLElement {
  public static readonly selector = 'abi-course-card';
  private course: Course | null = null;

  public static defineIfNot(): void {
    if (window.customElements.get(AbiCourseCardElement.selector) === undefined) {
      window.customElements.define(AbiCourseCardElement.selector, this);
    }
  }

  public setCourse(course: Course): void {
    this.course = course;
  }

  public getCourse(): Course | null {
    return this.course;
  }
}
