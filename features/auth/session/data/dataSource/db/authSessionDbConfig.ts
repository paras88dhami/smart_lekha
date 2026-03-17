import { AuthSessionModel } from "../authSession.model";
import { authSessionTable } from "../authSession.schema";

export const authSessionDbConfig = {
  models: [AuthSessionModel],
  tables: [authSessionTable],
};
