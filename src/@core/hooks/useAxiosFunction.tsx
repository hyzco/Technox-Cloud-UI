import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useState, useEffect } from "react";
import { HTTP_METHOD } from "../enums/axios.enum";

interface IAxiosConfigObj {
  axiosInstance: AxiosInstance;
  method: HTTP_METHOD;
  url: string;
  requestConfig: AxiosRequestConfig;
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

  const axiosFetch = async (configObj: IAxiosConfigObj) => {
    const {
      axiosInstance,
      method,
      url,
      requestConfig = {},
    }: IAxiosConfigObj = configObj;

    try {
      setLoading(true);
      const ctrl = new AbortController();
      setController(ctrl);

      const res = await getMethodInstance(method, axiosInstance)(url, {
        ...requestConfig,
        signal: ctrl.signal,
      });
      console.log("HERE");
      setResponse(res.data);
    } catch (err: any) {
      // console.log(err.message);
      setError(err);
    } finally {
      setLoading(false);
      console.log("DONE");
    }
  };

  useEffect(() => {
    // console.log(controller);

    // useEffect cleanup function
    return () => controller && controller.abort();
  }, [controller]);

  return [response, error, loading, axiosFetch];
};

export default useAxiosFunction;
