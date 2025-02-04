import { Course, Enrollment, Student } from '../src';

describe('Student', () => {
  const StudentProps = {
    id: '1',
    maxCredits: 21,
    availableCredits: 15,
  };

  const course = new Course({
    id: '1',
    capacity: 30,
    availableCapacity: 30,
    credit: 3,
  });

  describe('학점 차감', () => {
    it('신청 가능 학점을 차감한다', () => {
      // given
      const studnet = new Student({ ...StudentProps });
      const initialCredit = studnet.availableCredits;

      // when
      studnet.deductCredits(course);

      // then
      expect(studnet.availableCredits).toBe(initialCredit - course.credit);
    });

    it('신청 가능학점이 부족하면 차감에 실패한다', () => {
      // given
      const studnet = new Student({ ...StudentProps, availableCredits: 1 });

      // when & then
      expect(() => studnet.deductCredits(course)).toThrow(
        '수강신청 가능한 학점을 초과했습니다.',
      );
    });
  });

  describe('학점 복구', () => {
    it('신청 가능 학점을 복구한다', () => {
      // given
      const student = new Student({ ...StudentProps });
      const enrollment = new Enrollment({ course, student });
      student.enrollments.push(enrollment);

      const initialCredit = student.availableCredits;

      jest
        .spyOn(course, 'increaseAvailableCapacity')
        .mockImplementation(() => {});

      // when
      student.addCredits(course);

      //then
      expect(student.availableCredits).toBe(initialCredit + course.credit);
    });

    it('복구 학점이 최대학점 보다 높으면 학점 복구에 실패한다', () => {
      // given
      StudentProps.availableCredits = 20;
      const student = new Student({ ...StudentProps });
      const enrollment = new Enrollment({ course, student });
      student.enrollments.push(enrollment);

      // when & then
      expect(() => student.addCredits(course)).toThrow(
        '최대학점을 넘을 수 없습니다.',
      );
    });
  });
});
