export abstract class ApplicationException extends Error {
  constructor(message: string) {
    super(message);
  }
}
