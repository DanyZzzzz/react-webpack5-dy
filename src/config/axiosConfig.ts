import { message } from 'antd';
import Axios, { AxiosRequestConfig } from 'axios';

class Exception {
    code?: number;
    msg?: string;
    async handle(code: any) {
        switch (code) {
            case 10004:
                localStorage.clear();
                await this.toLoginPage();
                message.error({ content: '登录状态异常，请重新登录', key: 'handle' });
                return;
            default:
        }
    }
    toLoginPage() {
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
export function canCelRequest() {
    source.cancel();
    source = CancelToken.source();
}

instance.defaults.withCredentials = true;
instance.defaults.timeout = 120000;

// instance.defaults.baseURL = 'http://192.168.188.231:9901/';
instance.interceptors.request.use((config: AxiosRequestConfig) => {
    message.loading({ content: '正在请求中', duration: 0, key: 'axiosNet' });
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    return config;
});
const exception = new Exception();

instance.interceptors.response.use(
    function (result: any) {
        if (result.data.code == 200) {
            message.success({ content: '请求成功', duration: 2, key: 'axiosNet' });
        } else {
            message.success({ content: result.data.msg, duration: 2, key: 'axiosNet' });
        }
        exception.handle(result.data.code);
        return Promise.resolve(result.data);
    },
    function (error) {
        if (Axios.isCancel(error)) {
            console.log('重复请求，已被cancel');
        } else {
            console.log('服务器好像挂掉了..');
        }
        return Promise.reject(error);
    }
);
