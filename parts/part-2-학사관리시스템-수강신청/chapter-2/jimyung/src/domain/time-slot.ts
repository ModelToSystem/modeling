import { nanoid } from 'nanoid';
import { ErrorCodes, InvalidException } from './exception';

export const DayOfWeek = {
  MONDAY: '월요일',
  TUESDAY: '화요일',
  WEDNESDAY: '수요일',
  THURSDAY: '목요일',
  FRIDAY: '금요일',
} as const;

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];
export type Time = string & { __timeBrand: never };

export type TimeSlotProps = {
  readonly id: string;
  readonly lectureId: string;
  readonly dayOfWeek: DayOfWeek;
  readonly startTime: Time;
  readonly endTime: Time;
};

export class TimeSlot {
  readonly id: string;
  readonly lectureId: string;
  readonly dayOfWeek: DayOfWeek;
  readonly startTime: Time;
  readonly endTime: Time;

  constructor(props: Omit<TimeSlotProps, 'id'>) {
    this.#validateProps(props);

    this.id = nanoid();
    this.lectureId = props.lectureId;
    this.dayOfWeek = props.dayOfWeek;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
  }

  #validateProps(props: Omit<TimeSlotProps, 'id'>) {
    if (
      props.startTime >= props.endTime ||
      !this.#validateTime(props.startTime) ||
      !this.#validateTime(props.endTime)
    ) {
      throw new InvalidException(ErrorCodes.TimeSlot.INVALID_TIME_RANGE);
    }
  }

  #validateTime(time: Time): time is Time {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  }
}
