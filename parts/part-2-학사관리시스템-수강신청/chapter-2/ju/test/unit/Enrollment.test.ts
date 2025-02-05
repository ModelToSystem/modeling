import {
  DayOfWeek,
  Enrollment,
  enrollmentStatus,
  Lecture,
  LectureType,
} from '../../src';
import { Professor, Student } from '../../src/user';

describe('Enrollment', () => {
  let lecture: Lecture;
  let student: Student;

  beforeEach(() => {
    lecture = new Lecture({
      id: '1',
      professor: new Professor({ userId: '1', name: '교수' }),
      roomNumber: 1,
      credits: 7,
      type: LectureType.Major,
      required: true,
      timeLists: [
        { startTime: '13:00', endTime: '15:00', dayOfWeek: DayOfWeek.FRIDAY },
      ],
      maxCapacity: 30,
      remainCapacity: 10,
    });

    student = new Student({
      userId: '1',
      name: 'Ju',
      currentCredits: 10,
      enrollments: new Map([]),
    });
  });

  describe('등록 객체를 생성한다.', () => {
    it('✅ 강의 정원이 감소해야 한다.', () => {
      const enrollment = Enrollment.create(lecture, student);
      const remainCapacity = enrollment.props.lecture.remainCapaticy;

      expect(remainCapacity).toBe(9);
    });
  });

  describe('등록 객체의 취소한다.', () => {
    it('✅  강의 취소 시 상태가 CANCELED로 변경되고 정원이 복구되어야 한다.', () => {
      const enrollment = Enrollment.create(lecture, student);

      expect(enrollment.status).toBe(enrollmentStatus.CONFIRMED);
      expect(lecture.props.remainCapacity).toBe(9);

      enrollment.cancelStatus(lecture);

      expect(enrollment.status).toBe(enrollmentStatus.CANCELED);
      expect(lecture.props.remainCapacity).toBe(10);
    });

    it('❌ 상태값이 이미 CANCELED면 에러를 반환한다.', () => {
      const enrollment = Enrollment.create(lecture, student);
      enrollment.cancelStatus(lecture);

      expect(() => enrollment.cancelStatus(lecture)).toThrow(
        '이미 취소상태인 강의입니다.',
      );
    });
  });
});
