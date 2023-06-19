import backendConfig from "./backendConfig";

export default {
  getRequest: `${backendConfig.api}/support/getRequestForUser`,
  storageTokenKeyName: `accessToken`,
};
