import { ProgressCredit, CreditType, SelectionType } from '../../src/credit';
import {
  BadParameterException,
  ConflictStatusException,
} from '../../src/exception';

describe('ProgressCredit', () => {
  // 초기 학점 설정 값
  const initProps = {
    id: 'progress-1',
    majorRequiredCredits: 0,
    majorOptionalCredits: 0,
    liberalArtsRequiredCredits: 0,
    liberalArtsOptionalCredits: 0,
    electiveRequiredCredits: 0,
    electiveOptionalCredits: 0,
  };
  let progressCredit: ProgressCredit;

  beforeEach(() => {
    progressCredit = new ProgressCredit({ ...initProps });
  });

  // ================================

  describe('ProgressCredit#increaseCredits - 학점 증가 로직 테스트', () => {
    describe('성공한다', () => {
      describe('전공 학점', () => {
        // given
        const increment = 3;
        const creditType = CreditType.MAJOR;

        it('전공 필수 학점 증가에 성공한다.', () => {
          // when
          progressCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.REQUIRED,
          });
          // then
          expect(progressCredit.totalMajorCredits).toBe(increment);
          expect(progressCredit.totalProgressCredits).toBe(increment);
          expect(progressCredit.totalLiberalArtsCredits).toBe(0);
          expect(progressCredit.totalElectiveCredits).toBe(0);
        });

        it('전공 선택 학점 증가에 성공한다.', () => {
          // when
          progressCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.OPTIONAL,
          });
          // then
          expect(progressCredit.totalMajorCredits).toBe(increment);
          expect(progressCredit.totalProgressCredits).toBe(increment);
          expect(progressCredit.totalLiberalArtsCredits).toBe(0);
          expect(progressCredit.totalElectiveCredits).toBe(0);
        });
      });

      describe('교양 학점', () => {
        // given: 교양 학점
        const increment = 2;
        const creditType = CreditType.LIBERAL_ARTS;

        it('교양 필수 증가에 성공한다.', () => {
          // when
          progressCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.REQUIRED,
          });
          // then
          expect(progressCredit.totalLiberalArtsCredits).toBe(increment);
          expect(progressCredit.totalProgressCredits).toBe(increment);
          expect(progressCredit.totalMajorCredits).toBe(0);
          expect(progressCredit.totalElectiveCredits).toBe(0);
        });
        it('교양 선택 증가에 성공한다.', () => {
          // when
          progressCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.OPTIONAL,
          });
          // then
          expect(progressCredit.totalLiberalArtsCredits).toBe(increment);
          expect(progressCredit.totalProgressCredits).toBe(increment);
          expect(progressCredit.totalMajorCredits).toBe(0);
          expect(progressCredit.totalElectiveCredits).toBe(0);
        });
      });

      describe('선택 학점', () => {
        // given: 선택 학점
        const increment = 3;
        const creditType = CreditType.ELECTIVE;

        it('선택 필수 증가에 성공한다.', () => {
          // when
          progressCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.REQUIRED,
          });
          // then
          expect(progressCredit.totalElectiveCredits).toBe(increment);
          expect(progressCredit.totalProgressCredits).toBe(increment);
          expect(progressCredit.totalMajorCredits).toBe(0);
          expect(progressCredit.totalLiberalArtsCredits).toBe(0);
        });
        it('선택 선택 학점 증가에 성공한다.', () => {
          // when
          progressCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.OPTIONAL,
          });
          // then
          expect(progressCredit.totalElectiveCredits).toBe(increment);
          expect(progressCredit.totalProgressCredits).toBe(increment);
          expect(progressCredit.totalMajorCredits).toBe(0);
          expect(progressCredit.totalLiberalArtsCredits).toBe(0);
        });
      });
    });

    describe('실패한다', () => {
      const creditType = CreditType.MAJOR;

      it('학점이 양의 정수가 아닌 경우 증가에 실패한다.', () => {
        // given
        const invalidIncrement = [0, -1, -2, -3];

        // when & then
        invalidIncrement.forEach((increment) => {
          expect(() =>
            progressCredit.increaseCredits(increment, {
              creditType,
              selectionType: SelectionType.REQUIRED,
            }),
          ).toThrow(BadParameterException);
        });
      });

      it('신청 학점이 최대 신청 가능 학점인 21을 초과하면 증가에 실패한다.', () => {
        // given
        const typeRecord = {
          creditType,
          selectionType: SelectionType.REQUIRED,
        };

        const MAX_ENROLLMENT_CREDITS = 21; // or progressCredit.maxEnrollmentCredits
        progressCredit.increaseCredits(MAX_ENROLLMENT_CREDITS, typeRecord);
        const increment = 1;

        // when & then
        expect(() =>
          progressCredit.increaseCredits(increment, typeRecord),
        ).toThrow(ConflictStatusException);
      });
    });
  });

  describe('ProgressCredit#decreaseCredits - 학점 차감 로직 테스트', () => {
    describe('성공한다', () => {
      describe('전공 학점', () => {
        // given: 전공 선택
        const creditType = CreditType.MAJOR;

        it('전공 필수 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType,
            selectionType: SelectionType.REQUIRED,
          };
          const increment = 10;
          const decrement = 3;

          // 차감 테스트 전 학점 증가
          progressCredit.increaseCredits(increment, typeRecord);
          const beforeMajorCredits = progressCredit.totalMajorCredits;
          const beforeProgressCredits = progressCredit.totalProgressCredits;

          // when
          progressCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(progressCredit.totalMajorCredits).toBe(
            beforeMajorCredits - decrement,
          );
          expect(progressCredit.totalProgressCredits).toBe(
            beforeProgressCredits - decrement,
          );
          expect(progressCredit.totalLiberalArtsCredits).toBe(0);
          expect(progressCredit.totalElectiveCredits).toBe(0);
        });

        it('전공 선택 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType,
            selectionType: SelectionType.OPTIONAL,
          };
          const increment = 10;
          const decrement = 3;

          // 차감 테스트 전 학점 증가
          progressCredit.increaseCredits(increment, typeRecord);
          const beforeMajorCredits = progressCredit.totalMajorCredits;
          const beforeProgressCredits = progressCredit.totalProgressCredits;

          // when
          progressCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(progressCredit.totalMajorCredits).toBe(
            beforeMajorCredits - decrement,
          );
          expect(progressCredit.totalProgressCredits).toBe(
            beforeProgressCredits - decrement,
          );
          expect(progressCredit.totalLiberalArtsCredits).toBe(0);
          expect(progressCredit.totalElectiveCredits).toBe(0);
        });
      });

      describe('교양 학점', () => {
        // given: 교양 학점
        const creditType = CreditType.LIBERAL_ARTS;

        it('교양 필수 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType,
            selectionType: SelectionType.REQUIRED,
          };
          const increment = 10;
          const decrement = 3;

          // 차감 테스트 전 학점 증가
          progressCredit.increaseCredits(increment, typeRecord);

          const beforeLiberalArtsCredits =
            progressCredit.totalLiberalArtsCredits;
          const beforeProgressCredits = progressCredit.totalProgressCredits;

          // when
          progressCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(progressCredit.totalLiberalArtsCredits).toBe(
            beforeLiberalArtsCredits - decrement,
          );
          expect(progressCredit.totalProgressCredits).toBe(
            beforeProgressCredits - decrement,
          );
          expect(progressCredit.totalMajorCredits).toBe(0);
          expect(progressCredit.totalElectiveCredits).toBe(0);
        });
        it('교양 선택 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType,
            selectionType: SelectionType.OPTIONAL,
          };
          const increment = 10;
          const decrement = 3;

          // 차감 테스트 전 학점 증가
          progressCredit.increaseCredits(increment, typeRecord);
          const beforeLiberalArtsCredits =
            progressCredit.totalLiberalArtsCredits;
          const beforeProgressCredits = progressCredit.totalProgressCredits;

          // when
          progressCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(progressCredit.totalLiberalArtsCredits).toBe(
            beforeLiberalArtsCredits - decrement,
          );
          expect(progressCredit.totalProgressCredits).toBe(
            beforeProgressCredits - decrement,
          );
          expect(progressCredit.totalMajorCredits).toBe(0);
          expect(progressCredit.totalElectiveCredits).toBe(0);
        });
      });

      describe('선택 학점', () => {
        // given: 선택 학점
        const creditType = CreditType.ELECTIVE;

        it('선택 필수 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType,
            selectionType: SelectionType.REQUIRED,
          };
          const increment = 10;
          const decrement = 3;

          // 차감 테스트 전 학점 증가
          progressCredit.increaseCredits(increment, typeRecord);
          const beforeElectiveCredits = progressCredit.totalElectiveCredits;
          const beforeProgressCredits = progressCredit.totalProgressCredits;

          // when
          progressCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(progressCredit.totalElectiveCredits).toBe(
            beforeElectiveCredits - decrement,
          );
          expect(progressCredit.totalProgressCredits).toBe(
            beforeProgressCredits - decrement,
          );
          expect(progressCredit.totalMajorCredits).toBe(0);
          expect(progressCredit.totalLiberalArtsCredits).toBe(0);
        });
        it('선택 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType,
            selectionType: SelectionType.OPTIONAL,
          };
          const increment = 10;
          const decrement = 3;

          // 차감 테스트 전 학점 증가
          progressCredit.increaseCredits(increment, typeRecord);
          const beforeElectiveCredits = progressCredit.totalElectiveCredits;
          const beforeProgressCredits = progressCredit.totalProgressCredits;

          // when
          progressCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(progressCredit.totalElectiveCredits).toBe(
            beforeElectiveCredits - decrement,
          );
          expect(progressCredit.totalProgressCredits).toBe(
            beforeProgressCredits - decrement,
          );
          expect(progressCredit.totalMajorCredits).toBe(0);
          expect(progressCredit.totalLiberalArtsCredits).toBe(0);
        });
      });
    });

    describe('실패한다', () => {
      const creditType = CreditType.MAJOR;

      it('학점이 양의 정수가 아닌 경우 차감에 실패한다.', () => {
        // given
        const invalidIncrement = [0, -1, -2, -3];

        // when & then
        invalidIncrement.forEach((increment) => {
          expect(() =>
            progressCredit.decreaseCredits(increment, {
              creditType,
              selectionType: SelectionType.REQUIRED,
            }),
          ).toThrow(BadParameterException);
        });
      });
    });
  });
});
