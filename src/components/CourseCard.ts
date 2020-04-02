import { ICourse } from "../services/db";
import { concatArray, avgArray, preciseRound } from './utils';

function getCourseCardHTML(semester: number, course: ICourse): string {
  const roundExamsAvg = preciseRound(avgArray(course.exams[semester]), 2);
  const roundMarksAvg = preciseRound(avgArray(course.marks[semester]), 2);

  return `
    <div
      class="course-card"
      id="${course.short_name}-${semester}"
      style="border-color: ${course.color};"
    >
      <div class="course-card-header">
        ${course.name}
        <button id="${course.short_name}-${semester}" onclick="handleAddGrade(event)">
          + Neue Note
        </button>
      </div>
      <div class="course-card-body">
        <b>Klausuren</b>
        <span class="grades-avg">&oslash;${isNaN(roundExamsAvg) ? '-' : roundExamsAvg}</span>
        <br />
          ${concatArray(course.exams[semester])}
        <br />
        <b>Leistungskontrollen</b>
        <span class="grades-avg">&oslash;${isNaN(roundMarksAvg) ? '-' : roundMarksAvg}</span>
        <br />
          ${concatArray(course.marks[semester])}
        <br />
      <div>
    </div>
  `;
}

export { getCourseCardHTML };
