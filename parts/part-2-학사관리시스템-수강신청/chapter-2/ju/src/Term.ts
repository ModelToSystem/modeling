type TermProps = {
  id: string;
  /** 학기명 **/
  title: string;
  /** 학기 시작일 **/
  startDate: Date;
  /** 학기 종료일 **/
  endDate: Date;
  /** 수강 신청 기간 **/
  enrollmentPeriod: { start: Date; end: Date };
  /** 성적 입력 기간 **/
  gradeSubmissionPeriod: { start: Date; end: Date };
};

export class Term {
  constructor(readonly props: TermProps) {}

  get getId(): string {
    return this.props.id;
  }

  get getTitle(): string {
    return this.props.title;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date {
    return this.props.endDate;
  }

  get enrollmentPeriod(): { start: Date; end: Date } {
    return this.props.enrollmentPeriod;
  }

  get gradeSubmissionPeriod(): { start: Date; end: Date } {
    return this.props.gradeSubmissionPeriod;
  }

  /** 등록 기간 확인 */
  isEnrollmentOpen(): boolean {
    const now = new Date();
    return (
      now >= this.props.enrollmentPeriod.start &&
      now <= this.props.enrollmentPeriod.end
    );
  }

  /** 성적 입력 기간 확인 */
  isGradeSubmissionOpen(): boolean {
    const now = new Date();
    return (
      now >= this.props.gradeSubmissionPeriod.start &&
      now <= this.props.gradeSubmissionPeriod.end
    );
  }
}
