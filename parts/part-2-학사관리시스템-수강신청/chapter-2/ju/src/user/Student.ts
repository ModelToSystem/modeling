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

  /** 등록 객체 생성 명령 */
  enrollLecture(lecture: Lecture): Enrollment {
    this.props.currentCredits += lecture.credits;
    const enrollent = Enrollment.create(lecture, this);
    this.props.enrollments.set(lecture.getId, enrollent);

    return enrollent;
  }

  /** 등록 객체 취소 명령 */
  cancelLecture(lecture: Lecture): void {
    const enrollment = this.props.enrollments.get(lecture.getId);
    if (!enrollment) {
      throw new Error('등록된 강의가 없습니다.');
    }
    this.props.currentCredits -= lecture.credits;
    enrollment.cancelStatus(lecture);
  }

  get currentCredits(): number {
    return this.props.currentCredits;
  }

  get enrollments(): Map<string, Enrollment> {
    return this.props.enrollments;
  }
}
