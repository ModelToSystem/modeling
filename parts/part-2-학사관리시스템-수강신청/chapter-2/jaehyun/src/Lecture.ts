import { AbstractDomain } from './AbstractDomain';
import { CreditType, SelectionType } from './credit/enum';
import { ConflictStatusException } from './exception';
import { LectureSchedule } from './LectureSchedule';

export enum LectureEnrollStatus {
  /** 신청예정 - 신청 기한 전 */
  EXPECTED = '신청예정',
  /** 신청기한 - 신청 기한 내에 있는 경우 */
  OPEN = '신청기한',
  /** 정원초과 - 신청 기한 내에 있지만 정원을 초과한 경우 */
  OVER_CAPACITY = '정원초과',
  /** 마감 - 신청 기한 종료 후 */
  CLOSED = '신청마감',
}

export type LectureProps = {
  id: string;
  /** 강의 이름 */
  name: string;
  /** 강의 교수 */
  professor: string;
  /** 학점 타입 */
  creditType: CreditType;
  /** 학점 선택 타입 */
  creditSelectionType: SelectionType;
  /** 학점 */
  credit: number;

  /** 강의 등록 상태 */
  enrollStatus: LectureEnrollStatus;
  /** 신청 시작일 */
  registrationStartAt: Date;
  /** 신청 종료일 */
  registrationEndAt: Date;

  /** 정원 */
  capacity: number;
  /** 현재 신청자 수 */
  currentEnrollment: number;
  /** 강의 시간표 */
  schedules: LectureSchedule[];
};

/**
 * 책임: 강의 클래스는 시간표, 등록상태, 정원을 관리한다.
 *
 * 모호한 정책
 * - 강의 상태와, 정원, 등록기간에 대한 정책을 보완해야 한다.
 * - 현재는 등록기간에 대한 내용을 러프하게 관리한다.
 */
export class Lecture extends AbstractDomain {
  private constructor(private props: LectureProps) {
    super();
  }

  static create(props: Omit<LectureProps, 'enrollStatus'>) {
    return new Lecture({
      ...props,
      enrollStatus: LectureEnrollStatus.EXPECTED,
    });
  }

  get id(): string {
    return this.props.id;
  }
  /** 강의 이름 */
  get name(): string {
    return this.props.name;
  }

  /** 강의 교수 */
  get professor(): string {
    return this.props.professor;
  }
  /** 학점 타입 */
  get creditType(): CreditType {
    return this.props.creditType;
  }
  /** 학점 */
  get credit(): number {
    return this.props.credit;
  }
  /** 학점 선택 타입 */
  get creditSelectionType(): SelectionType {
    return this.props.creditSelectionType;
  }

  /** 강의 등록 상태 */
  get enrollStatus(): LectureEnrollStatus {
    return this.props.enrollStatus;
  }
  /** 신청 시작일 */
  get registrationStartAt(): Date {
    return this.props.registrationStartAt;
  }
  /** 신청 종료일 */
  get registrationEndAt(): Date {
    return this.props.registrationEndAt;
  }

  /** 정원 */
  get capacity(): number {
    return this.props.capacity;
  }
  /** 현재 신청자 수 */
  get currentEnrollment(): number {
    return this.props.currentEnrollment;
  }
  /** 강의 시간표 */
  get schedules(): LectureSchedule[] {
    return this.props.schedules;
  }

  /**
   * 정원이 가득 찼는지 확인
   * @returns 정원이 가득 찼는지 여부
   */
  isFull(): boolean {
    return this.props.currentEnrollment >= this.props.capacity;
  }

  /**
   * 강의 오픈 가능한 상태인지 확인
   * @returns 강의 오픈 가능한 상태인지 여부
   */
  canOpen(): boolean {
    /** 정원초과 상태에서 잔여좌석이 있는 경우 오픈 가능 */
    const isCallCancel =
      this.props.enrollStatus === LectureEnrollStatus.OVER_CAPACITY &&
      !this.isFull();
    /** 신청예정 상태인 경우 오픈 가능 */
    const isExpected = this.props.enrollStatus === LectureEnrollStatus.EXPECTED;

    if (isCallCancel) return true;
    if (isExpected) return true;
    return false;
  }

  /**
   * 정원초과 처리 가능한 상태인지 확인
   * @returns 정원초과 처리 가능한 상태인지 여부
   */
  canFull(): boolean {
    return (
      this.props.enrollStatus === LectureEnrollStatus.OPEN && this.isFull()
    );
  }

