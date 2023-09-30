import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useState, useEffect } from "react";
import { HTTP_METHOD } from "../enums/axios.enum";

// interface IAxiosConfigObj {
//   axiosInstance: AxiosInstance;
//   method: HTTP_METHOD;
//   url: string;
//   requestConfig: AxiosRequestConfig;
//   body?: {};
// }
interface IAxiosConfigObj<M extends HTTP_METHOD> {
  axiosInstance: AxiosInstance;
  method: M;
  url: string;
  requestConfig: AxiosRequestConfig;
  body?: M extends "POST" ? {} : never; // Set body to {} only if method is 'POST'
}

const useAxiosFunction = () => {
  console.log("CALLED");
  const [response, setResponse] = useState<any>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); //different!
  const [controller, setController] = useState<AbortController>();

  const getMethodInstance = (
    method: HTTP_METHOD,
    axiosInstance: AxiosInstance
  ) => {
    switch (method) {
      case HTTP_METHOD.GET.toString():
        return axiosInstance.get;
      case HTTP_METHOD.POST.toString():
        return axiosInstance.post;
      case HTTP_METHOD.PUT.toString():
        return axiosInstance.put;
      case HTTP_METHOD.DELETE.toString():
        return axiosInstance.delete;
      default:
        throw new Error(`Invalid HTTP method`);
    }
  };

  const axiosFetch = async (configObj: IAxiosConfigObj<HTTP_METHOD>) => {
    const {
      axiosInstance,
      method,
      url,
      requestConfig = {},
      body,
    }: IAxiosConfigObj<HTTP_METHOD> = configObj;

    try {
      setLoading(true);
      const ctrl = new AbortController();
      setController(ctrl);

      if (method === HTTP_METHOD.POST || method === HTTP_METHOD.PUT) {
        const res = await getMethodInstance(method, axiosInstance)(url, body, {
          ...requestConfig,
          signal: ctrl.signal,
        });
        console.log("HERE");
        setResponse(res.data);
      } else {
        const res = await getMethodInstance(method, axiosInstance)(url, {
          ...requestConfig,
          signal: ctrl.signal,
        });
        console.log("HERE");
        setResponse(res.data);
      }
    } catch (err: any) {
      // console.log(err.message);
      if (err) {
        setError(err);
      }
    } finally {
      setLoading(false);
      console.log("DONE");
    }
  };

  useEffect(() => {
    // console.log(controller);

    // useEffect cleanup function
    return () => {
      controller && controller.abort();
      setError("");
      setResponse("");
    };
  }, [controller]);

  return [response, error, loading, axiosFetch];
};

export default useAxiosFunction;
