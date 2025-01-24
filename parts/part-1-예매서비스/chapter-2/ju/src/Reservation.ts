import { Restaurant } from './Restaurant';
import { Schedule } from './Schedule';
import { User } from './User';

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

type ReservationProps = {
  reservationId: string;
  users: User[];
  bookerInfo: User;
  restaurant: Restaurant;
  schedule: Schedule;
  reservationTime: Date;
  status: ReservationStatus;
};

export class Reservation {
  constructor(readonly props: ReservationProps) {}

  cancel(): void {
    if (this.props.status !== ReservationStatus.CONFIRMED) {
      throw new Error('CONFIRMED 상태에서만 예약을 취소할 수 있습니다.');
    }
    // 예약 상태 변경
    this.props.status = ReservationStatus.CANCELED;
  }

  get reservationId(): string {
    return this.props.reservationId;
  }

  get users(): User[] {
    return this.props.users;
  }

  get bookerInfo(): User {
    return this.props.bookerInfo;
  }

  get restaurant(): Restaurant {
    return this.props.restaurant;
  }

  get schedule(): Schedule {
    return this.props.schedule;
  }

  get status(): ReservationStatus {
    return this.props.status;
  }
}
