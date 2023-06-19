// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Import
// import { useRouter } from "next/router";

// ** Axios
import axios from "axios";

// ** Config
// import userFinanceConfig from "src/configs/user";

// ** Types
import { ExampleValueType } from "./types";

import backendConfig from "src/configs/backendConfig";

// ** Defaults
const defaultData: ExampleValueType = {
  loading: true,
  isInitialized: false,
  exampleHookData: null,
  setExampleHookData: () => null,
};

const ExampleContext = createContext(defaultData);

type Props = {
  children: ReactNode;
};

const ExampleContextProvider = ({ children }: Props) => {
  // ** States
  const [exampleHookData, setExampleHookData] = useState<{} | null>(null);

  const [loading, setLoading] = useState<boolean>(defaultData.loading);
  const [isInitialized, setIsInitialized] = useState<boolean>(
    defaultData.isInitialized
  );

  const [error, setError] = useState<any>(null);

  // ** Hooks
  // const router = useRouter();

  useEffect(() => {
    const initContext = async (): Promise<void> => {
      setIsInitialized(true);
      try {
        setLoading(true);
        console.log("Example context initiated.");
      } catch (e) {
        setLoading(false);
        setError(e);
        console.log("errorUseEffect initContext", e);
      } finally {
        setLoading(false);
        setIsInitialized(false);
      }
    };
    initContext();
  }, []);

  const values = {
    exampleHookData,
    setExampleHookData,
    isInitialized,
    loading,
    error,
  };

  return (
    <ExampleContext.Provider value={values}>{children}</ExampleContext.Provider>
  );
};

export { ExampleContext, ExampleContextProvider };
