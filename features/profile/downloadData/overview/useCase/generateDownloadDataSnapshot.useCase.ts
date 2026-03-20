import type { Result } from "@/shared/types/result.types";
import type { DownloadDataSnapshot } from "../types/types";

export interface GenerateDownloadDataSnapshotUseCase {
  execute(): Promise<Result<DownloadDataSnapshot>>;
}
