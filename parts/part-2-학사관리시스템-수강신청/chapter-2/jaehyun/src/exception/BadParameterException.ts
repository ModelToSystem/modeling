import { ApplicationException } from './ApplicationException';
import { ApplicationExceptionCodeRecord } from './constant';

export class BadParameterException extends ApplicationException {
  constructor(message?: string) {
    super(ApplicationExceptionCodeRecord.BAD_PARAMETER, message);
  }
}
