type UserProps = {
  userId: string;
  name: string;
};

export class User {
  constructor(readonly props: UserProps) {}
}
