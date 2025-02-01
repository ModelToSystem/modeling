import { Lecture } from './Lecture';
import { Student } from './Student';

export enum enrollmentStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

type enrollmentProps = {
  lecture: Lecture;
  student: Student;
  status: enrollmentStatus;
};

export class Enrollment {
  constructor(readonly props: enrollmentProps) {}

  cancelStatus(): void {}
}
