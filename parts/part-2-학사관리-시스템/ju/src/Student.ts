import { Enrollment } from './Enrollment';
import { User } from './User';

type StudentProps = {
  name: string;
  user: User;
  currentCredits: number;
  enrollments: Map<string, Enrollment>;
};

export class Student {
  constructor(readonly props: StudentProps) {}

  checkCredits(): void {}
  increaseCredits(): void {}
  decreaseCredits(): void {}
}
