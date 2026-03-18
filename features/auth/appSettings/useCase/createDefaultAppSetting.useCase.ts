import { AuthResult } from "../../shared/authError.types";
import { AppSettingModel } from "../data/dataSource/appSetting.model";

export interface CreateDefaultAppSettingUseCase {
  execute(): Promise<AuthResult<AppSettingModel>>;
}
