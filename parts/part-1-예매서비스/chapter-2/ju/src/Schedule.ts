import { Restaurant } from './Restaurant';

export type ScheduleProps = {
  scheduleId: string;
  date: string;
  time: string;
  restaurant: Restaurant;
  /** 예약 인원 */
  totalCapacity: number;
  /** 잔여 인원 */
  remain: number;
};

type ResertvInfo = {
  /** 예약자id */
  userId: string;
  /** 예약인원 */
  reservCount: number;
};

export class Schedule {
  constructor(readonly props: ScheduleProps) {}

  reserv(info: ResertvInfo): Schedule {
    const { reservCount } = info;
    this.decreaseRemain(reservCount);
    return this;
  }

  decreaseRemain(reservCount: number): void {
    if (this.props.remain < reservCount || this.props.remain === 0) {
      throw new Error('잔여인원이 부족합니다.');
    }
    this.props.remain -= reservCount;
  }

  increaseRemain(reservCount: number): void {
    this.props.remain += reservCount;
    if (this.remain > this.totalCapacity) {
      throw new Error('잔여인원이 예약인원을 초과할 수 없습니다.');
    }
  }

  available(): boolean {
    return this.props.remain > 0;
  }

  get scheduleId(): string {
    return this.props.scheduleId;
  }

  get date(): string {
    return this.props.date;
  }

  get time(): string {
    return this.props.time;
  }

  get restaurant(): Restaurant {
    return this.props.restaurant;
  }

  get totalCapacity(): number {
    return this.props.totalCapacity;
  }

  get remain(): number {
    return this.props.remain;
  }
}
