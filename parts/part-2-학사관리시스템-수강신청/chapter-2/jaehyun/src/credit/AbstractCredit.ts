import { AbstractDomain } from '../AbstractDomain';
import { BadParameterException } from '../exception';
import { CreditType, SelectionType } from './enum';

export type CreditTypeRecord = {
  /** 학점 타입 */
  creditType: CreditType;
  /** 학점 선택 유형 */
  selectionType: SelectionType;
};

/** 학점 계산기 파라미터 */
type CalculateCreditsParam = CreditTypeRecord & {
  /** 증감 계산할 학점(정수) */
  credits: number;
};

export type AbstractCreditProps = {
  id: string;
  /** 전공 필수 학점 */
  majorRequiredCredits: number;
  /** 전공 선택 학점 */
  majorOptionalCredits: number;
  /** 교양 필수 학점 */
  liberalArtsRequiredCredits: number;
  /** 교양 선택 학점 */
  liberalArtsOptionalCredits: number;
  /** 선택 필수 학점 */
  electiveRequiredCredits: number;
  /** 선택 선택 학점 */
  electiveOptionalCredits: number;
};

/**
 * 학점에 대한 규칙을 가지는 추상 클래스
 */
export abstract class AbstractCredit extends AbstractDomain {
  constructor(protected props: AbstractCreditProps) {
    super();
  }

  get id(): string {
    return this.props.id;
  }

  /** 전공 필수 학점 */
  get majorRequiredCredits(): number {
    return this.props.majorRequiredCredits;
  }
  /** 전공 선택 학점 */
  get majorOptionalCredits(): number {
    return this.props.majorOptionalCredits;
  }

  /** 교양 필수 학점 */
  get liberalArtsRequiredCredits(): number {
    return this.props.liberalArtsRequiredCredits;
  }
  /** 교양 선택 학점 */
  get liberalArtsOptionalCredits(): number {
    return this.props.liberalArtsOptionalCredits;
  }

  /** 선택 필수 학점 */
  get electiveRequiredCredits(): number {
    return this.props.electiveRequiredCredits;
  }
  /** 선택 선택 학점 */
  get electiveOptionalCredits(): number {
    return this.props.electiveOptionalCredits;
  }

  /* ============= custom getters ============= */

  /** 총 전공 학점 */
  get totalMajorCredits(): number {
    return this.majorRequiredCredits + this.majorOptionalCredits;
  }
  /** 총 교양 학점 */
  get totalLiberalArtsCredits(): number {
    return this.liberalArtsRequiredCredits + this.liberalArtsOptionalCredits;
  }
  /** 총 선택 학점 */
  get totalElectiveCredits(): number {
    return this.electiveRequiredCredits + this.electiveOptionalCredits;
  }

  /**
   * 학점 계산을 위한 파라미터를 받아 학점 계산 처리
   * @param param 학점 계산 파라미터
   */
  calculateCredits(param: CalculateCreditsParam): void {
    const { creditType, selectionType, credits } = param;

    // 전공 학점
    if (CreditType.isMajor(creditType)) {
      SelectionType.isRequired(selectionType)
        ? (this.props.majorRequiredCredits += credits)
        : (this.props.majorOptionalCredits += credits);
    }
    // 교양 학점
    if (CreditType.isLiberalArts(creditType)) {
      SelectionType.isRequired(selectionType)
        ? (this.props.liberalArtsRequiredCredits += credits)
        : (this.props.liberalArtsOptionalCredits += credits);
    }
    // 선택 학점
    if (CreditType.isElective(creditType)) {
      SelectionType.isRequired(selectionType)
        ? (this.props.electiveRequiredCredits += credits)
        : (this.props.electiveOptionalCredits += credits);
    }
  }

  /**
   * 학점 증가 처리
   * @param positiveInt 증가할 학점 수(양의 정수)
   * @param creditTypeRecord 학점 계산 파라미터
   */
  increaseCredits(
    positiveInt: number,
    creditTypeRecord: CreditTypeRecord,
  ): this {
    if (positiveInt <= 0)
      throw new BadParameterException(
        `${positiveInt}은 0이 아닌 양수여야 합니다.`,
      );

    this.calculateCredits({ ...creditTypeRecord, credits: positiveInt });
    return this;
  }

  /**
   * 학점 차감 처리
   * @param positiveInt 차감할 학점 수(양의 정수)
   * @param creditTypeRecord 학점 계산 파라미터
   */
  decreaseCredits(
    positiveInt: number,
    creditTypeRecord: CreditTypeRecord,
  ): this {
    if (positiveInt <= 0)
      throw new BadParameterException(
        `${positiveInt}은 0이 아닌 양수여야 합니다.`,
      );

    const negativeInt = -positiveInt;
    this.calculateCredits({ ...creditTypeRecord, credits: negativeInt });
    return this;
  }
}
