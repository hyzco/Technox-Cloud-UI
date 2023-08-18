import backendConfig from "./backendConfig";

export default {
  getTotalRequestCount: `${backendConfig.api}/support/totalRequestForUser`,
  getRequest: `${backendConfig.api}/support/getRequestForUser`,
  storageTokenKeyName: `accessToken`,
};
