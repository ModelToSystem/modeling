import { Professor } from './user/Professor';

export enum LectureType {
  전공 = '전공',
  교양 = '교양',
}

export enum DayOfWeek {
  MONDAY = '월요일',
  TUESDAY = '화요일',
  WEDNESDAY = '수요일',
  THURSDAY = '목요일',
  FRIDAY = '금요일',
}

type TimeList = {
  startTime: Date;
  endTime: Date;
  dayOfWeek: DayOfWeek;
};

type LectureProps = {
  professor: Professor;
  roomNumber: number;
  credits: number;
  type: LectureType;
  required: boolean;
  timeLists: TimeList[];
  maxCapacity: number;
  remainCapacity: number;
};

export class Lecture {
  constructor(readonly props: LectureProps) {}

  increaseCapacity(): void {}
  decreasePersonnel(): void {}
  availableCapacity(): void {}
}
