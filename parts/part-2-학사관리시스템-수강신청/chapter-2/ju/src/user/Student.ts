import { Enrollment } from '../Enrollment';
import { Lecture, LectureType } from '../Lecture';
import { Term } from '../Term';
import { User } from './User';

type StudentProps = {
  userId: string;
  name: string;
  /** 학기별 신청 학점 */
  currentCredits: Map<string, Record<LectureType, number>>;
};

export class Student implements User {
  constructor(readonly props: StudentProps) {}

  /** 등록 객체 생성 명령 */
  enrollLecture(lecture: Lecture, term: Term): Enrollment {
    /** 신청 기간 확인 */
    if (!term.isEnrollmentOpen())
      throw new Error('현재 학기의 수강 신청 기간이 아닙니다.');

    /** 등록 객체 생성 */
    const enrollment = Enrollment.create(lecture, this, term);

    /** 학기 내 학점 확인 */
    const termId = term.getId;
    const currentCredits = this.props.currentCredits.get(termId) || {
      [LectureType.MAJOR_REQUIRED]: 0,
      [LectureType.MAJOR_ELECTIVE]: 0,
      [LectureType.GENERAL_REQUIRED]: 0,
      [LectureType.GENERAL_ELECTIVE]: 0,
    };
    currentCredits[lecture.getType] += lecture.credits;
    this.props.currentCredits.set(termId, currentCredits);

    return enrollment;
  }

  /** 등록 객체 취소 명령 */
  cancelLecture(lecture: Lecture): void {
    const enrollment = Enrollment.cancelStatus(lecture, this);
    const termId = enrollment.props.term.getId;
    const currentCredits = this.props.currentCredits.get(termId);

    if (currentCredits) {
      currentCredits[lecture.getType] = Math.max(
        0,
        currentCredits[lecture.getType] - lecture.credits,
      );
      this.props.currentCredits.set(termId, currentCredits);
    }
  }

  /** 특정 학기의 수강 내역 조회 */
  // getEnrollmentsByTerm(term: Term): Enrollment[] {
  //   return Array.from(this.props.enrollments.values()).filter(
  //     (enrollment) => enrollment.props.term.props.title === term.props.title,
  //   );
  // }

  /** 특정 학기의 수강 완료 학점 조회 */
  getCurrentCreditsByTerm(term: Term): Record<LectureType, number> {
    return (
      this.props.currentCredits.get(term.getId) || {
        [LectureType.MAJOR_REQUIRED]: 0,
        [LectureType.MAJOR_ELECTIVE]: 0,
        [LectureType.GENERAL_REQUIRED]: 0,
        [LectureType.GENERAL_ELECTIVE]: 0,
      }
    );
  }

  /** 특정 학기의 이수 완료 학점 조회 */
  getCompletedCreditsByTerm(term: Term): Record<LectureType, number> {
    const completedCredits: Record<LectureType, number> = {
      [LectureType.MAJOR_REQUIRED]: 0,
      [LectureType.MAJOR_ELECTIVE]: 0,
      [LectureType.GENERAL_REQUIRED]: 0,
      [LectureType.GENERAL_ELECTIVE]: 0,
    };

    /** 현재 학생의 등록 데이터를 가져옴 */
    const studentEnrollments = Enrollment.findByStudent(this);

    studentEnrollments.forEach((enrollment) => {
      if (enrollment.props.term.getId === term.getId && enrollment.isGraded()) {
        completedCredits[enrollment.props.lecture.getType] +=
          enrollment.props.lecture.credits;
      }
    });

    return completedCredits;
  }
}
