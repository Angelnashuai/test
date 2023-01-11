import axios, { Canceler } from "axios";
import qs from "qs";

interface requestRes {
  url: string;
  method: string;
  data?: any;
  responseType?: string;
  headers?: any;
  isAutoCancel?: boolean;
  requestID?: string;
  cancelToken?: any;
}

interface pendRequestType {
  data: pendRequestTypeData[];
}

interface pendRequestTypeData {
  name: string;
  cancel: Canceler;
  isAutoCancel?: boolean;
  requestID: string;
}

// 存储当前状态为pending的请求信息
const pendRequest: pendRequestType = {
  data: [],
};

// 获取请求requestID
function getRequestID(config: requestRes) {
  const url = config.url;
  const id = url
    .replace("//", "@")
    .split("/")
    .filter((item, index) => index !== 0)
    .join("/");
  return `${config.method} ${id}`;
}

// 取消重复请求
function cancelRepeatRepuest(config: any) {
  const requestID = getRequestID(config);
  const repeatIndex = pendRequest.data.findIndex((item) => {
    return item.name === requestID;
  });
  console.log("重复请求索引", repeatIndex, pendRequest.data);
  if (repeatIndex > -1) {
    // 取消上个重复的请求
    pendRequest.data[repeatIndex].cancel();
    // 删掉在pendingRequest.data中的请求标识
    pendRequest.data.splice(repeatIndex, 1);
  }
  
}

// 请求完成后删除对应存储列表中请求信息
function finshRequest(config: any) {
  // 已完成请求ID确定是否在pendRequest中存在
  const repeatIndex = pendRequest.data.findIndex((item) => {
    return item.name === config.requestID;
  });
  repeatIndex > -1 && pendRequest.data.splice(repeatIndex, 1);
}

// 添加请求ID，确保每条请求的唯一的
function setRequestId(config: requestRes) {
  const requestID = getRequestID(config);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  config.cancelToken = source.token;
  // 用于响应拦截中区别不同的请求
  config.requestID = requestID;
  pendRequest.data.push({
    name: requestID,
    cancel: source.cancel,
    isAutoCancel: config.isAutoCancel,
    requestID: requestID,
  });
  return config;
}

/**
 *
 * @param optionConfig 请求参数
 * @returns 格式化数据
 */
// get请求特殊处理参数
function setGetOption (option: requestRes) {
  const data = option.data || {};
  try {
    data._requestID = Math.random().toString(36).slice(-8);
  } catch (error) {
    console.error(`${option.url} data's type must be Object`);
  }
  // 对get传参先序列化再拼接。put不用序列化，否则后台可能报500
  const prams = qs.stringify(data);
  const spi = option.url.indexOf('?') === -1 ? '?' : '&';
  option.url = option.url + (prams.length > 0 ? spi + qs.stringify(data) : '');
  delete option['data'];
  return option;
}

// 请求配置格式化处理，确保请求参数一致性
const formatOptionConfig = (optionConfig: requestRes) => {
  // get请求特殊处理
  if(optionConfig.method?.toLowerCase() === 'get'){
    optionConfig = setGetOption(optionConfig);
  }
  // 默认自动取消重复请求
  !optionConfig.isAutoCancel && (optionConfig.isAutoCancel = true);
  // 对URL中包含多个/会导致跨域失败
  if (optionConfig.url.split("//").length > 2) {
    optionConfig.url = optionConfig.url
      .replace(/\/\//g, "/")
      .replace("/", "//");
  }
  optionConfig.method = optionConfig.method.toLocaleUpperCase()
  // 标识请求唯一id
  optionConfig = setRequestId(optionConfig);
  console.log("--------被拦截前格式化--------");
  console.log(pendRequest.data);
  return optionConfig;
};

/**
 * 发起请求前自定义处理，开放给各业务系统单独配置，例如配置mock数据
 */
let _customHttp: any = null;
function setCustomHttp(fn: any): void {
  _customHttp = fn;
}

/**
 * 请求统一自定义处理，开放给各业务系统单独配置
 */
let _customRequest: any = null;
function setCustomRequest(fn: any): void {
  // 参数为函数，执行返回值为对象
  _customRequest = fn;
}

// 请求拦截
axios.interceptors.request.use(
  (config) => {
    // 判断是否取消已有的请求
    console.log("--------拦截到请求--------");
    console.log(config);
    cancelRepeatRepuest(config);
    // 判断是否有自定义配置
    return _customRequest instanceof Function ? _customRequest(config) : config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应统一自定义处理，开放给各业务系统单独配置
 */
let _customResponse: any = null;
function setCustomResponse(fn: any): void {
  _customResponse = fn;
}

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    console.log("-------请求完成-------");
    console.log(response);
    finshRequest(response.config);
    let success = null;
    let error = null;
    // 当状态码高于400为异常状态
    if (response.status > 399) {
      error = response;
    } else {
      success = response.data;
    }
    // 返回统一的数据
    return _customResponse instanceof Function
      ? _customResponse({ success, error, response })
      : { success, error };
  },
  (error) => {
    return Promise.reject(
      _customResponse instanceof Function
        ? _customResponse({ error })
        : { error }
    );
  }
);

async function http(
  optionConfig: requestRes = {
    url: "",
    method: "",
    data: {},
    responseType: "",
    headers: {},
    isAutoCancel: true,
  }
): Promise<any> {
  axios.defaults.withCredentials = true; // 默认设置请求头带cookie
  const newOption: any = formatOptionConfig(optionConfig); // 格式化入参
  const result = await new Promise((resolve) => {
    let interceptor = null; // 拦截请求
    if (_customHttp) {
      interceptor =
        _customHttp.then instanceof Function
          ? _customHttp(newOption)
          : _customHttp(newOption);
    }
    if (interceptor) {
      const success = interceptor;
      resolve(
        _customResponse instanceof Function
          ? _customResponse({ success })
          : { success }
      );
      return;
    }
    axios(newOption)
      .then((responseResult) => {
        resolve(responseResult);
      })
      .catch((responseResult) => {
        resolve(responseResult);
      });
  });
  console.log(2222, result);
  return result;
}
export { http, setCustomHttp, setCustomRequest, setCustomResponse };
