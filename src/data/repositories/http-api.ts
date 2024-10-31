import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const axiosInstance = axios.create({
  headers: { "Content-type": "application/json" },
  withCredentials: true,
  baseURL: "/vx-health-stats/api",
});

function handleResponse<T>(response: AxiosResponse<T>) {
  return response.data;
}

function handleError(err: Error | AxiosError<any>): never {
  if (axios.isAxiosError(err)) {
    if (!err.response) throw new Error(err.message);
    throw new Error(err.response.data.message as string);
  } else {
    throw new Error(err.message);
  }
}

const httpMethods = {
  get: <T>(url: string, config?: AxiosRequestConfig<unknown> | undefined) =>
    axiosInstance.get<T>(url, config).then(handleResponse).catch(handleError),

  post: <T>(
    url: string,
    body: unknown,
    config?: AxiosRequestConfig<unknown> | undefined
  ) =>
    axiosInstance
      .post<T>(url, body, config)
      .then(handleResponse)
      .catch(handleError),

  put: <T>(
    url: string,
    body: unknown,
    config?: AxiosRequestConfig<unknown> | undefined
  ) =>
    axiosInstance
      .put<T>(url, body, config)
      .then(handleResponse)
      .catch(handleError),

  delete: <T>(url: string, config?: AxiosRequestConfig<unknown> | undefined) =>
    axiosInstance
      .delete<T>(url, config)
      .then(handleResponse)
      .catch(handleError),
};

export default httpMethods;
