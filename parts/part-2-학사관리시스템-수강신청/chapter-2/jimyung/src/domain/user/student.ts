import { User } from '.';
import { Enrollment } from '../enrollment';
import { ErrorCodes, InvalidException } from '../exception';
import { Lecture } from '../lecture';

export class Student implements User {
  readonly id: string;
  #allowedCredits: number;
  #enrollments?: Map<string, Enrollment>;

  constructor(
    props: User & {
      allowedCredits: number;
      enrollments?: Map<string, Enrollment>;
    },
  ) {
    this.id = props.id;
    this.#allowedCredits = props.allowedCredits;
    this.#enrollments = props.enrollments ?? new Map();
  }

  apply(lecture: Lecture): Lecture {
    if (this.#allowedCredits < lecture.credits) {
      throw new InvalidException(ErrorCodes.Student.INSUFFICIENT_CREDITS);
    }

    const enrollment = Enrollment.enroll(this.id, lecture);

    this.#allowedCredits -= lecture.credits;
    this.#enrollments.set(lecture.id, enrollment);

    return lecture;
  }

  cancelApplication(lecture: Lecture): Lecture {
    const canceledEnrollment = this.#enrollments
      .get(lecture.id)
      .cancel(lecture);

    this.#enrollments.set(lecture.id, canceledEnrollment);
    this.#allowedCredits += lecture.credits;

    return lecture;
  }

  get allowedCredits() {
    return this.#allowedCredits;
  }

  get enrollments() {
    return this.#enrollments as ReadonlyMap<string, Enrollment>;
  }
}
