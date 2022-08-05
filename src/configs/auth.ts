import backendConfig from "./backendConfig";

export default {
  meEndpoint: `${backendConfig.api}/auth/me`,
  loginEndpoint: `${backendConfig.api}/auth/login`,
  registerEndpoint: `${backendConfig.api}/auth/register`,
  storageTokenKeyName: `accessToken`,
};
