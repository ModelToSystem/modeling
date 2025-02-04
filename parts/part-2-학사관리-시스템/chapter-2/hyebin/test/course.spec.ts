import { Course, CourseProps } from '../src';

describe('Course', () => {
  const courseProps: CourseProps = {
    id: '1',
    capacity: 40,
    credit: 3,
    availableCapacity: 30,
  };

  describe('정원 차감', () => {
    it('정원을 차감한다', () => {
      //when
      const course = new Course({ ...courseProps });
      const initialCapacity = course.availableCapacity;

      //given
      course.decreaseAvailableCapacity();

      //then
      expect(course.availableCapacity).toBe(initialCapacity - 1);
    });

    it('정원이 0명 이하면 차감에 실패한다', () => {
      //when
      courseProps.availableCapacity = 0;

      const course = new Course({ ...courseProps });

      //given & then
      expect(() => course.decreaseAvailableCapacity()).toThrow(
        '정원이 마감되었습니다.',
      );
    });
  });

  describe('정원 복구', () => {
    it('정원을 복구한다.', () => {
      // given
      const course = new Course({ ...courseProps });
      const initialCapacity = course.availableCapacity;

      // when
      course.increaseAvailableCapacity();

      // then
      expect(course.availableCapacity).toBe(initialCapacity + 1);
    });

    it('수강가능 인원수가 최대 정원수 이상이면 정원 복구에 실패한다 ', () => {
      // given
      courseProps.availableCapacity = courseProps.capacity;
      const course = new Course({ ...courseProps });

      // when & then
      expect(() => course.increaseAvailableCapacity()).toThrow(
        '수강 가능 인원수가 최대 정원수보다 큽니다.',
      );
    });
  });
});
