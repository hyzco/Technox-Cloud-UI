// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Axios
import axios from "axios";

// ** Config
import userFinanceConfig from "src/configs/user-finance";

// ** Types
import {
  AuthValuesType,
  RegisterParams,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  UserFinanceValuesType,
  UserFinanceDataType,
} from "./types";
import backendConfig from "src/configs/backendConfig";

// ** Defaults
const defaultUser: UserFinanceValuesType = {
  loading: true,
  setLoading: () => Boolean,
  isInitialized: false,
  setIsInitialized: () => Boolean,
  userFinance: null,
  setUserFinance: () => null,
};

const UserFinanceContext = createContext(defaultUser);

type Props = {
  children: ReactNode;
};

const UserFinanceProvider = ({ children }: Props) => {
  // ** States
  const [userFinance, setUserFinance] = useState<UserFinanceDataType | null>(
    defaultUser.userFinance
  );
  const [loading, setLoading] = useState<boolean>(defaultUser.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(
    defaultUser.isInitialized
  );

  const [error, setError] = useState<any>(null);

  // ** Hooks
  const router = useRouter();

  useEffect(() => {
    const initUserFinance = async (): Promise<void> => {
      setIsInitialized(true);
      try {
        setLoading(true);
        getFinance((err) => {
          console.log(err);
        });
      } catch (e) {
        setLoading(false);
        setError(e);
        console.log("errorUseEffect userFinanceContext", e);
      } finally {
        setLoading(false);
        setIsInitialized(false);
      }
    };
    initUserFinance();
  }, []);

  const getFinance = (errorCallback?: ErrCallbackType) => {
    axios
      .get(userFinanceConfig.getFinance, {
        headers: {
          Authorization: window.localStorage.getItem(
            userFinanceConfig.storageTokenKeyName
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

  const values = {
    userFinance,
    loading,
    setUserFinance,
    setLoading,
    isInitialized,
    setIsInitialized,
    error,
  };

  return (
    <UserFinanceContext.Provider value={values}>
      {children}
    </UserFinanceContext.Provider>
  );
};

export { UserFinanceContext, UserFinanceProvider };
