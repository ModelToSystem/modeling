import { User } from './User';

type ProfessorProps = {
  name: string;
  user: User;
};

export class Professor {
  constructor(readonly props: ProfessorProps) {}
}
