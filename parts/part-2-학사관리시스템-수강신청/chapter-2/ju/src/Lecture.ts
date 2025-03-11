import { Professor } from './user/Professor';

export enum LectureType {
  /** 전공 필수 */
  MAJOR_REQUIRED = 'MAJOR_REQUIRED',
  /** 전공 선택 */
  MAJOR_ELECTIVE = 'MAJOR_ELECTIVE',
  /** 교양 필수 */
  GENERAL_REQUIRED = 'GENERAL_REQUIRED',
  /** 교양 선택 */
  GENERAL_ELECTIVE = 'GENERAL_ELECTIVE',
}

export enum DayOfWeek {
  MONDAY = '월요일',
  TUESDAY = '화요일',
  WEDNESDAY = '수요일',
  THURSDAY = '목요일',
  FRIDAY = '금요일',
}

type TimeList = {
  /** 강의 시작시간 */
  startTime: string;
  /** 강의 종료시간 */
  endTime: string;
  /** 요일 */
  dayOfWeek: DayOfWeek;
};

type LectureProps = {
  id: string;
  /** 담당교수 */
  professor: Professor;
  /** 강의실 */
  roomNumber: number;
  /** 학점 */
  credits: number;
  /** 강의구분 */
  type: LectureType;
  /** 강의 시간 */
  timeLists: TimeList[];
  /** 최대인원 */
  maxCapacity: number;
  /** 현재인원 */
  remainCapacity: number;
};

export class Lecture {
  constructor(readonly props: LectureProps) {}

  increaseCapacity(): void {
    if (this.props.remainCapacity >= this.props.maxCapacity) {
      throw new Error('강의인원을 초과했습니다.');
    }
    this.props.remainCapacity++;
  }

  decreaseCapacity(): void {
    if (this.props.remainCapacity === 0) {
      throw new Error('강의 인원이 없습니다.');
    }
    this.props.remainCapacity--;
  }

  get getId(): string {
    return this.props.id;
  }

  get getType(): LectureType {
    return this.props.type;
  }

  get maxCapacity(): number {
    return this.props.maxCapacity;
  }

  get remainCapaticy(): number {
    return this.props.remainCapacity;
  }

  get timeLists(): TimeList[] {
    return this.props.timeLists;
  }

  get credits(): number {
    return this.props.credits;
  }
}
