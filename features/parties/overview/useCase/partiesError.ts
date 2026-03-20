export type PartiesErrorCode =
  | "no_active_profile"
  | "load_failed"
  | "invalid_party"
  | "save_failed";

export class PartiesError extends Error {
  readonly code: PartiesErrorCode;

  constructor(code: PartiesErrorCode) {
    super(code);
    this.code = code;
  }
}

export const createPartiesError = (code: PartiesErrorCode): PartiesError => {
  return new PartiesError(code);
};
