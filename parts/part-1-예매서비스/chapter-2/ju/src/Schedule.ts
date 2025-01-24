import { Restaurant } from './Restaurant';

export type ScheduleProps = {
  scheduleId: string;
  date: string;
  time: string;
  restaurant: Restaurant;
  // 예약 인원
  totalCapacity: number;
  // 잔여 인원
  remains: number;
};

type ResertvInfo = {
  // 예약자id
  userId: string;
  // 예약인원
  numberOfPeople: number;
};

export class Schedule {
  constructor(readonly props: ScheduleProps) {}

  reserv(info: ResertvInfo): Schedule {
    const { userId, numberOfPeople } = info;
    this.decreaseRemains(numberOfPeople);
    return new Schedule({
      ...this.props,
      remains: this.props.remains,
    });
  }

  decreaseRemains(numberOfPeople: number): void {
    if (this.props.remains < numberOfPeople || this.props.remains === 0) {
      throw new Error('잔여인원이 부족합니다.');
    }
    this.props.remains -= numberOfPeople;
  }

  increaseRemains(numberOfPeople: number): void {
    this.props.remains += numberOfPeople;
    if (this.remains > this.totalCapacity) {
      throw new Error('잔여인원이 예약인원을 초과할 수 없습니다.');
    }
  }

  available(): boolean {
    return this.props.remains > 0;
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

  get restaurantId(): string {
    return this.props.restaurantId;
  }

  get totalCapacity(): number {
    return this.props.totalCapacity;
  }

  get remains(): number {
    return this.props.remains;
  }
}
