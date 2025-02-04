import {
  Course,
  CourseProps,
  Enrollment,
  EnrollmentStatus,
  Student,
  StudentProps,
} from '../src';

describe('수강신청/ 수강취소', () => {
  const courseProps: CourseProps = {
    id: '1',
    capacity: 40,
    credit: 3,
    availableCapacity: 30,
  };

  const studentProps: StudentProps = {
    id: '1',
    maxCredits: 21,
    availableCredits: 15,
  };

  describe('수강신청', () => {
    it('수강신청 시 강의의 정원감소, 학생의 학점차감, 등록내역 생성이 진행된다.', () => {
      // given
      const course = new Course({ ...courseProps });
      const student = new Student({ ...studentProps });

      const initialCapacity = course.availableCapacity;
      const initialCredit = student.availableCredits;

      // when
      course.register(student);

      // then
      expect(course.availableCapacity).toBe(initialCapacity - 1);
      expect(student.availableCredits).toBe(initialCredit - course.credit);
      expect(student.enrollments.length).toBe(1);
    });
  });

  describe('수강취소', () => {
    it('수강취소 시 등록의 상태변경, 학생의 학점 복구, 강의의 정원이 복구되어야 한다.', () => {
      // given
      const course = new Course({ ...courseProps });
      const student = new Student({ ...studentProps });
      const enrollment = new Enrollment({ student, course });

      const initialCredit = student.availableCredits;
      const initialCapacity = course.availableCapacity;

      // when
      enrollment.cancel(student);

      // then
      expect(enrollment.status).toBe(EnrollmentStatus.CANCELLED);
      expect(student.availableCredits).toBe(initialCredit + course.credit);
      expect(course.availableCapacity).toBe(initialCapacity + 1);
    });
  });
});
