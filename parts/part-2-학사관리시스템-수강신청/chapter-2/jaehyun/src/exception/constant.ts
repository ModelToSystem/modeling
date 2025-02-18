export type ApplicationExceptionCode =
  | 'BAD_PARAMETER'
  | 'RESOURCE_NOT_FOUND'
  | 'CONFLICT_STATUS';

export const ApplicationExceptionCodeRecord: Record<
  ApplicationExceptionCode,
  ApplicationExceptionCode
> = {
  BAD_PARAMETER: 'BAD_PARAMETER',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  CONFLICT_STATUS: 'CONFLICT_STATUS',
} as const;

export const ApplicationExceptionMessageRecord: Record<
  ApplicationExceptionCode,
  string
> = {
  BAD_PARAMETER: 'Bad Parameter Exception',
  RESOURCE_NOT_FOUND: 'Resource Not Found Exception',
  CONFLICT_STATUS: 'Conflict Status Exception',
} as const;
