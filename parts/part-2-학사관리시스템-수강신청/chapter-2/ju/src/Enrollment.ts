import { Lecture } from './Lecture';
import { Term } from './Term';
import { Student } from './user/Student';

export enum enrollmentStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

type enrollmentProps = {
  lecture: Lecture;
  student: Student;
  term: Term;
  status: enrollmentStatus;
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

  get status(): enrollmentStatus {
    return this.props.status;
  }
}
