import { randomUUID } from 'crypto';
import { Values } from '../type';
import { ErrorCodes, InvalidException } from './exception';
import { TimeSlot } from './time-slot';

export const CourseType = {
  Required: {
    Major: '전공필수',
    Ge: '교양필수',
  },
  Elective: {
    Major: '전공선택',
    Ge: '교양선택',
  },
} as const;

export type CourseType = Values<{
  [K in keyof typeof CourseType]: Values<(typeof CourseType)[K]>;
}>;

export type LectureProps = {
  readonly id: string;
  readonly name: string;
  readonly credits: number;
  readonly professorId: string;
  readonly courseType: CourseType;
  readonly capacity: number;
  readonly timeSlots: TimeSlot[];
};

export class Lecture {
  readonly id: string;
  readonly name: string;
  readonly credits: number;
  readonly professorId: string;
  readonly courseType: CourseType;
  readonly timeSlots: TimeSlot[];
  #capacity: number;

  constructor(props: Omit<LectureProps, 'id' | 'timeSlots'>) {
    this.#validateProps(props);

    this.id = randomUUID();
    this.timeSlots = [];
    this.name = props.name;
    this.credits = props.credits;
    this.professorId = props.professorId;
    this.courseType = props.courseType;
    this.#capacity = props.capacity;
  }

  decreaseCapacity(): this {
    if (this.#capacity === 0) {
      throw new InvalidException(ErrorCodes.Lecture.INVALID_CAPACITY);
    }

    this.#capacity--;

    return this;
  }

  increaseCapacity(): this {
    this.#capacity++;

    return this;
  }

  get capacity() {
    return this.#capacity;
  }

  #validateProps(props: Omit<LectureProps, 'id' | 'timeSlots'>) {
    if (props.credits < 1) {
      throw new InvalidException(ErrorCodes.Lecture.INVALID_CREDITS);
    } else if (props.capacity < 0) {
      throw new InvalidException(ErrorCodes.Lecture.INVALID_CAPACITY);
    }
  }
}
