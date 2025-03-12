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
  constructor(readonly props: enrollmentProps) {}

  static create(lecture: Lecture, student: Student, term: Term): Enrollment {
    const status = enrollmentStatus.CONFIRMED;
    /** 강의 정원 감소 */
    lecture.decreaseCapacity();
    return new Enrollment({ lecture, student, term, status });
  }

  cancelStatus(lecture: Lecture): void {
    const status = enrollmentStatus.CANCELED;
    if (this.props.status === status) {
      throw new Error('이미 취소상태인 강의입니다.');
    }
    /** 강의 정원 증가(복구) */
    lecture.increaseCapacity();

    /** 상태 변경 */
    this.props.status = status;
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

  isGraded(): boolean {
    return this.props.status === enrollmentStatus.GRADED;
  }
}
