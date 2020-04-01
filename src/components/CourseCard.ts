import { ICourse } from "../services/db";

function getCourseCardHTML(semester: number, course: ICourse): string {
  return `
    <div class="course-card" id="${course.short_name}" style="border-color: ${course.color};">
      <div class="course-card-header" >
        ${course.name}
        <button id="${course.short_name}-${semester}" onclick="handleAddGrade(event)">
          + Neue Note
        </button>
      </div>
      <div class="course-card-body">
        <b>Klausuren</b>
          <br />
          ${course.exams[semester].reduce((acc, exam) => `${acc} ${exam},`, '')}
          <br />
        <b>Leistungskontrollen</b>
          <br />
          ${course.marks[semester].reduce((acc, mark) => `${acc} ${mark},`, '')}
          <br />
      <div>
    </div>
  `;
}

export { getCourseCardHTML };
