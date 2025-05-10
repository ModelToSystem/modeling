import { AbstractDomain } from './AbstractDomain';

export type LectureScheduleProps = {
  id: string;
  /** 요일 */
  dayOfWeek: string;
  /** 시작 시간 */
  startTime: string;
  /** 종료 시간 */
  endTime: string;
  /** 강의실 */
  classroom: string;
};

/** 강의 일정 */
export class LectureSchedule extends AbstractDomain {
  constructor(private props: LectureScheduleProps) {
    super();
  }

  /** 강의 일정 ID */
  get id(): string {
    return this.props.id;
  }
  /** 요일 */
  get dayOfWeek(): string {
    return this.props.dayOfWeek;
  }
  /** 시작 시간 */
  get startTime(): string {
    return this.props.startTime;
  }
  /** 종료 시간 */
  get endTime(): string {
    return this.props.endTime;
  }
  /** 강의실 */
  get classroom(): string {
    return this.props.classroom;
  }
}
