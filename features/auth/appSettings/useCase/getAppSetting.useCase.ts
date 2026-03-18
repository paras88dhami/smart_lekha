import { AuthResult } from "../../shared/authError.types";
import { AppSettingModel } from "../data/dataSource/appSetting.model";

export interface GetAppSettingUseCase {
  execute(): Promise<AuthResult<AppSettingModel | null>>;
}
