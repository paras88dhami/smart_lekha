export type DownloadDataErrorCode = "no_active_profile" | "generate_failed";

export class DownloadDataError extends Error {
  readonly code: DownloadDataErrorCode;

  constructor(code: DownloadDataErrorCode) {
    super(code);
    this.code = code;
  }
}

export const createDownloadDataError = (
  code: DownloadDataErrorCode,
): DownloadDataError => {
  return new DownloadDataError(code);
};
