import { Lecture } from './Lecture';
import { Term } from './Term';
import { Student } from './user/Student';

export enum enrollmentStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  GRADED = 'GRADED',
}

type enrollmentProps = {
  lecture: Lecture;
  student: Student;
  term: Term;
  status: enrollmentStatus;
  grade?: number;
};

export class Enrollment {
  /** Enrollment 배열 */
  private static enrollments: Enrollment[] = [];

  constructor(readonly props: enrollmentProps) {}

  /** 등록 생성 */
  static create(lecture: Lecture, student: Student, term: Term): Enrollment {
    if (lecture.isStatusClosed) throw new Error('강의가 닫혔습니다.');
    if (lecture.isStatusPull) throw new Error('강의가 만석입니다.');

    /** 강의 정원 감소 */
    lecture.decreaseCapacity();

    return new Enrollment({
      lecture,
      student,
      term,
      status: enrollmentStatus.CONFIRMED,
    });
  }

  /** 등록 취소 */
  static cancelStatus(lecture: Lecture, student: Student): Enrollment {
    /** 등록 강의 확인 */
    const enrollment = Enrollment.findEnrollment(lecture, student);
    if (!enrollment) throw new Error('등록된 강의가 없습니다.');

    /** 강의 상태 확인 */
    if (enrollment.status === enrollmentStatus.CANCELED) {
      throw new Error('이미 취소된 강의입니다.');
    }

    /** 강의 정원 증가(복구) */
    enrollment.props.lecture.increaseCapacity();

    /** 상태 변경 */
    enrollment.props.status = enrollmentStatus.CANCELED;
    return enrollment;
  }

  /** 성적 입력 */
  setGrade(grade: number): void {
    if (!this.props.term.isGradeSubmissionOpen()) {
      throw new Error('현재는 성적 입력 기간이 아닙니다.');
    }
    if (this.props.status === enrollmentStatus.CANCELED) {
      throw new Error('취소된 강의에는 성적을 입력할 수 없습니다.');
    }
    this.props.grade = grade;
    this.props.status = enrollmentStatus.GRADED;
  }

  get status(): enrollmentStatus {
    return this.props.status;
  }

  /** 단일 Enrollment 조회 */
  static findEnrollment(
    lecture: Lecture,
    student: Student,
  ): Enrollment | undefined {
    return Enrollment.enrollments.find(
      (enrollment) =>
        enrollment.props.student === student &&
        enrollment.props.lecture === lecture,
    );
  }

  /** 특정 학기의 모든 Enrollment 조회 */
  static findByTerm(term: Term): Enrollment[] {
    return Enrollment.enrollments.filter(
      (enrollment) => enrollment.props.term === term,
    );
  }

  /** 특정 학생의 모든 Enrollment 조회 */
  static findByStudent(student: Student): Enrollment[] {
    return Enrollment.enrollments.filter(
      (enrollment) => enrollment.props.student === student,
    );
  }

  /** 특정 강의의 모든 Enrollment 조회 */
  static findByLecture(lecture: Lecture): Enrollment[] {
    return Enrollment.enrollments.filter(
      (enrollment) => enrollment.props.lecture === lecture,
    );
  }

  isGraded(): boolean {
    return this.props.status === enrollmentStatus.GRADED;
  }
}
