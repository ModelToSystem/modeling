import { Course, Enrollment, EnrollmentStatus, Student } from '../src';

describe('Ernollment', () => {
  const course = new Course({
    id: '1',
    capacity: 30,
    availableCapacity: 25,
    credit: 3,
  });

  const student = new Student({
    id: '1',
    maxCredits: 21,
    availableCredits: 15,
  });
  const EnrollmentProps = {
    course,
    student,
  };

  describe('수강 신청', () => {
    it('등록내역이 생성된다', () => {
      // given & when
      const enrollment = new Enrollment({ ...EnrollmentProps });

      // then
      expect(enrollment.status).toBe(EnrollmentStatus.ENROLLED);
    });
  });

  describe('수강 취소', () => {
    it('등록된 내역의 상태를 취소로 변경한다', () => {
      // given
      const enrollment = new Enrollment({ ...EnrollmentProps });
      jest.spyOn(student, 'addCredits').mockImplementation(() => {});

      // when
      enrollment.cancel(student);
      // then
      expect(enrollment.status).toBe(EnrollmentStatus.CANCELLED);
    });

    it('이미 취소된 등록은 등록 상태 변경에 실패한다 ', () => {
      // given
      const enrollment = new Enrollment({ ...EnrollmentProps });

      enrollment.cancel(student);

      // when & then
      expect(() => enrollment.cancel(student)).toThrow(
        '이미 취소된 내역입니다.',
      );
    });
  });
});
