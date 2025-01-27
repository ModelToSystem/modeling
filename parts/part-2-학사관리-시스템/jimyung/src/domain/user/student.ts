import { User } from '.';
import { Enrollment } from '../enrollment';
import { ErrorCodes, InvalidException } from '../exception';
import { Lecture } from '../lecture';

export class Student implements User {
  readonly id: string;
  #allowedCredits: number;
  #enrollments: Map<string, Enrollment>;

  constructor(props: User & { allowedCredits: number }) {
    this.id = props.id;
    this.#allowedCredits = props.allowedCredits;
    this.#enrollments = new Map();
  }

  apply(lecture: Lecture): Enrollment {
    if (this.#allowedCredits < lecture.credits) {
      throw new InvalidException(ErrorCodes.Student.INSUFFICIENT_CREDITS);
    }

    const enrollment = Enrollment.enroll(lecture);
    this.#allowedCredits -= lecture.credits;
    this.#enrollments.set(lecture.id, enrollment);

    return enrollment;
  }

  cancelApplication(lecture: Lecture) {
    const enrollment = this.#enrollments.get(lecture.id);
    enrollment.cancel(lecture);

    this.#allowedCredits += lecture.credits;
  }

  get allowedCredits() {
    return this.#allowedCredits;
  }
}
