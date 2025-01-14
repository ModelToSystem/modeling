import { Schedule } from '../src';

describe('Schedule', () => {
  const props = {
    scheduleId: '1',
    date: '2025-01-01',
    time: '13:00',
    restaurantId: '1',
    totalCapacity: 20,
    remains: 10,
  };

  describe('특정일에 대한 예약 가능 스케줄 조회', () => {
    it('잔여 인원이 0보다 크면 arr를 반환한다. ', () => {
      const schedules = [
        new Schedule({ ...props, time: '13:00', remains: 5 }),
        new Schedule({ ...props, time: '14:00', remains: 0 }),
        new Schedule({ ...props, time: '15:00', remains: 2 }),
        new Schedule({ ...props, time: '16:00', remains: 10 }),
        new Schedule({ ...props, time: '17:00', remains: 0 }),
      ];
      const availableSchedules = schedules.filter((schedule) =>
        schedule.available(),
      );
      expect(availableSchedules).toMatchObject([
        new Schedule({ ...props, time: '13:00', remains: 5 }),
        new Schedule({ ...props, time: '15:00', remains: 2 }),
        new Schedule({ ...props, time: '16:00', remains: 10 }),
      ]);
      expect(availableSchedules.length).toBe(3);
    });

    it('잔여 인원이 0보다 작거나 같으면 빈배열을 반환한다.', () => {
      const schedules = [
        new Schedule({ ...props, time: '14:00', remains: 0 }),
        new Schedule({ ...props, time: '17:00', remains: 0 }),
      ];
      const availableSchedules = schedules.filter((schedule) =>
        schedule.available(),
      );
      expect(availableSchedules).toMatchObject([]);
      expect(availableSchedules.length).toBe(0);
    });
  });

  describe('스케줄 수정 (예약 등록)', () => {
    it('잔여 인원이 예약인원보다 크면 잔여 인원을 예약 인원만큼 차감한다.', () => {
      const schedule = new Schedule({ ...props });

      schedule.reserv('1', 3);

      expect(schedule.remains).toBe(7);
    });

    it('잔여 인원이 예약인원보다 작으면 스케줄 등록에 실패한다.', () => {
      const schedule = new Schedule({ ...props });

      expect(() => schedule.decreaseRemains(11)).toThrow(
        '잔여인원이 부족합니다.',
      );
      expect(() => schedule.reserv('1', 13)).toThrow('잔여인원이 부족합니다.');
    });
  });

  describe('스케줄 수정 (예약 취소)', () => {
    it('취소 인원만큼 잔여인원을 증가시킨다.', () => {
      const schedule = new Schedule({ ...props });

      schedule.increaseRemains(5);

      expect(schedule.remains).toBe(15);
    });

    it('취소 인원과 잔여인원의 합이 총 수용인원을 초과하면 스케줄 수정에 실패한다.', () => {
      const schedule = new Schedule({ ...props });

      expect(() => schedule.increaseRemains(11)).toThrow(
        '잔여인원이 예약인원을 초과할 수 없습니다.',
      );
    });
  });
});
