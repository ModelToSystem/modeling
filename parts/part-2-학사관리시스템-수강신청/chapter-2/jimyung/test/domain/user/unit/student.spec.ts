import {
  CourseType,
  ErrorCodes,
  InvalidException,
  Lecture,
  Student,
} from 'parts/part-2-학사관리시스템-수강신청/chapter-2/jimyung/src/domain';

describe('Student', () => {
  let lecture: Lecture;

  beforeEach(() => {
    lecture = new Lecture({
      name: 'Math',
      credits: 3,
      professorId: '1',
      courseType: CourseType.RequiredGe,
      capacity: 10,
    });
  });

  describe('수강 신청', () => {
    it('수강 신청 시 수강 가능 학점 감소', () => {
      // given
      const student = new Student({ id: '1', allowedCredits: 10 });
      const initialAllowedCredits = student.allowedCredits;

      // when
      student.apply(lecture);

      // then
      expect(student.allowedCredits).toBe(
        initialAllowedCredits - lecture.credits,
      );
    });

    it('수강 신청 시 수강 가능 학점이 부족할 경우 예외 발생', () => {
      // given
      const student = new Student({ id: '1', allowedCredits: 10 });
      const initialAllowedCredits = student.allowedCredits;

      // when
      const creditOverflowedEnrollment = () => student.apply(lecture);

      // then
      expect(creditOverflowedEnrollment).toThrow(
        new InvalidException(ErrorCodes.Student.INSUFFICIENT_CREDITS),
      );
      expect(student.allowedCredits).toBe(initialAllowedCredits);
    });
  });

  describe('수강 신청 취소', () => {
    it('수강 신청 취소 시 수강 가능 학점 증가', () => {
      // given
      const student = new Student({ id: '1', allowedCredits: 10 });
      const initialAllowedCredits = student.allowedCredits;

      // when
      student.apply(lecture);
      student.cancelApplication(lecture);

      // then
      expect(student.allowedCredits).toBe(initialAllowedCredits);
    });
  });
});
