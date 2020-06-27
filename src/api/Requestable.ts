import axios, { AxiosInstance, Method, AxiosPromise, AxiosRequestConfig } from "axios";
import { AuthInfo } from "./types";

class Requestable {
  private baseUrl: string = "https://www.yuque.com/api/v2";
  private axiosInstance: AxiosInstance;
  constructor(protected authInfo: AuthInfo) {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 1000,
      headers: this.getHeaders()
    })
  }

  private getHeaders() {
    return {
      "X-Auth-Token": this.authInfo.token,
      "User-Agent": "vsc-extension"
    }
  }

  request<T>(method: Method, path: string, data: any = {}): AxiosPromise<T> {
    return this.axiosInstance({
      method,
      url: path,
      data,
    }).then(res => {
      if (res.status === 200) {
        return res.data;
      }
    })
  }
}

export default Requestable