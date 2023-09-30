import backendConfig from "./backendConfig";

export default {
  getTotalRequestCountForUser: `${backendConfig.api}/support/totalRequestForUser`,
  getRequestForUser: `${backendConfig.api}/support/getRequestForUser`,
  getRequestForOperator: `${backendConfig.api}/support/getRequestForOperator`,
  getSingleRequest: `${backendConfig.api}/support/getSingleRequest`,
  storageTokenKeyName: `accessToken`,
};
