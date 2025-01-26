import { ErrorCodes, InvalidException } from './exception';
import { Lecture } from './lecture';

export const EnrollmentStatus = {
  REGISTERED: 'REGISTERED',
  CANCELLED: 'CANCELLED',
} as const;

export type EnrollmentStatus =
  (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

export type EnrollmentProps = {
  readonly lectureId: string;
  readonly status: EnrollmentStatus;
};

export class Enrollment {
  readonly lectureId: string;
  #status: EnrollmentStatus;

  private constructor(lectureId: string) {
    this.lectureId = lectureId;
    this.#status = EnrollmentStatus.REGISTERED;
  }

  static enroll(lecture: Lecture): Enrollment {
    lecture.decreaseCapacity();

    return new Enrollment(lecture.id);
  }

  cancel(lecture: Lecture) {
    if (this.status === EnrollmentStatus.CANCELLED) {
      throw new InvalidException(ErrorCodes.Enrollment.ALREADY_CANCELLED);
    }

    lecture.increaseCapacity();

    this.#status = EnrollmentStatus.CANCELLED;
  }

  get status() {
    return this.#status;
  }
}
