import backendConfig from "./backendConfig";

export default {
  getFinance: `${backendConfig.api}/user/finance`,
  getServer: `${backendConfig.api}/user/server`,
  storageTokenKeyName: `accessToken`,
};
