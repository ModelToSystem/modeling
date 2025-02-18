import { ApplicationException } from './ApplicationException';
import { ApplicationExceptionCodeRecord } from './constant';

export class ResourceNotFoundException extends ApplicationException {
  constructor(message?: string) {
    super(ApplicationExceptionCodeRecord.RESOURCE_NOT_FOUND, message);
  }
}
