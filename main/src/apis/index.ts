import { http } from "@/utils/http";

interface requestRes {
  url: string;
  method: string;
  data?: any;
  responseType?: string;
  headers?: any;
}

export function search(): any {
  const resData: requestRes = {
    url: "/weather/data/cityinfo/101010100.html",
    method: "get",
  };
  return http(resData);
}
