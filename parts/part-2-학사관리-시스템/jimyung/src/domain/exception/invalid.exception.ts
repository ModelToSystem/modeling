import { ApplicationException } from './application.exception';
import { ErrorCodes, ErrorMessage } from './error-codes';

export class InvalidException extends ApplicationException {
  constructor(errorCode: ErrorMessage) {
    super(ErrorCodes[errorCode]);
  }
}
