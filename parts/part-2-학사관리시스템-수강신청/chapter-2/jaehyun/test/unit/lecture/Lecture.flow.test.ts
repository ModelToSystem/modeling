import { CreditType, SelectionType } from '../../../src';
import { Lecture, LectureEnrollStatus } from '../../../src/Lecture';

/**
 * 테스트 케이스 정책
 * - 도메인 규칙이 가진 시나리오를 테스트 한다.
 * - 캡슐화된 로직을 직접 테스트 하지 않는다.
 * - 단순하고 명확한 테스트를 수행한다.
 */
describe('Lecture - 상태 전이 플로우 테스트', () => {
  // 초기 Lecture 인스턴스의 프로퍼티
  const initProps = {
    id: 'lecture-1',
    name: 'Sample Lecture',
    professor: 'Prof. Test',
    creditType: CreditType.MAJOR,
    creditSelectionType: SelectionType.REQUIRED,
    credit: 3,
    registrationStartAt: new Date(),
    registrationEndAt: new Date(new Date().getTime() + 1000 * 60 * 60), // 1시간 후
    capacity: 3,
    currentEnrollment: 0,
    schedules: [],
  };

  let lecture: Lecture;

  beforeEach(() => {
    lecture = Lecture.create({ ...initProps });
  });

  describe('플로우 테스트', () => {
    describe('성공한다', () => {
      it('EXPECTED(신청예정) > OPEN(신청기한) > CLOSE(신청마감) 성공한다.', () => {
        // given
        // when
        lecture.open();
        lecture.enroll();
        lecture.close();
        // then
        expect(lecture.enrollStatus).toBe(LectureEnrollStatus.CLOSED);
      });

      it('EXPECTED(신처예정) > OPEN(신청기한) > OVER_CAPACITY(정원초과) > CLOSE(신청마감) 성공한다.', () => {
        // given
        const maxEnrollment = lecture.capacity;
        // when
        lecture.open();
        Array.from({ length: maxEnrollment }, () => lecture.enroll());
        lecture.close();
        // then
        expect(lecture.enrollStatus).toBe(LectureEnrollStatus.CLOSED);
      });
    });

    // describe('실패한다.', () => {
    //   it('EXPECTED(신청예정) > CLOSE(신청마감) 실패한다.', () => {
    //     // given
    //     // when
    //     lecture.close();
    //     // then
    //     expect(() => lecture.close()).toThrow(ConflictStatusException);
    //   });

    //   it('EXPECTED(신청예정) > OPEN(신청기한) > CLOSE(신청마감) 실패한다.', () => {
    //     // given
    //     // when
    //     lecture.close();
    //     // then
    //     expect(() => lecture.close()).toThrow(ConflictStatusException);
    //   });
    // });
  });
});
