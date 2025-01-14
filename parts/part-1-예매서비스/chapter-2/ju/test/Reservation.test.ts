import { Reservation, ReservationStatus } from '../src';

describe('Reservation', () => {
  const props = {
    reservationId: '1',
    userId: '1',
    restaurantId: '1',
    scheduleId: '1',
    reservationTime: new Date(),
    status: ReservationStatus.CONFIRMED,
  };

  describe('예약 생성', () => {
    it('성공적으로 예약을 생성한다.', () => {
      const reservation = new Reservation({ ...props });

      expect(reservation.reservationId).toBe(props.reservationId);
      expect(reservation.userId).toBe(props.userId);
      expect(reservation.restaurantId).toBe(props.restaurantId);
      expect(reservation.scheduleId).toBe(props.scheduleId);
      expect(reservation.status).toBe(props.status);
    });
  });

  describe('예약 취소', () => {
    it('유저 id가 일치하면 예약 수정에 성공한다.', () => {
      const reservation = new Reservation({ ...props });
      reservation.cancel('1');

      expect(reservation.reservationId).toBe(props.reservationId);
      expect(reservation.status).toBe(ReservationStatus.CANCELED);
    });

    it('유저 id가 일치하지 않으면 예약 수정에 실패하고 에러를 반환한다.', () => {
      const reservation = new Reservation({ ...props });

      expect(() => reservation.cancel('2')).toThrow(
        'userId가 일치하지 않습니다.',
      );
    });

    it('CANCELED 상태인 예약을 취소하려하면 에러를 반환한다.', () => {
      const reservation = new Reservation({
        ...props,
        status: ReservationStatus.CANCELED,
      });

      expect(() => reservation.cancel('1')).toThrow(
        'CONFIRMED 상태에서만 예약이 취소 가능합니다.',
      );
    });
  });
});
