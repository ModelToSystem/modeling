import { Student } from './student';

export type CourseProps = {
  id: string;
  capacity: number;
  availableCapacity: number;
  credit: number;
};

export class Course {
  constructor(private props: CourseProps) {}

  register(student: Student) {
    this.decreaseAvailableCapacity();
    student.deductCredits(this);
  }

  decreaseAvailableCapacity() {
    if (this.availableCapacity <= 0) {
      throw new Error('정원이 마감되었습니다.');
    }
    this.props.availableCapacity--;
  }

  increaseAvailableCapacity() {
    if (this.availableCapacity >= this.capacity) {
      throw new Error('수강 가능 인원수가 최대 정원수보다 큽니다.');
    }
    this.props.availableCapacity++;
  }

  get capacity(): number {
    return this.props.capacity;
  }

  get availableCapacity(): number {
    return this.props.availableCapacity;
  }

  get credit(): number {
    return this.props.credit;
  }
}
