import { ProfileModel } from "../profile.model";
import { profileTable } from "../profile.schema";

export const profileDbConfig = {
  models: [ProfileModel],
  tables: [profileTable],
};
