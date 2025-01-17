import { MyDataAccessTokenResponse } from "../types/IA-002";
import { MyDataErrorResponse } from "../types/IA-002";

export function isMyDataError(
    response: MyDataAccessTokenResponse | MyDataErrorResponse
  ): response is MyDataErrorResponse {
    return 'rsp_code' in response;
  }