import { AbstractCredit } from './AbstractCredit';

/**
 * 학점을 관리하는 클래스
 * - 이수 완료된 학점만 관리한다.
 */
export class AcademicCredit extends AbstractCredit {
  /** 총 이수 학점
   * = totalMajorCredits + totalLiberalArtsCredits + totalElectiveCredits
   */
  get totalEarnedCredits(): number {
    return (
      this.totalMajorCredits +
      this.totalLiberalArtsCredits +
      this.totalElectiveCredits
    );
  }
}