  /**
   * 마감 가능한 상태인지 확인
   * @returns 마감 가능한 상태인지 여부
   */
  canClose(): boolean {
    return (
      this.props.enrollStatus === LectureEnrollStatus.OPEN ||
      this.props.enrollStatus === LectureEnrollStatus.OVER_CAPACITY
    );
  }

  /**
   * 수강신청 가능한 상태인지 확인
   * @returns 수강신청 가능한 상태인지 여부
   */
  canEnroll(): boolean {
    // TODO: 검증을 상태로만 해도 될까?
    return this.props.enrollStatus === LectureEnrollStatus.OPEN;
  }

  /**
   * 수강신청 취소 가능한 상태인지 확인
   * @returns 수강신청 취소 가능한 상태인지 여부
   */
  canCancel(): boolean {
    return (
      this.props.enrollStatus === LectureEnrollStatus.OPEN ||
      this.props.enrollStatus === LectureEnrollStatus.OVER_CAPACITY
    );
  }

  /**
   * 강의 오픈
   * @returns 오픈된 강의
   * @throws ConflictStatusException 오픈 할 수 없는 상태입니다.
   */
  open(): this {
    if (!this.canOpen()) {
      throw new ConflictStatusException(
        `오픈 할 수 없는 상태입니다.
        - 현재 상태: ${this.props.enrollStatus}
        - 오픈 가능한 상태: ${LectureEnrollStatus.EXPECTED}, 남은 자리가 있는 경우
        `,
      );
    }
    this.props.enrollStatus = LectureEnrollStatus.OPEN;
    return this;
  }

  /**
   * 정원초과 처리
   * @returns 정원초과 처리된 강의
   * @throws ConflictStatusException "정원초과" 상태로 변경 불가합니다.
   */
  full(): this {
    if (!this.canFull()) {
      throw new ConflictStatusException(
        `"정원초과" 상태로 변경 불가합니다.
          - 현재 상태: ${this.props.enrollStatus}
          - 가능한 상태: ${LectureEnrollStatus.OPEN}
          `,
      );
    }
    this.props.enrollStatus = LectureEnrollStatus.OVER_CAPACITY;
    return this;
  }

  /**
   * 강의 마감
   * @returns 마감된 강의
   * @throws ConflictStatusException 마감 할 수 없는 상태입니다.
   */
  close(): this {
    if (!this.canClose()) {
      throw new ConflictStatusException(
        `마감 할 수 없는 상태입니다.
        - 현재 상태: ${this.props.enrollStatus}
        - 가능한 상태: ${LectureEnrollStatus.OPEN}, ${LectureEnrollStatus.OVER_CAPACITY}
        `,
      );
    }
    this.props.enrollStatus = LectureEnrollStatus.CLOSED;
    return this;
  }

  /**
   * 수강신청 처리
   * @returns 수강신청 처리된 강의
   * @throws ConflictStatusException 수강신청 불가능한 상태입니다.
   */
  enroll(): Lecture {
    if (!this.canEnroll()) {
      throw new ConflictStatusException(
        `수강신청 불가능한 상태입니다.
        - 현재 상태: ${this.props.enrollStatus}
        - 가능한 상태: ${LectureEnrollStatus.OPEN}
        `,
      );
    }

    this.props.currentEnrollment++;
    if (this.isFull()) this.full();

    return this;
  }

  /**
   * 수강신청 취소 처리
   * @returns 수강신청 취소된 강의
   * @throws ConflictStatusException 수강신청 불가능한 상태입니다.
   * @throws ConflictStatusException 신청자가 없어 취소할 수 없습니다.
   */
  cancel(): Lecture {
    if (!this.canCancel()) {
      throw new ConflictStatusException(
        `수강신청 취소 불가능한 상태입니다.
        - 현재 상태: ${this.props.enrollStatus}
        - 가능한 상태: ${LectureEnrollStatus.OPEN}, ${LectureEnrollStatus.OVER_CAPACITY}
        `,
      );
    }

    if (this.props.currentEnrollment <= 0) {
      throw new ConflictStatusException(`신청자가 없어 취소할 수 없습니다.`);
    }

    const isBeforeFull = this.isFull();
    this.props.currentEnrollment--;
    if (isBeforeFull) this.open();

    return this;
  }
}
