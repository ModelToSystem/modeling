import { ApplicationException } from './ApplicationException';
import { ApplicationExceptionCodeRecord } from './constant';

export class ConflictStatusException extends ApplicationException {
  constructor(message?: string) {
    super(ApplicationExceptionCodeRecord.CONFLICT_STATUS, message);
  }
}
