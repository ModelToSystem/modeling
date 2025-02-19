import { CreditType } from '../../../src';
import { ConflictStatusException } from '../../../src/exception';
import { Lecture, LectureEnrollStatus } from '../../../src/Lecture';

/**
 * 테스트 케이스 정책
 * - 도메인 규칙이 가진 시나리오를 테스트 한다.
 * - 캡슐화된 로직을 직접 테스트 하지 않는다.
 * - 단순하고 명확한 테스트를 수행한다.
 */
describe('Lecture - 상태를 중점으로 테스트한다.', () => {
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
      it('EXPECTED(신청예정) 상태라면 open에 성공한다.', () => {
        // given
        // when
        lecture.open();
        // then
        expect(lecture.enrollStatus).toBe(LectureEnrollStatus.OPEN);
      });

      it.skip('❌ 불가능한 테스트 - OVER_CAPACITY(정원초과) 상태라도 잔여좌석이 있다면 open에 성공한다.', () => {
        // NOTE: 캡슐화된 로직을 테스트 하기 위해 강제로 데이터를 만들어 테스트를 해야할까?
        /*
        ## 불가능한 테스트인 이유
        currentEnrollment의 감소는 cancel()외에 직접적으로 외부에서 조작할 수 없게 설계 되어있다.
        때문에 정원초과 상태에서 잔여좌석을 외부에서 조작할 수 없다.
        
        - 의견 1) 단위 테스트는 화이트 박스 테스트 관점에서 바라봐야 한다.
        - 의견 2) 단위 테스트라고 하더라도 캡슐화 된 로직을 억지로 데이터를 가공해 테스트 해야할까?

        내 선택은 의견 2) 이다. 때문에 cancel() 메서드 단위 테스트 케이스에서 검증을 수행한다.
        - 고민 참고: https://www.perplexity.ai/search/gaegcejihyangyi-sasilgwa-ohae-zV_blT5FQzSpS7YogpAmsg#55
        */
      });
    });

    describe('실패한다.', () => {
      it('이미 OPEN(신청기간)인 상태에서는 open()에 실패한다.', () => {
        // given
        lecture.open();
        // when && then
        expect(() => lecture.open()).toThrow(ConflictStatusException);
      });

      it('OVER_CAPACITY(정원초과)인 상태에서는 open()을 직접 호출하면 실패한다.', () => {
        // NOTE: 잘못된 테스트 케이스
        // it('OVER_CAPACITY(정원초과) 상태지만, 잔여좌석이 없다면 open()에 실패한다.', () => {});
        // 통일한 테스트 처럼 보이지만, 위 테스트 케이스는 캡슐화된 직접적인 로직을 테스트한다.

        // given
        lecture.open();
        const maxEnrollment = lecture.capacity;
        Array.from({ length: maxEnrollment }, () => lecture.enroll());

        // when && then
        expect(() => lecture.open()).toThrow(ConflictStatusException);
      });

      it('CLOSE(신청마감)인 상태에서는 open()에 실패한다.', () => {
        // given
        lecture.open();
        lecture.close();

        // when && then
        expect(() => lecture.open()).toThrow(ConflictStatusException);
      });
    });
  });

  describe('Lecture#full()', () => {
    describe('성공한다', () => {
      it.skip('❌ 불가능한 테스트: OPEN(신청기간) 상태면서 남은 자리가 없다면 full()에 성공한다.', () => {
        // NOTE: 사실 full()은 외부에서 호출할 일이 없다. enroll()에 의해 호출되어야 동작하기 때문이다.
        // 때문에 성공 케이스는 여기서 테스트하지 못하고 enroll에 의해 테스트 된다.
      });
    });

    describe('실패한다.', () => {
      it('EXPECTED(신청예정) 상태에서는 full()에 실패한다.', () => {
        // given
        // when && then
        expect(() => lecture.full()).toThrow(ConflictStatusException);
      });

      it('OPEN(신청기간) 상태라도 잔여좌석이 있으면 full()에 실패한다.', () => {
        // given
        lecture.open();
        const maxEnrollment = lecture.capacity;
        Array.from({ length: maxEnrollment - 1 }, () => lecture.enroll());

        // when && then
        if (!lecture.isFull()) {
          expect(() => lecture.full()).toThrow(ConflictStatusException);
        }
      });

      it('이미 OVER_CAPACITY(정원초과) 상태라면 full()에 실패한다.', () => {
        // given
        lecture.open();
        const maxEnrollment = lecture.capacity;
        Array.from({ length: maxEnrollment }, () => lecture.enroll());

        // when && then
        expect(() => lecture.full()).toThrow(ConflictStatusException);
      });

      it('CLOSE(신청마감) 상태에서는 full()에 실패한다.', () => {
        // given
        lecture.open();
        lecture.close();

        // when && then
        expect(() => lecture.full()).toThrow(ConflictStatusException);
      });
    });
  });

  // 신청 마감 테스트
  describe('Lecture#close()', () => {
    describe('성공한다', () => {
      it('OPEN(신청기간) 상태라면 close()에 성공한다.', () => {
        // given
        lecture.open();
        // when
        lecture.close();
        // then
        expect(lecture.enrollStatus).toBe(LectureEnrollStatus.CLOSED);
      });

      it('OVER_CAPACITY(정원초과) 상태라면 close()에 성공한다.', () => {
        // given
        lecture.open();
        const maxEnrollment = lecture.capacity;
        Array.from({ length: maxEnrollment }, () => lecture.enroll());
        // when
        lecture.close();
        // when && then
        expect(lecture.enrollStatus).toBe(LectureEnrollStatus.CLOSED);
      });
    });

    describe('실패한다.', () => {
      it('EXPECTED(신청예정) 상태라면 close()에 실패한다.', () => {
        // given
        // when && then
        expect(() => lecture.close()).toThrow(ConflictStatusException);
      });

      it('이미 CLOSE(신청마감) 상태라면 close()에 실패한다.', () => {
        // given
        lecture.open();
        lecture.close();
        // when && then
        expect(() => lecture.close()).toThrow(ConflictStatusException);
      });
    });
  });

  // 신청 테스트
  describe('Lecture#enroll()', () => {
    describe('성공한다', () => {
      it('강의가 OPEN(신청기간) 상태라면 enroll()에 성공한다.', () => {
        // given
        lecture.open();
        // when && then
        expect(() => lecture.enroll()).not.toThrow();
      });

      it('enroll()에 성공하면 현재 신청자 수가 증가한다.', () => {
        // given
        lecture.open();
        const afterCurrentEnrollment = lecture.currentEnrollment + 1;
        // when
        lecture.enroll();
        // then
        expect(lecture.currentEnrollment).toBe(afterCurrentEnrollment);
      });

      it('성공시 남은 자리가 없다면 OVER_CAPACITY(정원초과) 상태로 변경된다.', () => {
        // given
        lecture.open();
        const maxEnrollment = lecture.capacity;

        // when
        Array.from({ length: maxEnrollment }, () => lecture.enroll());

        // then
        expect(lecture.enrollStatus).toBe(LectureEnrollStatus.OVER_CAPACITY);
      });
    });

    describe('실패한다.', () => {
      it('EXPECTED(신청예정) 상태라면 enroll()에 실패한다.', () => {
        // given
        // when && then
        expect(() => lecture.enroll()).toThrow(ConflictStatusException);
      });

      it('CLOSE(신청마감) 상태라면 enroll()에 실패한다.', () => {
        // given
        lecture.open();
        lecture.close();
        // when && then
        expect(() => lecture.enroll()).toThrow(ConflictStatusException);
      });

      it('OVER_CAPACITY(정원초과) 상태라면 enroll()에 실패한다.', () => {
        // given
        lecture.open();
        const maxEnrollment = lecture.capacity;
        Array.from({ length: maxEnrollment }, () => lecture.enroll());

        // when && then
        expect(() => lecture.enroll()).toThrow(ConflictStatusException);
      });
    });
  });

  describe('Lecture#cancel()', () => {
    describe('성공한다', () => {
      it('강의가 OPEN(신청기간) 상태이고, 신청자가 있다면 cancel()에 성공한다.', () => {
        // given
        lecture.open();
        lecture.enroll();
        // when && then
        expect(() => lecture.cancel()).not.toThrow();
      });

      it('강의가 OVER_CAPACITY(정원초과) 상태라면 cancel()에 성공한다.', () => {
        // given
        lecture.open();
        const maxEnrollment = lecture.capacity;
        Array.from({ length: maxEnrollment }, () => lecture.enroll());
        // when && then
        expect(() => lecture.cancel()).not.toThrow();
      });

      it('OVER_CAPACITY(정원초과) 상태에서 cancel에 성공하면, OPEN(신청기간) 상태로 변경된다.', () => {
        // given
        lecture.open();
        const maxEnrollment = lecture.capacity;
        Array.from({ length: maxEnrollment }, () => lecture.enroll());
        // when
        lecture.cancel();
        // then
        expect(lecture.enrollStatus).toBe(LectureEnrollStatus.OPEN);
      });
    });

    describe('실패한다.', () => {
      it('EXPECTED(신청예정) 상태라면 cancel()에 실패한다.', () => {
        // given
        // when && then
        expect(() => lecture.cancel()).toThrow(ConflictStatusException);
      });

      it('CLOSE(신청마감) 상태라면 cancel()에 실패한다.', () => {
        // given
        lecture.open();
        lecture.close();
        // when && then
        expect(() => lecture.cancel()).toThrow(ConflictStatusException);
      });

      it('OPEN(신청기간) 상태에서 현재 신청자가 없다면 cancel()에 실패한다.', () => {
        // given
        lecture.open();
        // when && then
        expect(() => lecture.cancel()).toThrow(ConflictStatusException);
      });
    });
  });
});
