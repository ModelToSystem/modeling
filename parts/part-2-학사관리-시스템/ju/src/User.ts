type UserProps = {
  userId: string;
};

export class User {
  constructor(readonly props: UserProps) {}

  get userId(): string {
    return this.props.userId;
  }
}
