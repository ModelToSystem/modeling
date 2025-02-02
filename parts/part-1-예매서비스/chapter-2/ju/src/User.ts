type UserProps = {
  userId: string;
};

export class User {
  constructor(readonly props: UserProps) {}

  userIdConfirm(bookerInfo: User): void {
    if (this.props.userId !== bookerInfo.props.userId) {
      throw new Error('예약 취소 권한이 없습니다.');
    }
  }

  get userId(): string {
    return this.props.userId;
  }
}
