import {
  DayOfWeek,
  Enrollment,
  enrollmentStatus,
  Lecture,
  LectureType,
  Term,
} from '../../src';
import { Professor, Student } from '../../src/user';

describe('Student', () => {
  let student: Student;
  let term: Term;
  let lecture: Lecture;
  let lecture2: Lecture;
  let enrollLecture: Enrollment;
  let cancelLecture: Enrollment;
  const props = {
    id: '1',
    professor: new Professor({ userId: '1', name: '교수' }),
    roomNumber: 1,
    credits: 7,
    type: LectureType.MAJOR_REQUIRED,
    required: true,
    timeLists: [
      { startTime: '13:00', endTime: '15:00', dayOfWeek: DayOfWeek.FRIDAY },
      {
        startTime: '13:00',
        endTime: '15:00',
        dayOfWeek: DayOfWeek.WEDNESDAY,
      },
      { startTime: '13:00', endTime: '15:00', dayOfWeek: DayOfWeek.MONDAY },
    ],
    maxCapacity: 30,
    remainCapacity: 10,
  };

  beforeEach(() => {
    student = new Student({
      userId: '1',
      name: 'Ju',
      currentCredits: new Map(),
      enrollments: new Map(),
    });

    term = new Term({
      id: '1',
      title: '2025-spring',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-06-30'),
      enrollmentPeriod: {
        start: new Date('2025-03-10'),
        end: new Date('2025-03-28'),
      },
      gradeSubmissionPeriod: {
        start: new Date('2025-03-01'),
        end: new Date('2025-07-10'),
      },
    });

    lecture = new Lecture({ ...props });
    lecture2 = new Lecture({ ...props, id: '2' });
    // lecture3 = new Lecture({ ...props, id: '3', credits: 3 });

    enrollLecture = student.enrollLecture(lecture, term);
    cancelLecture = student.enrollLecture(lecture2, term);
    student.cancelLecture(lecture2);
  });

  describe('등록 객체 생성', () => {
    it('✅ 강의를 등록하면 상태값이 CONFIRMED로 추가된다.', () => {
      expect(enrollLecture.status).toBe(enrollmentStatus.CONFIRMED);
    });
    it('✅ 강의를 등록하면 강의의 정원이 감소한다.', () => {
      const remainCapacity = enrollLecture.props.lecture.props.remainCapacity;
      expect(remainCapacity).toBe(9);
    });
    it('✅ 특정 학기의 수강 내역을 조회할 수 있다.', () => {
      const enrollments = student.getEnrollmentsByTerm(term);
      expect(enrollments.length).toBe(2);
      expect(enrollments[0].props.lecture.getId).toBe(lecture.getId);
      expect(enrollments[1].props.lecture.getId).toBe(lecture2.getId);
    });
  });

  describe('등록 객체 취소', () => {
    it('❌ 등록 강의가 없는 경우 에러를 반환한다.', () => {
      const undefinedLecture = new Lecture({ ...props, id: '4' });
      expect(() => student.cancelLecture(undefinedLecture)).toThrow(
        '등록된 강의가 없습니다.',
      );
    });

    it('✅ 취소시 상태값이 CANCELED로 바뀐다.', () => {
      expect(cancelLecture.status).toBe(enrollmentStatus.CANCELED);
    });
  });

  describe('학점 계산', () => {
    it('✅ 특정 학기의 수강 신청 학점을 조회한다.', () => {
      const currentCredits = student.getCurrentCreditsByTerm(term);
      expect(currentCredits[LectureType.MAJOR_REQUIRED]).toBe(7);
    });

    it('✅ 특정 학기의 이수 완료 학점을 조회한다.', () => {
      enrollLecture.setGrade(95);
      const completedCredits = student.getCompletedCreditsByTerm(term);
      expect(completedCredits[LectureType.MAJOR_REQUIRED]).toBe(7);
    });

    it('✅ 등록 객체 생성, 취소 시 보유 학점이 증가, 감소한다.', () => {
      const currentCredits = student.getCurrentCreditsByTerm(term);
      /** 7 + 7 - 3 */
      expect(currentCredits[LectureType.MAJOR_REQUIRED]).toBe(7);
    });
  });
});
