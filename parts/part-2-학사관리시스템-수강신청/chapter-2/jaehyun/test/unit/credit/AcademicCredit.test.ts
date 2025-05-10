import { AcademicCredit, CreditType, SelectionType } from '../../../src/credit';
import { BadParameterException } from '../../../src/exception';

/**
 * AcademicCredit의 학점 계산 로직에 대한 테스트 케이스
 */
describe('AcademicCredit', () => {
  // 초기 AcademicCredit 인스턴스의 프로퍼티
  const initProps = {
    id: 'academic-credit-1',
    majorRequiredCredits: 0,
    majorOptionalCredits: 0,
    liberalArtsRequiredCredits: 0,
    liberalArtsOptionalCredits: 0,
    electiveRequiredCredits: 0,
    electiveOptionalCredits: 0,
  };

  let academicCredit: AcademicCredit;

  beforeEach(() => {
    // AcademicCredit 인스턴스 초기화
    academicCredit = new AcademicCredit({ ...initProps });
  });

  describe('AcademicCredit#increaseCredits - 학점 증가 로직 테스트', () => {
    describe('성공한다', () => {
      describe('전공 학점', () => {
        // given
        const increment = 3;
        const creditType = CreditType.MAJOR;

        it('전공 필수 학점 증가에 성공한다.', () => {
          // when
          academicCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.REQUIRED,
          });
          // then
          expect(academicCredit.totalMajorCredits).toBe(increment);
          expect(academicCredit.totalEarnedCredits).toBe(increment);
          expect(academicCredit.totalLiberalArtsCredits).toBe(0);
          expect(academicCredit.totalElectiveCredits).toBe(0);
        });

        it('전공 선택 학점 증가에 성공한다.', () => {
          // when
          academicCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.OPTIONAL,
          });
          // then
          expect(academicCredit.totalMajorCredits).toBe(increment);
          expect(academicCredit.totalEarnedCredits).toBe(increment);
          expect(academicCredit.totalLiberalArtsCredits).toBe(0);
          expect(academicCredit.totalElectiveCredits).toBe(0);
        });
      });

      describe('교양 학점', () => {
        // given: 교양 학점
        const increment = 2;
        const creditType = CreditType.LIBERAL_ARTS;

        it('교양 필수 증가에 성공한다.', () => {
          // when
          academicCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.REQUIRED,
          });
          // then
          expect(academicCredit.totalLiberalArtsCredits).toBe(increment);
          expect(academicCredit.totalEarnedCredits).toBe(increment);
          expect(academicCredit.totalMajorCredits).toBe(0);
          expect(academicCredit.totalElectiveCredits).toBe(0);
        });

        it('교양 선택 증가에 성공한다.', () => {
          // when
          academicCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.OPTIONAL,
          });
          // then
          expect(academicCredit.totalLiberalArtsCredits).toBe(increment);
          expect(academicCredit.totalEarnedCredits).toBe(increment);
          expect(academicCredit.totalMajorCredits).toBe(0);
          expect(academicCredit.totalElectiveCredits).toBe(0);
        });
      });

      describe('선택 학점', () => {
        // given: 선택 학점
        const increment = 3;
        const creditType = CreditType.ELECTIVE;

        it('선택 필수 증가에 성공한다.', () => {
          // when
          academicCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.REQUIRED,
          });
          // then
          expect(academicCredit.totalElectiveCredits).toBe(increment);
          expect(academicCredit.totalEarnedCredits).toBe(increment);
          expect(academicCredit.totalMajorCredits).toBe(0);
          expect(academicCredit.totalLiberalArtsCredits).toBe(0);
        });

        it('선택 선택 학점 증가에 성공한다.', () => {
          // when
          academicCredit.increaseCredits(increment, {
            creditType,
            selectionType: SelectionType.OPTIONAL,
          });
          // then
          expect(academicCredit.totalElectiveCredits).toBe(increment);
          expect(academicCredit.totalEarnedCredits).toBe(increment);
          expect(academicCredit.totalMajorCredits).toBe(0);
          expect(academicCredit.totalLiberalArtsCredits).toBe(0);
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
            academicCredit.increaseCredits(increment, {
              creditType,
              selectionType: SelectionType.REQUIRED,
            }),
          ).toThrow(BadParameterException);
        });
      });
    });
  });

  describe('AcademicCredit#decreaseCredits - 학점 차감 로직 테스트', () => {
    describe('성공한다', () => {
      describe('전공 학점', () => {
        it('전공 필수 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType: CreditType.MAJOR,
            selectionType: SelectionType.REQUIRED,
          };
          const increment = 10;
          const decrement = 2;

          // 차감 테스트 전 학점 증가
          academicCredit.increaseCredits(increment, typeRecord);
          const beforeMajorCredits = academicCredit.totalMajorCredits;
          const beforeEarnedCredits = academicCredit.totalEarnedCredits;

          // when
          academicCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(academicCredit.totalMajorCredits).toBe(
            beforeMajorCredits - decrement,
          );
          expect(academicCredit.totalEarnedCredits).toBe(
            beforeEarnedCredits - decrement,
          );
          expect(academicCredit.totalLiberalArtsCredits).toBe(0);
          expect(academicCredit.totalElectiveCredits).toBe(0);
        });

        it('전공 선택 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType: CreditType.MAJOR,
            selectionType: SelectionType.OPTIONAL,
          };
          const increment = 10;
          const decrement = 1;

          // 차감 테스트 전 학점 증가
          academicCredit.increaseCredits(increment, typeRecord);
          const beforeMajorCredits = academicCredit.totalMajorCredits;
          const beforeEarnedCredits = academicCredit.totalEarnedCredits;

          // when
          academicCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(academicCredit.totalMajorCredits).toBe(
            beforeMajorCredits - decrement,
          );
          expect(academicCredit.totalEarnedCredits).toBe(
            beforeEarnedCredits - decrement,
          );
          expect(academicCredit.totalLiberalArtsCredits).toBe(0);
          expect(academicCredit.totalElectiveCredits).toBe(0);
        });
      });

      describe('교양 학점', () => {
        it('교양 필수 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType: CreditType.LIBERAL_ARTS,
            selectionType: SelectionType.REQUIRED,
          };
          const increment = 10;
          const decrement = 1;

          // 차감 테스트 전 학점 증가
          academicCredit.increaseCredits(increment, typeRecord);
          const beforeLiberalArtsCredits =
            academicCredit.totalLiberalArtsCredits;
          const beforeEarnedCredits = academicCredit.totalEarnedCredits;

          // when
          academicCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(academicCredit.totalLiberalArtsCredits).toBe(
            beforeLiberalArtsCredits - decrement,
          );
          expect(academicCredit.totalEarnedCredits).toBe(
            beforeEarnedCredits - decrement,
          );
          expect(academicCredit.totalMajorCredits).toBe(0);
          expect(academicCredit.totalElectiveCredits).toBe(0);
        });

        it('교양 선택 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType: CreditType.LIBERAL_ARTS,
            selectionType: SelectionType.OPTIONAL,
          };
          const increment = 10;
          const decrement = 2;

          // 차감 테스트 전 학점 증가
          academicCredit.increaseCredits(increment, typeRecord);
          const beforeLiberalArtsCredits =
            academicCredit.totalLiberalArtsCredits;
          const beforeEarnedCredits = academicCredit.totalEarnedCredits;
          // when
          academicCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(academicCredit.totalLiberalArtsCredits).toBe(
            beforeLiberalArtsCredits - decrement,
          );
          expect(academicCredit.totalEarnedCredits).toBe(
            beforeEarnedCredits - decrement,
          );
          expect(academicCredit.totalMajorCredits).toBe(0);
          expect(academicCredit.totalElectiveCredits).toBe(0);
        });
      });

      describe('선택 학점', () => {
        it('선택 필수 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType: CreditType.ELECTIVE,
            selectionType: SelectionType.REQUIRED,
          };
          const increment = 10;
          const decrement = 1;

          // 차감 테스트 전 학점 증가
          academicCredit.increaseCredits(increment, typeRecord);
          const beforeElectiveCredits = academicCredit.totalElectiveCredits;
          const beforeEarnedCredits = academicCredit.totalEarnedCredits;

          // when
          academicCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(academicCredit.totalElectiveCredits).toBe(
            beforeElectiveCredits - decrement,
          );
          expect(academicCredit.totalEarnedCredits).toBe(
            beforeEarnedCredits - decrement,
          );
          expect(academicCredit.totalMajorCredits).toBe(0);
          expect(academicCredit.totalLiberalArtsCredits).toBe(0);
        });

        it('선택 선택 학점 차감에 성공한다.', () => {
          // given
          const typeRecord = {
            creditType: CreditType.ELECTIVE,
            selectionType: SelectionType.OPTIONAL,
          };
          const increment = 10;
          const decrement = 1;

          // 차감 테스트 전 학점 증가
          academicCredit.increaseCredits(increment, typeRecord);
          const beforeElectiveCredits = academicCredit.totalElectiveCredits;
          const beforeEarnedCredits = academicCredit.totalEarnedCredits;

          // when
          academicCredit.decreaseCredits(decrement, typeRecord);

          // then
          expect(academicCredit.totalElectiveCredits).toBe(
            beforeElectiveCredits - decrement,
          );
          expect(academicCredit.totalEarnedCredits).toBe(
            beforeEarnedCredits - decrement,
          );
          expect(academicCredit.totalMajorCredits).toBe(0);
          expect(academicCredit.totalLiberalArtsCredits).toBe(0);
        });
      });
    });

    describe('실패한다', () => {
      const creditType = CreditType.MAJOR;

      it('학점이 양의 정수가 아닌 경우 차감에 실패한다.', () => {
        // given
        const invalidDecrement = [0, -1, -2, -3];

        // when & then
        invalidDecrement.forEach((decrement) => {
          expect(() =>
            academicCredit.decreaseCredits(decrement, {
              creditType,
              selectionType: SelectionType.REQUIRED,
            }),
          ).toThrow(BadParameterException);
        });
      });
    });
  });
});
