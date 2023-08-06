import axios from "axios";
import backendConfig from "src/configs/backendConfig";
import userConfig from "src/configs/user";

const BASE_URL = backendConfig.api;

let authKey: string = "";

if (typeof window !== "undefined") {
  authKey = window.localStorage.getItem(userConfig.storageTokenKeyName)!;
}

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: authKey,
  },
});
