import {
  CourseType,
  ErrorCodes,
  InvalidException,
  Lecture,
  Student,
} from 'parts/part-2-학사관리-시스템/jimyung/src/domain';

describe('Student', () => {
  describe('수강 신청', () => {
    it('수강 신청 시 수강 가능 학점 감소 및 강의 수강 가능 인원 감소', () => {
      // given
      const student = new Student({ id: '1', allowedCredits: 10 });
      const lecture = new Lecture({
        name: 'Math',
        credits: 3,
        professorId: '1',
        courseType: CourseType.Required.Ge,
        capacity: 10,
      });
      const initialCapacity = lecture.capacity;
      const initialAllowedCredits = student.allowedCredits;

      // when
      student.apply(lecture);

      // then
      expect(lecture.capacity).toBe(initialCapacity - 1);
      expect(student.allowedCredits).toBe(
        initialAllowedCredits - lecture.credits,
      );
    });

    it('수강 신청 시 수강 가능 학점이 부족할 경우 예외 발생', () => {
      // given
      const student = new Student({ id: '1', allowedCredits: 10 });
      const lecture = new Lecture({
        name: 'Math',
        credits: 11,
        professorId: '1',
        courseType: CourseType.Required.Ge,
        capacity: 10,
      });
      const initialCapacity = lecture.capacity;
      const initialAllowedCredits = student.allowedCredits;

      // when
      const creditOverflowedEnrollment = () => student.apply(lecture);

      // then
      expect(creditOverflowedEnrollment).toThrow(
        new InvalidException(ErrorCodes.Student.INSUFFICIENT_CREDITS),
      );
      expect(lecture.capacity).toBe(initialCapacity);
      expect(student.allowedCredits).toBe(initialAllowedCredits);
    });
  });

  describe('수강 신청 취소', () => {
    it('수강 신청 취소 시 수강 가능 학점 증가 및 강의 수강 가능 인원 증가', () => {
      // given
      const student = new Student({ id: '1', allowedCredits: 10 });

      const lecture = new Lecture({
        name: 'Math',
        credits: 3,
        professorId: '1',
        courseType: CourseType.Required.Ge,
        capacity: 10,
      });
      const initialCapacity = lecture.capacity;
      const initialAllowedCredits = student.allowedCredits;

      // when
      student.apply(lecture);
      student.cancelApplication(lecture);

      // then
      expect(lecture.capacity).toBe(initialCapacity);
      expect(student.allowedCredits).toBe(initialAllowedCredits);
    });
  });
});
