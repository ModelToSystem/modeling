import { PasswordHashStrategy } from './password-hash-strategy.interface';

/** 테스트 환경용 간단한 해싱 전략 */
export class SimpleHashStrategy implements PasswordHashStrategy {
  private readonly ADD_CODE_POINT = 1;

  /**
   * 비밀번호를 해싱하는 메서드
   * - 단순하게 비밀번호의 각 문자의 아스키 코드를 더하고 다시 문자로 변환하여 해싱
   * @param password 해싱할 비밀번호
   * @returns 해싱된 비밀번호
   */
  async hash(password: string): Promise<string> {
    return Array.from(password)
      .map((char) => char.codePointAt(0) + this.ADD_CODE_POINT)
      .map((code) => String.fromCodePoint(code))
      .join('');
  }

  async verify(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    const hashed = await this.hash(plainPassword);
    return hashed === hashedPassword;
  }
}
