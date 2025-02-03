import { Enrollment } from '../Enrollment';
import { Lecture } from '../Lecture';
import { User } from './User';

type StudentProps = {
  userId: string;
  name: string;
  /** 현재 신청 학점 */
  currentCredits: number;
  /** 강의 시간표 */
  enrollments: Map<string, Enrollment>;
};

export class Student implements User {
  constructor(readonly props: StudentProps) {}

  enrollLecture(lecture: Lecture): Enrollment {
    /** 등록 객체 생성 명령 */
    const enrollent = Enrollment.create(lecture, this);
    this.props.currentCredits + lecture.credits;
    this.props.enrollments.set(lecture.getId, enrollent);

    return enrollent;
  }

  cancelLecture(lecture: Lecture): void {
    const enrollment = this.props.enrollments.get(lecture.getId);
    /** 강의 취소 명령 */
    enrollment.cancelStatus(lecture);
    this.props.currentCredits - lecture.credits;
  }

  get currentCredits(): number {
    return this.props.currentCredits;
  }
}
