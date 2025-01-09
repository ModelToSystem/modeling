export type CommentProps = {
  id: string;
  content: string;
  authorName: string;
  parentId: string;
  depth: number;
  isChild: boolean;
  postId: string;
};

export class Comment {
  readonly #COMMENT_PARENT_ID = '0';

  constructor(readonly props: CommentProps) {}

  get id(): string {
    return this.props.id;
  }

  get content(): string {
    return this.props.content;
  }

  get authorName(): string {
    return this.props.authorName;
  }

  get parentId(): string {
    return this.props.parentId;
  }

  get depth(): number {
    return this.props.depth;
  }

  get isChild(): boolean {
    return this.props.isChild;
  }

  get postId(): string {
    return this.props.postId;
  }

  get isRootComment(): boolean {
    return this.props.parentId === this.#COMMENT_PARENT_ID;
  }

  get isChildComment(): boolean {
    return this.props.parentId !== this.#COMMENT_PARENT_ID;
  }
}
