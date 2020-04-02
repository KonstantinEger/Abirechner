import { ICourse } from "../services/db";
import { concatArray, avgArray, preciseRound } from './utils';

function getCourseCardHTML(semester: number, course: ICourse): string {
  const examsAvg = avgArray(course.exams[semester]);
  const marksAvg = avgArray(course.marks[semester]);
  const courseAvg = isNaN(examsAvg) 
    ? marksAvg 
    : isNaN(marksAvg)
      ? examsAvg
      : (examsAvg + marksAvg) * 0.5;

  const roundExamsAvg = preciseRound(examsAvg, 2);
  const roundMarksAvg = preciseRound(marksAvg, 2);
  const roundCourseAvg = preciseRound(courseAvg, 2);

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
        <span class="course-avg">&oslash;${isNaN(roundCourseAvg) ? '-' : roundCourseAvg}</span>
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
