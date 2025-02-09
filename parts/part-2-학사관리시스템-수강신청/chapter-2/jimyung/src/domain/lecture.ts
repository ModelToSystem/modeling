import { randomUUID } from 'crypto';
import { Values } from '../type';
import { ErrorCodes, InvalidException } from './exception';
import { TimeSlot } from './time-slot';

// 전공/교양 분리
const CourseCategory = {
  Major: '전공',
  Ge: '교양',
} as const;

// 필수/선택 분리
const CourseRequirement = {
  Required: '필수',
  Elective: '선택',
} as const;

// 조합 타입 생성
export const CourseType = {
  RequiredMajor: `${CourseCategory.Major}${CourseRequirement.Required}`,
  RequiredGe: `${CourseCategory.Ge}${CourseRequirement.Required}`,
  ElectiveMajor: `${CourseCategory.Major}${CourseRequirement.Elective}`,
  ElectiveGe: `${CourseCategory.Ge}${CourseRequirement.Elective}`,
} as const;

type CourseType = Values<typeof CourseType>;

type LectureProps = {
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

  decreaseCapacity(capacity: number = 1): this {
    if (capacity <= 0 || this.#capacity < capacity) {
      throw new InvalidException(ErrorCodes.Lecture.INVALID_CAPACITY);
    }

    this.#capacity -= capacity;

    return this;
  }

  increaseCapacity(capacity: number = 1): this {
    this.#capacity += capacity;

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
