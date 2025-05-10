import * as crypto from 'crypto';

export abstract class AbstractDomain {
  static uuid(): string {
    return crypto.randomUUID();
  }
}
