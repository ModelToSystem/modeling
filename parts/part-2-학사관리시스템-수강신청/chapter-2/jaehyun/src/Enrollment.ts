import { Student } from './Student';
import { Lecture } from './Lecture';
import { AbstractDomain } from './AbstractDomain';
import { ConflictStatusException } from './exception';

export enum EnrollmentStatus {
  APPLIED = '신청완료',
  CANCELLED = '신청취소',
  IN_PROGRESS = '이수중',
  GRADE_PROCESSING = '성적처리중',
  COMPLETED = '이수완료',
}

export type EnrollmentProps = {
  id: string;
  /** 수강신청 상태 */
  status: EnrollmentStatus;
  /** 수강신청 등록일 */
  registeredAt: Date;
  /** 수강신청 취소일 */
  canceledAt?: Date;
  /** 강의 */
  lecture: Lecture;
  /** 학생 */
  student: Student;
};

export class Enrollment extends AbstractDomain {
  private constructor(private props: EnrollmentProps) {
    super();
  }

  get id(): string {
    return this.props.id;
  }
  get status(): EnrollmentStatus {
    return this.props.status;
  }
  get registeredAt(): Date {
    return this.props.registeredAt;
  }
  get canceledAt(): Date | undefined {
    return this.props.canceledAt;
  }
  get student(): Student {
    return this.props.student;
  }
  get lecture(): Lecture {
    return this.props.lecture;
  }

  /**
   * 수강신청 처리
   */
  static enroll(lecture: Lecture, student: Student): Enrollment {
    // 강의 등록
    lecture.enroll();
    // 학점 증가
    student.enroll({
      credit: lecture.credit,
      creditType: lecture.creditType,
      selectionType: lecture.creditSelectionType,
    });

    return new Enrollment({
      id: AbstractDomain.uuid(),
      status: EnrollmentStatus.APPLIED,
      registeredAt: new Date(),
      student,
      lecture,
    });
  }

  /**
   * 수강취소 처리
   */
  cancel(): this {
    if (this.status !== EnrollmentStatus.APPLIED)
      throw new ConflictStatusException('수강신청 취소 불가능한 상태입니다.');

    // 강의 취소
    this.lecture.cancel();

    // 학생 학점 감소
    this.student.cancel({
      credit: this.lecture.credit,
      creditType: this.lecture.creditType,
      selectionType: this.lecture.creditSelectionType,
    });

    this.props.status = EnrollmentStatus.CANCELLED;
    this.props.canceledAt = new Date();
    return this;
  }
}
