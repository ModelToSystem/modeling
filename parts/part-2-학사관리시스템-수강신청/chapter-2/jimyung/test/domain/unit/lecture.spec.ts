import {
  CourseType,
  ErrorCodes,
  InvalidException,
  Lecture,
} from 'parts/part-2-학사관리시스템-수강신청/chapter-2/jimyung/src/domain';

describe('Lecture', () => {
  describe('생성', () => {
    it('1학점보다 작은 학점을 가진 강의는 생성할 수 없다.', () => {
      // given
      const lectureProps = {
        name: '컴퓨터 공학 개론',
        credits: 0,
        professorId: '1',
        courseType: CourseType.RequiredGe,
        capacity: 10,
      };

      // when
      const when = () => new Lecture(lectureProps);

      // then
      expect(when).toThrow(
        new InvalidException(ErrorCodes.Lecture.INVALID_CREDITS),
      );
    });

    it('수강 인원이 0보다 작을 수 없다.', () => {
      // given
      const lectureProps = {
        name: '컴퓨터 공학 개론',
        credits: 1,
        professorId: '1',
        courseType: CourseType.RequiredGe,
        capacity: -1,
      };

      // when
      const when = () => new Lecture(lectureProps);

      // then
      expect(when).toThrow(
        new InvalidException(ErrorCodes.Lecture.INVALID_CAPACITY),
      );
    });
  });

  describe('수강 가능 인원 감소(수강 신청 시나리오)', () => {
    it('수강 인원이 0보다 클 때 수강신청을 할 수 있다.', () => {
      // given
      const lecture = new Lecture({
        name: '컴퓨터 공학 개론',
        credits: 1,
        professorId: '1',
        courseType: CourseType.RequiredGe,
        capacity: 1,
      });
      const priorCapacity = lecture.capacity;

      // when
      lecture.decreaseCapacity();

      // then
      expect(lecture.capacity).toBe(priorCapacity - 1);
    });

    it('수강 인원이 0일 때 수강 신청을 할 수 없다.', () => {
      // given
      const lecture = new Lecture({
        name: '컴퓨터 공학 개론',
        credits: 1,
        professorId: '1',
        courseType: CourseType.RequiredGe,
        capacity: 0,
      });

      // when
      const invalidDecreaseJob = () => lecture.decreaseCapacity();

      // then
      expect(invalidDecreaseJob).toThrow(
        new InvalidException(ErrorCodes.Lecture.INVALID_CAPACITY),
      );
    });
  });

  describe('수강 가능 인원 증가(수강 취소 시나리오)', () => {
    it('수강 취소를 하면 수강 가능 인원이 증가한다.', () => {
      // given
      const lecture = new Lecture({
        name: '컴퓨터 공학 개론',
        credits: 1,
        professorId: '1',
        courseType: CourseType.RequiredGe,
        capacity: 0,
      });
      const priorCapacity = lecture.capacity;

      // when
      lecture.increaseCapacity();

      // then
      expect(lecture.capacity).toBe(priorCapacity + 1);
    });
  });
});
