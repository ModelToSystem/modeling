import { Post, Comment, SimpleHashStrategy } from '../src';

describe('Post', () => {
  const props = {
    id: '1',
    title: '테스트 타이틀',
    content: '테스트 컨텐츠',
    authorName: '테스트 작성자',
    password: 'abc123',
  };
  const commentProps = {
    id: '1',
    content: '테스트 댓글',
    authorName: '테스트 작성자',
    parentId: '0',
    depth: 0,
    isChild: false,
    postId: props.id,
  };

  describe('게시글 생성 테스트', () => {
    it('게시글을 생성한다.', async () => {
      // given & when
      const post = new Post({ ...props });

      // then
      expect(post.title).toBe(props.title);
      expect(post.content).toBe(props.content);
      expect(post.authorName).toBe(props.authorName);
    });

    it('게시글에 생성시 비밀번호를 해싱한다.', async () => {
      // given
      const post = new Post({ ...props });
      const hashStrategy = new SimpleHashStrategy();
      post.setHashStrategy(hashStrategy);

      // when
      await post.hashPassword();
      const hashedPassword = await hashStrategy.hash(post.password);

      // then
      expect(post.password).not.toBe(hashedPassword);
    });
  });

  describe('게시글 수정 테스트', () => {
    it('비밀번호가 일치하면 게시글 수정에 성공한다.', async () => {
      // given
      const post = new Post({ ...props });
      await post.setHashStrategy(new SimpleHashStrategy()).hashPassword();

      // when
      await post.modify({ title: '수정된 타이틀' }, props.password);

      // then
      expect(post.title).toBe('수정된 타이틀');
      expect(post.content).toBe(props.content);
      expect(post.authorName).toBe(props.authorName);
    });

    it('비밀번호가 일치하지 않으면 게시글 수정에 실패한다.', async () => {
      // given
      const post = new Post({ ...props });
      await post.setHashStrategy(new SimpleHashStrategy()).hashPassword();

      // when
      try {
        await post.modify({ title: '수정된 타이틀' }, '123456');
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('게시글 삭제 테스트', () => {
    let posts: Post[];

    beforeEach(async () => {
      posts = [];
      const post = new Post({ ...props });
      await post.hashPassword();
      post.addComment(new Comment({ ...commentProps }));
      posts.push(post);
      // console.log(props);
      // console.log(post);
    });

    it('비밀번호가 일치하면 게시글 삭제에 성공한다.', async () => {
      // given
      const removePostId = props.id;
      const password = props.password;
      const removedPost = posts.find((post) => post.id === removePostId);

      // when
      await removedPost.remove(password);

      // then - 삭제에 성공하면 댓글은 삭제된다.
      expect(removedPost.comments.length).toBe(0);
      expect(removedPost.hasComments()).toBe(false);
    });

    it('비밀번호가 일치하지 않으면 게시글 삭제에 실패한다.', async () => {
      // given
      const removePostId = props.id;
      const password = props.password + '123456';
      const removedPost = posts.find((post) => post.id === removePostId);

      // when
      try {
        await removedPost.remove(password);
      } catch (error) {
        // then
        expect(error).toBeInstanceOf(Error);
      }

      expect(removedPost.comments.length).toBe(1);
      expect(removedPost.hasComments()).toBe(true);
    });
  });

  describe('게시글에 댓글 추가 테스트', () => {
    it('게시글에 댓글을 추가한다.', async () => {
      // given
      const post = new Post({ ...props });
      await post.setHashStrategy(new SimpleHashStrategy()).hashPassword();
      const comment = new Comment({ ...commentProps });

      // when
      post.addComment(comment);

      // then
      expect(post.hasComments()).toBe(true);
      expect(post.comments.at(0)).toStrictEqual(comment);
      expect(post.comments.at(0).postId).toBe(post.id);
      expect(post.comments.at(0).isChild).toBe(false);
      expect(post.comments.at(0).depth).toBe(0);
    });
  });
});
