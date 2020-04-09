import { Course } from '../services/db';
import { avgArray, preciseRound } from '../services/utils';

interface CourseCardData {
  html: string;
  courseAvg: number | null;
}

function getCourseCardData(semester: number, course: Course): CourseCardData {
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

  const html = `
    <div
      class="course-card"
      id="${course.short_name}-${semester}"
      style="border-color: ${course.color};"
    >
      <div class="course-card-header">
        ${course.name}
        <span class="course-avg">
          &oslash;${isNaN(roundCourseAvg) ? '-' : roundCourseAvg}
        </span>
        <button
          id="${course.short_name}-${semester}"
          class="add-grade-btn"
          onclick="handleAddGrade(event)"
        >
          Hinzufügen
        </button>
      </div>

      <div class="course-card-body">
        <b>Klausuren</b>
        <span class="grades-avg">
          &oslash;${isNaN(roundExamsAvg) ? '-' : roundExamsAvg}
        </span>
        <br />
          ${course.exams[semester].toString()}
        <br />

        <b>Leistungskontrollen</b>
        <span class="grades-avg">
          &oslash;${isNaN(roundMarksAvg) ? '-' : roundMarksAvg}
        </span>
        <br />
          ${course.marks[semester].toString()}
        <br />
      <div>
    </div>
  `;

  return { 
    html,
    courseAvg: isNaN(courseAvg) ? null : courseAvg
  };
}

export { getCourseCardData };
