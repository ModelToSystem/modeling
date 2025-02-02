import {
  CourseType,
  Enrollment,
  EnrollmentStatus,
  ErrorCodes,
  InvalidException,
  Lecture,
} from 'parts/part-2-학사관리시스템-수강신청/chapter-2/jimyung/src/domain';

describe('Enrollment', () => {
  let lecture: Lecture;

  beforeEach(() => {
    lecture = new Lecture({
      name: 'Math',
      credits: 3,
      professorId: '1',
      courseType: CourseType.Required.Ge,
      capacity: 10,
    });
  });

  describe('수강 신청', () => {
    it('수강 신청 시 강의 수강 가능 인원 감소 및 등록 상태 REGISTERED', () => {
      // given
      const initialCapacity = lecture.capacity;

      // when
      const enrollment = Enrollment.enroll('1', lecture);

      // then
      expect(lecture.capacity).toBe(initialCapacity - 1);
      expect(enrollment.status).toBe(EnrollmentStatus.REGISTERED);
    });
  });

  describe('수강 신청 취소', () => {
    it('수강 취소 성공시 강의 수강 가능 인원 증가 및 등록 상태 CANCELLED', () => {
      // given
      const enrollment = Enrollment.enroll('1', lecture);
      const initialCapacity = lecture.capacity;

      // when
      enrollment.cancel(lecture);

      // then
      expect(lecture.capacity).toBe(initialCapacity + 1);
      expect(enrollment.status).toBe(EnrollmentStatus.CANCELLED);
    });

    it('이미 취소된 수강 신청일 경우 예외 발생', () => {
      // given
      const enrollment = Enrollment.enroll('1', lecture);

      // when
      enrollment.cancel(lecture);
      const duplicateCancel = () => enrollment.cancel(lecture);

      // then
      expect(duplicateCancel).toThrow(
        new InvalidException(ErrorCodes.Enrollment.ALREADY_CANCELLED),
      );
    });
  });
});
