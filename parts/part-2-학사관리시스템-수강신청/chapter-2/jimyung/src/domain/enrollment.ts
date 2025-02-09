import { ErrorCodes, InvalidException } from './exception';
import { Lecture } from './lecture';

export const EnrollmentStatus = {
  REGISTERED: 'REGISTERED',
  CANCELLED: 'CANCELLED',
} as const;

type EnrollmentStatus =
  (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

type EnrollmentProps = {
  readonly userId: string;
  readonly lectureId: string;
  readonly status?: EnrollmentStatus;
};

export class Enrollment {
  readonly userId: string;
  readonly lectureId: string;
  readonly status: EnrollmentStatus;

  private constructor(props: EnrollmentProps) {
    this.userId = props.userId;
    this.lectureId = props.lectureId;
    this.status = props.status ?? EnrollmentStatus.REGISTERED;
  }

  static enroll(userId: string, lecture: Lecture): Enrollment {
    lecture.decreaseCapacity();

    return new Enrollment({ userId, lectureId: lecture.id });
  }

  cancel(lecture: Lecture): Enrollment {
    if (this.status === EnrollmentStatus.CANCELLED) {
      throw new InvalidException(ErrorCodes.Enrollment.ALREADY_CANCELLED);
    }

    lecture.increaseCapacity();

    return new Enrollment({
      userId: this.userId,
      lectureId: this.lectureId,
      status: EnrollmentStatus.CANCELLED,
    });
  }
}
