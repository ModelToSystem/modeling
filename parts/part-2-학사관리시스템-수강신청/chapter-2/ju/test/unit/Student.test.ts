import { DayOfWeek, enrollmentStatus, Lecture, LectureType } from '../../src';
import { Professor, Student } from '../../src/user';

describe('Student', () => {
  let student: Student;
  let lecture: Lecture;
  let lecture2: Lecture;
  let lecture3: Lecture;
  let enrollLecture;
  let cancelLecture;
  let cancelLecture2;
  const props = {
    id: '1',
    professor: new Professor({ userId: '1', name: '교수' }),
    roomNumber: 1,
    credits: 7,
    type: LectureType.Major,
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
      currentCredits: 10,
      enrollments: new Map(),
    });

    lecture = new Lecture({ ...props });

    lecture2 = new Lecture({ ...props, id: '2' });
    lecture3 = new Lecture({ ...props, id: '2', credits: 3 });

    enrollLecture = student.enrollLecture(lecture);
    cancelLecture = student.enrollLecture(lecture2);
    cancelLecture2 = student.cancelLecture(lecture3);
  });

  describe('등록 객체 생성 명령한다.', () => {
    it('✅ 강의를 등록하면 상태값이 CONFIRMED로 추가된다.', () => {
      expect(enrollLecture.status).toBe(enrollmentStatus.CONFIRMED);
    });
    it('✅ 강의를 등록하면 강의의 정원이 감소한다.', () => {
      const remainCapacity = enrollLecture.props.lecture.props.remainCapacity;

      expect(remainCapacity).toBe(9);
    });
  });
  describe('등록 객체 취소 명령한다.', () => {
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
  describe('등록 객체 생성, 취소시 보유학점이 증가, 감소한다..', () => {
    it('✅ currentCredits를 계산한다.', () => {
      const currentCredits = enrollLecture.props.student.currentCredits;

      /** 10 + 7 + 7 - 3 */
      expect(currentCredits).toBe(21);
    });
  });
});
