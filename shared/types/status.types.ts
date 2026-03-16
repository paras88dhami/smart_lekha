export const Status = {
  Idle: "IDLE",
  Loading: "LOADING",
  Success: "SUCCESS",
  Failure: "FAILURE",
} as const;

export type StatusType = (typeof Status)[keyof typeof Status];
