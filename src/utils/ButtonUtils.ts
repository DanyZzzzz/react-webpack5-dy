/**
 * @File: ButtonUtils
 * @Author: Dy
 * @Date: 2021/3/5
 * @Description: 防抖与节流
 */

// 防抖
export const beBounce = (fn: any, delay?: number) => {
    delay = delay || 200;
    let timer: any;
    return (...args: any) => {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
};

// 节流
export const throttle = (fn: any, delay?: number) => {
    delay = delay || 200;
    let timer: any;
    return (...args: any) => {
        if (!timer) {
            timer = setTimeout(() => {
                timer = null;
                fn(...args);
            }, delay);
        }
    };
};
