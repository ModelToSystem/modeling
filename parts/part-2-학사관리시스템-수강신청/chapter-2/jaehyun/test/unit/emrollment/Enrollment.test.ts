import {
  AcademicCredit,
  CreditType,
  Enrollment,
  EnrollmentStatus,
  Lecture,
  ProgressCredit,
  SelectionType,
  Student,
} from '../../../src';
import { ConflictStatusException } from '../../../src/exception';
import { testProps } from './test-prop';

/**
 * Enrollment 도메인 관련 기능 테스트
 */
describe('Enrollment', () => {
  let lecture: Lecture;
  let student: Student;

  beforeEach(() => {
    const now = new Date();
    const registrationStartAt = new Date(now.getTime() - 60 * 1000); // 1분 전
    const registrationEndAt = new Date(now.getTime() + 60 * 60 * 1000); // 1시간 후

    // 강의 객체 생성
    lecture = Lecture.create({
      ...testProps.lecture,
      registrationStartAt,
      registrationEndAt,
      capacity: 3,
      currentEnrollment: 0,
    });

    // 학생 객체 생성
    const academicCredit = new AcademicCredit({ ...testProps.credit });
    const progressCredit = new ProgressCredit({ ...testProps.credit });

    student = new Student({
      ...testProps.student,
      academicCredit,
      progressCredit,
    });
  });

  describe('Enrollment#enroll() - 수강신청', () => {
    describe('성공한다.', () => {
      it('강의가 OPEN(신청기한) 상태이고, 학생이 최대 신청 학점을 넘지 않았다면 수강신청에 성공한다.', () => {
        // given
        lecture.open();

        // when
        const enrollment = Enrollment.enroll(lecture, student);

        // then
        expect(enrollment.status).toBe(EnrollmentStatus.APPLIED);
      });
      it('수강신청에 성공하면 강의의 수강자 수가 증가한다.', () => {
        // given
        lecture.open();
        const afterCurrentEnrollment = lecture.currentEnrollment + 1;

        // when
        const enrollment = Enrollment.enroll(lecture, student);
        // then
        expect(enrollment.status).toBe(EnrollmentStatus.APPLIED);
        expect(enrollment.lecture.currentEnrollment).toBe(
          afterCurrentEnrollment,
        );
      });
      it('수강신청에 성공하면 학생의 이수중인 학점이 증가한다.', () => {
        // given
        lecture.open();
        const afterStudentProgressCredit =
          student.progressCredit.totalProgressCredits + lecture.credit;

        // when
        const enrollment = Enrollment.enroll(lecture, student);

        // then
        expect(enrollment.status).toBe(EnrollmentStatus.APPLIED);
        expect(enrollment.student.progressCredit.totalProgressCredits).toBe(
          afterStudentProgressCredit,
        );
      });
    });

    describe('실패한다.', () => {
      it('강의가 EXPECTED(신청예정) 상태이면 수강 신청에 실패한다.', () => {
        // given
        // when && then
        expect(() => Enrollment.enroll(lecture, student)).toThrow(
          ConflictStatusException,
        );
      });

      it('강의가 OVER_CAPACITY(정원초과) 상태이면 수강 신청에 실패한다.', () => {
        // given
        lecture.open();
        const maxEnrollment = lecture.capacity;

        // 강의 정원 수 만큼 수강신청
        Array.from({ length: maxEnrollment }).forEach(() =>
          Enrollment.enroll(lecture, student),
        );

        // when && then
        expect(() => Enrollment.enroll(lecture, student)).toThrow(
          ConflictStatusException,
        );
      });

      it('강의가 CLOSED(신청마감) 상태이면 수강 신청에 실패한다.', () => {
        // given
        lecture.open();
        lecture.close();

        // when && then
        expect(() => Enrollment.enroll(lecture, student)).toThrow(
          ConflictStatusException,
        );
      });

      it('학생이 최대 신청 학점을 넘었다면 수강 신청에 실패한다.', () => {
        // given
        lecture.open();
        // TODO: 21학점을 한 번에 넣지말고 최대 학점을 외부에서 컨트롤 할 수 있게 만드는게 어떨까?
        student.enroll({
          credit: 21,
          creditType: CreditType.MAJOR,
          selectionType: SelectionType.REQUIRED,
        });
        // when && then
        expect(() => Enrollment.enroll(lecture, student)).toThrow(
          ConflictStatusException,
        );
      });
    });
  });

  describe('Enrollment#cancel() - 수강취소', () => {
    let enrollment: Enrollment;

    beforeEach(() => {
      lecture.open();
      enrollment = Enrollment.enroll(lecture, student);
    });

    describe('성공한다.', () => {
      it('강의가 OPEN(신청기한) 상태라면 수강취소에 성공한다.', () => {
        // given
        // when
        enrollment.cancel();
        // then
        expect(enrollment.status).toBe(EnrollmentStatus.CANCELLED);
      });
    });

    describe('실패한다.', () => {
      it('강의가 CLOSED(신청마감) 상태라면 수강취소에 실패한다.', () => {
        // given
        lecture.close();

        // when &&then
        expect(() => enrollment.cancel()).toThrow(ConflictStatusException);
      });

      it('이미 수강취소된 상태면 수강취소에 실패한다.', () => {
        // given
        enrollment.cancel();

        // when && then
        expect(() => enrollment.cancel()).toThrow(ConflictStatusException);
      });
    });
  });
});
