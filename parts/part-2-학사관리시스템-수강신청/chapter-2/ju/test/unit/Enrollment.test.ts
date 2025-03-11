import {
  DayOfWeek,
  Enrollment,
  enrollmentStatus,
  Lecture,
  LectureType,
  Term,
} from '../../src';
import { Professor, Student } from '../../src/user';

describe('Enrollment', () => {
  let lecture: Lecture;
  let student: Student;
  let term: Term;

  beforeEach(() => {
    lecture = new Lecture({
      id: '1',
      professor: new Professor({ userId: '1', name: '교수' }),
      roomNumber: 1,
      credits: 7,
      type: LectureType.MAJOR_REQUIRED,
      timeLists: [
        { startTime: '13:00', endTime: '15:00', dayOfWeek: DayOfWeek.FRIDAY },
      ],
      maxCapacity: 30,
      remainCapacity: 10,
    });

    student = new Student({
      userId: '1',
      name: 'Ju',
      currentCredits: new Map([]),
      enrollments: new Map([]),
    });

    term = new Term({
      id: '1',
      title: '2025-spring',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-06-30'),
      enrollmentPeriod: {
        start: new Date('2025-02-10'),
        end: new Date('2025-02-28'),
      },
      gradeSubmissionPeriod: {
        start: new Date('2025-07-01'),
        end: new Date('2025-07-10'),
      },
    });
  });

  describe('등록 객체를 생성한다.', () => {
    it('✅ 강의 정원이 감소해야 한다.', () => {
      const enrollment = Enrollment.create(lecture, student, term);
      const remainCapacity = enrollment.props.lecture.remainCapaticy;

      expect(remainCapacity).toBe(9);
    });
  });

  describe('등록 객체의 취소한다.', () => {
    it('✅ 강의 취소 시 상태가 CANCELED로 변경되고 정원이 복구되어야 한다.', () => {
      const enrollment = Enrollment.create(lecture, student, term);

      expect(enrollment.status).toBe(enrollmentStatus.CONFIRMED);
      expect(lecture.props.remainCapacity).toBe(9);

      enrollment.cancelStatus(lecture);

      expect(enrollment.status).toBe(enrollmentStatus.CANCELED);
      expect(lecture.props.remainCapacity).toBe(10);
    });

    it('❌ 상태값이 이미 CANCELED면 에러를 반환한다.', () => {
      const enrollment = Enrollment.create(lecture, student, term);
      enrollment.cancelStatus(lecture);

      expect(() => enrollment.cancelStatus(lecture)).toThrow(
        '이미 취소상태인 강의입니다.',
      );
    });
  });
  describe('성적을 입력한다.', () => {
    it('❌ 성적 입력 기간이 아닐때 에러를 반환한다.', () => {
      const enrollment = Enrollment.create(lecture, student, term);

      expect(() => enrollment.setGrade(10)).toThrow(
        '현재는 성적 입력 기간이 아닙니다.',
      );
    });
    it('❌ 취소된 강의일 경우 에러를 반환한다.', () => {
      term = new Term({
        id: '1',
        title: '2025-spring',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-06-30'),
        enrollmentPeriod: {
          start: new Date('2025-02-10'),
          end: new Date('2025-02-28'),
        },
        gradeSubmissionPeriod: {
          start: new Date('2025-03-01'),
          end: new Date('2025-04-10'),
        },
      });
      const enrollment = Enrollment.create(lecture, student, term);
      enrollment.cancelStatus(lecture);

      expect(() => enrollment.setGrade(10)).toThrow(
        '취소된 강의에는 성적을 입력할 수 없습니다.',
      );
    });
    it('✅ 성적을 입력이 성공적일때 상태값은 GRADED로 바뀐다.', () => {
      term = new Term({
        id: '1',
        title: '2025-spring',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-06-30'),
        enrollmentPeriod: {
          start: new Date('2025-02-10'),
          end: new Date('2025-02-28'),
        },
        gradeSubmissionPeriod: {
          start: new Date('2025-03-01'),
          end: new Date('2025-04-10'),
        },
      });
      const enrollment = Enrollment.create(lecture, student, term);
      enrollment.setGrade(10);
      expect(enrollment.status).toBe(enrollmentStatus.GRADED);
    });
  });
});
