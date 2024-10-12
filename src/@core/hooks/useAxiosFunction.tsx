import { AxiosInstance, AxiosRequestConfig } from "axios";
import { useState, useEffect, useCallback } from "react";
import { HTTP_METHOD } from "../enums/axios.enum";

interface IAxiosConfigObj<M extends HTTP_METHOD> {
  axiosInstance: AxiosInstance;
  method: M;
  url: string;
  requestConfig?: AxiosRequestConfig;
  body?: M extends HTTP_METHOD.POST | HTTP_METHOD.PUT | HTTP_METHOD.DELETE
    ? {}
    : never;
  headers?: { Authorization: string } & Record<string, string>;
}

const useAxiosFunction = () => {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const axiosFetch = useCallback(
    async <M extends HTTP_METHOD>(configObj: IAxiosConfigObj<M>) => {
      const {
        axiosInstance,
        method,
        url,
        requestConfig = {},
        body,
        headers,
      } = configObj;

      setLoading(true);
      const ctrl = new AbortController();
      setController(ctrl);

      try {
        const axiosMethod = axiosInstance[
          method.toLowerCase() as keyof AxiosInstance
        ] as (
          url: string,
          data?: any,
          config?: AxiosRequestConfig
        ) => Promise<any>;

        const config: AxiosRequestConfig = {
          ...requestConfig,
          signal: ctrl.signal,
          headers: headers,
        };

        const res =
          method === HTTP_METHOD.POST || method === HTTP_METHOD.PUT
            ? await axiosMethod(url, body, config)
            : await axiosMethod(url, config);

        setResponse(res.data);
        setError(null);
      } catch (err: any) {
        setError(err);
        setResponse(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      controller?.abort();
      setError(null);
      setResponse(null);
    };
  }, [controller]);

  return { response, error, loading, axiosFetch };
};

export default useAxiosFunction;
