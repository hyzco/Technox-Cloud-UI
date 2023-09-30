// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Axios
import axios from "axios";

// ** Config
import userConfig from "src/configs/user";
import authConfig from "src/configs/auth";

// ** Types
import {
  AuthValuesType,
  RegisterParams,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  UserValuesType,
  UserFinanceDataType,
  UserServerDataType,
} from "./types";

import backendConfig from "src/configs/backendConfig";

// ** Defaults
const defaultUser: UserValuesType = {
  loading: true,
  isInitialized: false,
  userFinance: null,
  // setUserFinance: () => null,
  userServer: null,
  setUserServer: () => null,
};

const UserContext = createContext(defaultUser);

type Props = {
  children: ReactNode;
};

const UserProvider = ({ children }: Props) => {
  // ** States
  const [userFinance, setUserFinance] = useState<UserFinanceDataType | null>(
    defaultUser.userFinance
  );

  const [userServer, setUserServer] = useState<UserServerDataType | null>(
    defaultUser.userServer
  );

  const [loading, setLoading] = useState<boolean>(defaultUser.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(
    defaultUser.isInitialized
  );

  const [error, setError] = useState<any>(null);

  // ** Hooks
  const router = useRouter();

  useEffect(() => {
    const initUser = async (): Promise<void> => {
      setIsInitialized(true);
      try {
        setLoading(true);
        // getFinance((err) => {
        // console.log(err);
        // });
        // getServer((err) => {
        // console.log(err);
        // window.localStorage.removeItem("userData");
        // window.localStorage.removeItem(authConfig.storageTokenKeyName);
        // router.push("/auth/login");
        // throw new Error("Login failed");
        // });
      } catch (e) {
        setLoading(false);
        setError(e);
        console.log("errorUseEffect initUser", e);
      } finally {
        // console.log("here");
        setLoading(false);
        setIsInitialized(false);
      }
    };
    initUser();
  }, []);

  const getFinance = (errorCallback?: ErrCallbackType) => {
    axios
      .get(userConfig.getFinance, {
        headers: {
          Authorization: window.localStorage.getItem(
            userConfig.storageTokenKeyName
          )!,
        },
      })
      .then(async (res) => {
        setUserFinance(res.data.financeData);
      })
      .catch((err) => {
        console.log(err);
        if (errorCallback) errorCallback(err);
      });
  };

  const getServer = (errorCallback?: ErrCallbackType) => {
    axios
      .get(userConfig.getServer, {
        headers: {
          Authorization: window.localStorage.getItem(
            userConfig.storageTokenKeyName
          )!,
        },
      })
      .then(async (res) => {
        setUserServer(res.data.userServer);
      })
      .catch((err) => {
        console.log(err);
        if (errorCallback) errorCallback(err);
      });
  };

  const values = {
    userFinance,
    userServer,
    isInitialized,
    setUserServer,
    loading,
    error,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
