import { PasswordHashStrategy } from './password-hash-strategy.interface';

/** Argon2 사용하는 해시 전략 */
export class Argon2HashStrategy implements PasswordHashStrategy {
  async hash(password: string): Promise<string> {
    console.log('Argon2 해시 라이브러리로 구현');
    return password;
  }

  async verify(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    const hashed = await this.hash(plainPassword);
    return hashed === hashedPassword;
  }
}
