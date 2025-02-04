import { Course } from './course';
import { Student } from './student';

export enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',
  CANCELLED = 'CANCELLED',
}

export type Props = {
  student: Student;
  course: Course;
};

export class Enrollment {
  #status: EnrollmentStatus;
  constructor(private props: Props) {
    this.#status = EnrollmentStatus.ENROLLED;
  }

  cancel(student: Student) {
    if (this.#status === EnrollmentStatus.CANCELLED) {
      throw new Error('이미 취소된 내역입니다.');
    }
    this.#status = EnrollmentStatus.CANCELLED;

    student.addCredits(this.course);
  }

  get status() {
    return this.#status;
  }

  get course() {
    return this.props.course;
  }
}
