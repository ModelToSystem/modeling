import { ProgressCredit, AcademicCredit, CreditTypeRecord } from './credit';

type LectureCreditInfo = CreditTypeRecord & {
  credit: number;
};

export type StudentProps = {
  id: string;
  name: string;
  /** 학부 */
  faculty: string;
  /** 학과 이름 */
  departmentName: string;
  /** 전공 */
  major: string;
  /** 이수완료 학점 */
  academicCredit: AcademicCredit;
  /** 이수중인 학점 */
  progressCredit: ProgressCredit;
};

/**
 * 책임: 학생 클래스는 자신의 학점을 관리한다.
 * - 수강 신청: 이수중인 학점을 증가시킨다.
 * - 수강 취소: 이수중인 학점을 감소시킨다.
 */
export class Student {
  constructor(private props: StudentProps) {}

  get id(): string {
    return this.props.id;
  }
  /** 이름 */
  get name(): string {
    return this.props.name;
  }
  /** 학부 */
  get faculty(): string {
    return this.props.faculty;
  }
  /** 학과 이름 */
  get departmentName(): string {
    return this.props.departmentName;
  }
  /** 전공 */
  get major(): string {
    return this.props.major;
  }

  /** 이수완료 학점 */
  get academicCredit(): AcademicCredit {
    return this.props.academicCredit;
  }

  /** 이수중인 학점 */
  get progressCredit(): ProgressCredit {
    return this.props.progressCredit;
  }

  /**
   * 수강신청 로직
   * @param lecture 신청할 강의
   * @returns
   */
  enroll(creditInfo: LectureCreditInfo): this {
    this.progressCredit.increaseCredits(creditInfo.credit, {
      creditType: creditInfo.creditType,
      selectionType: creditInfo.selectionType,
    });
    return this;
  }

  /**
   * 수강취소 로직
   * @param lecture 취소할 강의
   * @returns
   */
  cancel(creditInfo: LectureCreditInfo): this {
    this.progressCredit.decreaseCredits(creditInfo.credit, {
      creditType: creditInfo.creditType,
      selectionType: creditInfo.selectionType,
    });
    return this;
  }
}
