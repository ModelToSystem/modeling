import { DayOfWeek, Lecture, LectureType } from '../../src';
import { Professor } from '../../src/user';

describe('Lecture', () => {
  const props = {
    id: '1',
    professor: new Professor({ userId: '1', name: '교수' }),
    roomNumber: 1,
    credits: 7,
    type: LectureType.Major,
    required: true,
    timeLists: [
      { startTime: '13:00', endTime: '15:00', dayOfWeek: DayOfWeek.FRIDAY },
      { startTime: '13:00', endTime: '15:00', dayOfWeek: DayOfWeek.WEDNESDAY },
      { startTime: '13:00', endTime: '15:00', dayOfWeek: DayOfWeek.MONDAY },
    ],
    maxCapacity: 30,
    remainCapacity: 10,
  };

  describe('강의 정원을 증가한다.', () => {
    it('❌ 현재인원이 최대인원보다 초과시 에러를 반환한다.', () => {
      const lecture = new Lecture({ ...props, remainCapacity: 30 });

      expect(() => lecture.increaseCapacity()).toThrow(
        '강의인원을 초과했습니다.',
      );
    });
    it('✅ 현재인원을 증가시킨다.', () => {
      const lecture = new Lecture({ ...props, remainCapacity: 10 });
      lecture.increaseCapacity();
      expect(lecture.remainCapaticy).toBe(11);
    });
  });

  describe('강의 정원을 감소한다.', () => {
    it('❌ 현재인원이 없는 경우 에러를 반환한다.', () => {
      const lecture = new Lecture({ ...props, remainCapacity: 0 });

      expect(() => lecture.decreaseCapacity()).toThrow('강의 인원이 없습니다.');
    });

    it('✅ 현재인원을 감소시킨다.', () => {
      const lecture = new Lecture({ ...props, remainCapacity: 10 });
      lecture.decreaseCapacity();
      expect(lecture.remainCapaticy).toBe(9);
    });
  });
});
