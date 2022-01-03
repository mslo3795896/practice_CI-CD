import { getLocalStorage } from "@utils/localStorage";

export const DEFAULT_API_PATH_DEV = 'https://20a423fe-4a7f-45c2-9722-a384e70b0025.mock.pstmn.io';
export const DEFAULT_API_PATH_TEST = '/api';
export const DEFAULT_API_PATH_PROD = '/api';
export const DEFAULT_API_PATH = '/api';

const getBaseURL = () => {
  const isDevSite = window.globalData.APP_ENV === 'local';
  const isSetApiDev = getLocalStorage('set.isApiDev');
  const isDevelopment = import.meta.env.MODE === 'development';

  if(isSetApiDev && isDevSite) {
    return DEFAULT_API_PATH_DEV
  }
  if(isDevelopment) {
    return DEFAULT_API_PATH_TEST
  }
  if(!isSetApiDev && !isDevelopment) {
    return DEFAULT_API_PATH_PROD
  }

  return DEFAULT_API_PATH
};

const baseURL = getBaseURL();

export default {
  name: 'api', // api 名稱
  baseURL: baseURL, // baseURL,
  endLoadingDelay: 0, // 延遲loading結束時間
  errorHandle: true, // 執行錯誤處理（顯示message, 登出判斷, reject）
  showMessage: true, // 顯示message
  logoutRedirect: true, // 登出轉址判斷
  isThrottle: false, // 防止連續執行兩次(開發中)
}
