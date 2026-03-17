import { OtpRequestModel } from "../otpRequest.model";
import { otpRequestTable } from "../otpRequest.schema";

export const otpRequestDbConfig = {
  models: [OtpRequestModel],
  tables: [otpRequestTable],
};
