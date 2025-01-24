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
  numberOfPeople: number;
};

export class Schedule {
  constructor(readonly props: ScheduleProps) {}

  reserv(info: ResertvInfo): Schedule {
    const { numberOfPeople } = info;
    this.decreaseRemain(numberOfPeople);
    return new Schedule({
      ...this.props,
      remain: this.props.remain,
    });
  }

  decreaseRemain(numberOfPeople: number): void {
    if (this.props.remain < numberOfPeople || this.props.remain === 0) {
      throw new Error('잔여인원이 부족합니다.');
    }
    this.props.remain -= numberOfPeople;
  }

  increaseRemain(numberOfPeople: number): void {
    this.props.remain += numberOfPeople;
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
