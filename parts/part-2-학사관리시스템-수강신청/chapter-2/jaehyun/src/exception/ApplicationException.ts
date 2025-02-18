import {
  ApplicationExceptionCode,
  ApplicationExceptionMessageRecord,
} from './constant';

/**
 * Application 예외 처리를 위한 최상위 클래스
 */
export abstract class ApplicationException extends Error {
  constructor(
    readonly code: ApplicationExceptionCode,
    message?: string,
  ) {
    super(message ?? ApplicationExceptionMessageRecord[code]);
  }
}
