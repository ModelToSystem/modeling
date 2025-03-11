import { Enrollment } from '../Enrollment';
import { Lecture } from '../Lecture';
import { Term } from '../Term';
import { User } from './User';

type StudentProps = {
  userId: string;
  name: string;
  /** 현재 신청 학점 */
  currentCredits: number;
  /** 등록 강의 내역 */
  enrollments: Map<string, Enrollment>;
};

export class Student implements User {
  constructor(readonly props: StudentProps) {}

  /** 등록 객체 생성 명령 */
  enrollLecture(lecture: Lecture, term: Term): Enrollment {
    /** 신청 기간 확인 */
    if (!term.isEnrollmentOpen()) {
      throw new Error('현재 학기의 수강 신청 기간이 아닙니다.');
    }
    this.props.currentCredits += lecture.credits;
    const enrollent = Enrollment.create(lecture, this, term);
    this.props.enrollments.set(lecture.getId, enrollent);

    return enrollent;
  }

  /** 등록 객체 취소 명령 */
  cancelLecture(lecture: Lecture): void {
    const enrollment = this.props.enrollments.get(lecture.getId);
    if (!enrollment) {
      throw new Error('등록된 강의가 없습니다.');
    }
    enrollment.cancelStatus(lecture);
    this.props.currentCredits -= lecture.credits;
  }

  /** 특정 학기의 수강 내역 조회 */
  getEnrollmentsByTerm(term: Term): Enrollment[] {
    return Array.from(this.props.enrollments.values()).filter(
      (enrollment) => enrollment.props.term.props.title === term.props.title,
    );
  }

  get currentCredits(): number {
    return this.props.currentCredits;
  }

  get enrollments(): Map<string, Enrollment> {
    return this.props.enrollments;
  }
}
