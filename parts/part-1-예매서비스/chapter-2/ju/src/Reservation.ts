export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

type ReservationProps = {
  reservationId: string;
  userId: string;
  restaurantId: string;
  scheduleId: string;
  reservationTime: Date;
  status: ReservationStatus;
};

export class Reservation {
  constructor(readonly props: ReservationProps) {}

  cancel(): void {
    if (this.props.status === ReservationStatus.CONFIRMED) {
      this.props.status = ReservationStatus.CANCELED;
      console.log(
        `reservationId: ${this.props.reservationId} 의 예약이 취소되었습니다.`,
      );
    } else {
      throw new Error('CONFIRMED 상태에서만 예약이 취소 가능합니다.');
    }
  }

  get reservationId(): string {
    return this.props.reservationId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get scheduleId(): string {
    return this.props.scheduleId;
  }

  get status(): string {
    return this.props.status;
  }
}
