/* eslint-disable @typescript-eslint/no-namespace */
// NOTE: JVM 진영의 enum 처럼 메서드를 사용할 수 있도록 namespace를 사용한다.

/** 학점 타입 */
export enum CreditType {
  /** 전공 학점 */
  MAJOR = 'Major',
  /** 교양 학점 */
  LIBERAL_ARTS = 'LiberalArts',
  /** 선택 학점 */
  ELECTIVE = 'Elective',
}

export namespace CreditType {
  export function isMajor(creditType: CreditType): boolean {
    return creditType === CreditType.MAJOR;
  }
  export function isLiberalArts(creditType: CreditType): boolean {
    return creditType === CreditType.LIBERAL_ARTS;
  }
  export function isElective(creditType: CreditType): boolean {
    return creditType === CreditType.ELECTIVE;
  }
}

/** 학점 선택 유형 */
export enum SelectionType {
  /** 필수 학점 */
  REQUIRED = 'Required',
  /** 선택 학점 */
  OPTIONAL = 'Optional',
}

export namespace SelectionType {
  export function isRequired(selectionType: SelectionType): boolean {
    return selectionType === SelectionType.REQUIRED;
  }
  export function isOptional(selectionType: SelectionType): boolean {
    return selectionType === SelectionType.OPTIONAL;
  }
}
