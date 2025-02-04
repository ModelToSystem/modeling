import { Course } from './course';
import { Enrollment } from './enrollment';

export type StudentProps = {
  id: string;
  maxCredits: number;
  availableCredits: number;
};
export class Student {
  #enrollments: Enrollment[] = [];

  constructor(private props: StudentProps) {}

  deductCredits(course: Course) {
    if (this.props.availableCredits < course.credit) {
      throw new Error('수강신청 가능한 학점을 초과했습니다.');
    }

    this.props.availableCredits -= course.credit;

    const enrollment = new Enrollment({ course, student: this });
    this.#enrollments.push(enrollment);
  }

  addCredits(course: Course) {
    const addedCredit = this.props.availableCredits + course.credit;

    if (this.props.maxCredits < addedCredit) {
      throw new Error('최대학점을 넘을 수 없습니다.');
    }
    this.props.availableCredits = addedCredit;

    course.increaseAvailableCapacity();
  }
  get availableCredits(): number {
    return this.props.availableCredits;
  }

  get enrollments(): Enrollment[] {
    return this.#enrollments;
  }
}
