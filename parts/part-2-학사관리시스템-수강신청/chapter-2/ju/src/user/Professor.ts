import { User } from './User';

type ProfessorProps = {
  userId: string;
  name: string;
};

export class Professor implements User {
  constructor(readonly props: ProfessorProps) {}
}
