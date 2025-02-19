import { CreditType } from '../../../src';
import { Lecture, LectureEnrollStatus } from '../../../src/Lecture';

describe('Lecture', () => {
  // 초기 Lecture 인스턴스의 프로퍼티
  const initProps = {
    id: 'lecture-1',
    name: 'Sample Lecture',
    professor: 'Prof. Test',
    creditType: CreditType.MAJOR,
    credit: 3,
    registrationStartAt: new Date(),
    registrationEndAt: new Date(new Date().getTime() + 1000 * 60 * 60), // 1시간 후
    capacity: 3,
    currentEnrollment: 0,
    schedules: [],
  };

  let lecture: Lecture;

  beforeEach(() => {
    lecture = Lecture.create({ ...initProps });
  });

  describe('Lecture#open()', () => {
    describe('성공한다', () => {
      it('EXPECTED(신청예정) 상태라면 open에 성공한다.', () => {});
      it('OVER_CAPACITY(정원초과) 상태라도 잔여 좌석이 있다면 open에 성공한다.', () => {});
    });

    describe('실패한다.', () => {
      it('EXPECTED(신청예정) 상태가 아니라면 open()에 실패한다.', () => {});

      it('OVER_CAPACITY(정원초과) 상태지만, 잔여좌석이 없다면 open()에 실패한다.', () => {});
    });
  });

  describe('Lecture#full()', () => {
    describe('성공한다', () => {
      it('OPEN(신청기간) 상태면서 남은 자리가 없다면 full()에 성공한다.', () => {});
    });

    describe('실패한다.', () => {
      it('OPEN(신청기간) 상태가 아니라면 full()에 실패한다.', () => {});
      it('OPEN(신청기간) 상태지만, 남은 자리가 있다면 full()에 실패한다.', () => {});
    });
  });

  describe('Lecture#close()', () => {
    describe('성공한다', () => {
      it('OPEN(신청기간) 상태라면 close()에 성공한다.', () => {});
      it('OVER_CAPACITY(정원초과) 상태라면 close()에 성공한다.', () => {});
    });

    describe('실패한다.', () => {
      it('OPEN(신청기간) 상태가 아니라면 close()에 실패한다.', () => {});
      it('OVER_CAPACITY(정원초과) 상태가 아니라면 close()에 실패한다.', () => {});
    });
  });

  describe('Lecture#enroll()', () => {
    describe('성공한다', () => {
      it('강의가 OPEN(신청기간) 상태라면 enroll()에 성공한다.', () => {});
      it('성공시 남은 자리가 없다면 OVER_CAPACITY(정원초과) 상태로 변경된다.', () => {});
    });

    describe('실패한다.', () => {
      it('강의가 OPEN(신청기간) 상태가 아니라면 실패한다.', () => {});
    });
  });

  describe('Lecture#cancel()', () => {
    describe('성공한다', () => {
      it('강의가 OPEN(신청기간) 상태라면 cancel()에 성공한다.', () => {});
      it('강의가 OVER_CAPACITY(정원초과) 상태라면 cancel()에 성공한다.', () => {});
      it('OVER_CAPACITY(정원초과) 상태에서 cancel에 성공하면, OPEN(신청기간) 상태로 변경된다.', () => {});
    });

    describe('실패한다.', () => {
      it('강의가 OPEN(신청기간) 또는 OVER_CAPACITY(정원초과) 상태가 아니라면 cancel()에 실패한다.', () => {});
      it('cancel()로 인해 OPEN(신청기간) 상태로 변경 되었는데 잔여자리가 없다면 실패해야한다.', () => {});
    });
  });
});
