import { message } from 'antd';
import Axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as qs from 'qs';

class Exception {
    code?: number;
    msg?: string;
    async handle(code: any): Promise<void> {
        switch (code) {
            case 10004:
                localStorage.clear();
                await this.toLoginPage();
                message.error({ content: '登录状态异常，请重新登录', key: 'handle' });
                return;
            default:
        }
    }
    toLoginPage(): void | Promise<boolean> {
        const isLoginHash = window.location.hash == '#/login';
        if (!isLoginHash) {
            window.location.hash = '#';
            return new Promise(res => {
                setTimeout(() => {
                    res(true);
                }, 500);
            });
        }
    }
}

export const instance = Axios.create();
const CancelToken = Axios.CancelToken;
let source = CancelToken.source();
export function canCelRequest(): void {
    source.cancel();
    source = CancelToken.source();
}

instance.defaults.withCredentials = true;
instance.defaults.timeout = 120000;

const exception = new Exception();

const request = (config): Promise<AxiosRequestConfig> =>
    new Promise(async resolve => {
        const fooConfig = { ...config };

        fooConfig.url = `${config.url}${config.url.indexOf('?') > -1 ? '&t=' : '?t='}${Date.now()}`;

        // fooConfig.headers['X-Client-Version'] = apiConfig.version; // 自定义请求头

        // const { token } = await cache._getUserKeyInfo();
        // // if (token) fooConfig.headers.Authorization = `Bearer ${token}`;
        // if (token) fooConfig.headers['access-token'] = token;

        resolve(fooConfig);
    });

const requestError = (error: AxiosError): Promise<AxiosError> => Promise.reject(error);

const response = (response: AxiosResponse): AxiosResponse => response;

const responseError = (error: AxiosError): Promise<AxiosError> => {
    const { response } = error;

    if (!response) {
        message.error(error.message);
    }
    exception.handle(error.response.status);
    return Promise.reject(error);
};
// instance.defaults.baseURL = 'http://192.168.188.231:9901/';
instance.interceptors.request.use((config: AxiosRequestConfig) => {
    message.loading({ content: '正在请求中', duration: 0, key: 'axiosNet' });
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    return config;
});

instance.interceptors.request.use(request, requestError);
instance.interceptors.response.use(response, responseError);

const http = {
    CancelToken: Axios.CancelToken,
    request: (options: AxiosRequestConfig): AxiosPromise<any> => instance(options),
    get: (url: string, data: unknown = null, options = null): AxiosPromise => {
        const params: string = qs.stringify(data);
        const query = params ? `${url.indexOf('?') > -1 ? '&' : '?'}${params}` : '';
        return instance(url + query, { ...options });
    },
    post: (url: string, data: unknown = null, options: AxiosRequestConfig = null): AxiosPromise =>
        instance({
            method: 'POST',
            url,
            data,
            ...options
        }),
    put: (url: string, data: unknown = null, options: AxiosRequestConfig = null): AxiosPromise =>
        instance({
            method: 'PUT',
            url,
            data,
            ...options
        }),
    delete: (url: string, data: unknown = null, options: AxiosRequestConfig = null): AxiosPromise =>
        instance({
            method: 'DELETE',
            url,
            data,
            ...options
        })
};

// Mock: 创建 axios 实例
const mockInstance = Axios.create({
    timeout: 1000 * 60,
    baseURL: '/'
});

mockInstance.interceptors.request.use(request, requestError);
mockInstance.interceptors.response.use(response, responseError);

const mock = {
    CancelToken: Axios.CancelToken,
    request: (options: AxiosRequestConfig): AxiosPromise<any> => mockInstance(options),
    get: (url: string, data: unknown = null, options = null): AxiosPromise => {
        const params: string = qs.stringify(data);
        const query = params ? `${url.indexOf('?') > -1 ? '&' : '?'}${params}` : '';
        return mockInstance(url + query, { ...options });
    },
    post: (url: string, data: unknown = null, options: AxiosRequestConfig = null): AxiosPromise =>
        mockInstance({
            method: 'POST',
            url,
            data,
            ...options
        }),
    put: (url: string, data: unknown = null, options: AxiosRequestConfig = null): AxiosPromise =>
        mockInstance({
            method: 'PUT',
            url,
            data,
            ...options
        }),
    delete: (url: string, data: unknown = null, options: AxiosRequestConfig = null): AxiosPromise =>
        mockInstance({
            method: 'DELETE',
            url,
            data,
            ...options
        })
};
export { http, mock };
