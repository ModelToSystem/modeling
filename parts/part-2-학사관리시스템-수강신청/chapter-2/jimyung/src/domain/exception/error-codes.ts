import { Values } from '../../type';

export const ErrorCodes = {
  Lecture: {
    INVALID_CREDITS: '학점은 1보다 작을 수 없습니다.',
    INVALID_CAPACITY: '수강인원은 0보다 작을 수 없습니다.',
    INVALID_TIME_SLOTS: '시간표가 비어있습니다.',
  },
  TimeSlot: {
    INVALID_TIME_RANGE: '시작 또는 종료 시간이 올바르지 않습니다.',
  },
  Enrollment: {
    ALREADY_CANCELLED: '이미 취소된 수강신청입니다.',
  },
  Student: {
    INSUFFICIENT_CREDITS: '학점이 부족합니다.',
  },
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
export type ErrorMessage = Values<{
  [K in keyof typeof ErrorCodes]: Values<(typeof ErrorCodes)[K]>;
}>;
