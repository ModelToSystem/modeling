import { CreditType, SelectionType } from '../../../src';

export const testProps = {
  lecture: {
    id: 'lecture-1',
    name: '테스트 강의',
    professor: '교수님',
    creditType: CreditType.MAJOR,
    creditSelectionType: SelectionType.REQUIRED,
    credit: 3,
    registrationStartAt: new Date(),
    registrationEndAt: new Date(new Date().getTime() + 60 * 60 * 1000), // 1시간 후
    capacity: 10,
    currentEnrollment: 0,
    schedules: [],
  },

  student: {
    id: 'student-1',
    name: '테스트 학생',
    faculty: '공학부',
    departmentName: '컴퓨터공학과',
    major: '소프트웨어',
  },

  credit: {
    id: 'credit-1',
    majorRequiredCredits: 0,
    majorOptionalCredits: 0,
    liberalArtsRequiredCredits: 0,
    liberalArtsOptionalCredits: 0,
    electiveRequiredCredits: 0,
    electiveOptionalCredits: 0,
  },
};
