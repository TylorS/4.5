export interface Assertion<T> {
  verify(verification: Verification<T>): void;
}

export interface Verification<T> {
  success(actual: T): any;
  failure(message: string): any;
}
