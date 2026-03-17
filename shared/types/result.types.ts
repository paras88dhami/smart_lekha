export type SuccessResult<T> = {
  success: true;
  value: T;
};

export type FailureResult<E = Error> = {
  success: false;
  error: E;
};

export type Result<T = void, E = Error> = SuccessResult<T> | FailureResult<E>;
