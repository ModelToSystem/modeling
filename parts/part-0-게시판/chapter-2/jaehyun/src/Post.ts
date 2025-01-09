import { PasswordHashStrategy, SimpleHashStrategy } from './strategy';
import { Comment } from './comment';

export type PostProps = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  password: string;
};

export class Post {
  #hashStrategy: PasswordHashStrategy;
  #comments: Comment[];

  constructor(private props: PostProps) {
    this.#hashStrategy = new SimpleHashStrategy();
    this.#comments = [];
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get authorName(): string {
    return this.props.authorName;
  }

  get password(): string {
    return this.props.password;
  }

  get comments(): Comment[] {
    return this.#comments;
  }

  setHashStrategy(hashStrategy: PasswordHashStrategy): this {
    this.#hashStrategy = hashStrategy;
    return this;
  }

  async hashPassword(): Promise<this> {
    this.props.password = await this.#hashStrategy.hash(this.props.password);
    return this;
  }

  /**
   * 게시글 수정 메서드
   * - 비밀번호가 일치하지 않으면 실패한다.
   * @param props 수정할 게시글 속성
   * @param password 비밀번호
   * @returns 수정된 게시글
   */
  async modify(
    props: Partial<Pick<PostProps, 'title' | 'content'>>,
    plainPassword: string,
  ): Promise<this> {
    if (!(await this.#hashStrategy.verify(this.password, plainPassword)))
      throw new Error('비밀번호가 일치하지 않습니다.');

    this.props = { ...this.props, ...props };
    return this;
  }

  async remove(plainPassword: string): Promise<this> {
    if (!(await this.#hashStrategy.verify(this.password, plainPassword)))
      throw new Error('비밀번호가 일치하지 않습니다.');

    // 비즈니스 로직에 따른 삭제 처리 구현
    this.#comments = [];
    return this;
  }

  hasComments(): boolean {
    return this.#comments.length > 0;
  }

  addComment(comment: Comment): void {
    this.comments.push(comment);
  }
}
