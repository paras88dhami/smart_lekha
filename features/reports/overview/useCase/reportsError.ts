export type ReportsErrorCode = "no_active_profile" | "load_failed";

export class ReportsError extends Error {
  readonly code: ReportsErrorCode;

  constructor(code: ReportsErrorCode) {
    super(code);
    this.code = code;
  }
}

export const createReportsError = (code: ReportsErrorCode): ReportsError => {
  return new ReportsError(code);
};
