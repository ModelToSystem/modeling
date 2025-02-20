import { ConflictStatusException } from '../exception';
import { AbstractCredit, CreditTypeRecord } from './AbstractCredit';

/**
 * 이수중인 학점을 관리하는 클래스
 * - 이수중인 학점은 확정된 학점이 아니다.
 */
export class ProgressCredit extends AbstractCredit {
  /** 최대 신청 학점 - TOOD: 외부에서 주입받도록 수정 필요 */
  readonly #MAX_ENROLLMENT_CREDITS = 21;

  /** 총 이수중인 학점
   * = totalMajorCredits + totalLiberalArtsCredits + totalElectiveCredits
   */
  get totalProgressCredits(): number {
    return (
      this.totalMajorCredits +
      this.totalLiberalArtsCredits +
      this.totalElectiveCredits
    );
  }

  /**
   * 최대 신청 학점을 초과하는지 검증 한다.
   * @param credits 학점 수
   */
  canEnrollMoreCredits(credits: number): boolean {
    const totalCredits = this.totalProgressCredits + credits;
    return totalCredits > this.#MAX_ENROLLMENT_CREDITS;
  }

  override increaseCredits(
    positiveInt: number,
    creditTypeRecord: CreditTypeRecord,
  ): this {
    if (this.canEnrollMoreCredits(positiveInt))
      throw new ConflictStatusException(
        `최대 신청 학점인 ${this.#MAX_ENROLLMENT_CREDITS}을 초과합니다.`,
      );

    super.increaseCredits(positiveInt, creditTypeRecord);
    return this;
  }
}
