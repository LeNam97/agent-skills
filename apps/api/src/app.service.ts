import { Injectable } from "@nestjs/common";
import { EntityStatus } from "@ac/models/types";
import { API_COMMON_VERSION } from "@ac/common";

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: "ok",
      packages: {
        commonVersion: API_COMMON_VERSION,
        entityStatus: EntityStatus.ACTIVE,
      },
    };
  }
}
