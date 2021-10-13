import { setSession } from './storage';
import { AnyAction, CombinedState, Store } from 'redux';

let store: { dispatch: (arg0: { type: string; payload: any }) => void };

export const getStore = (
    stores: Store<
        CombinedState<{
            [p: string]: any;
        }>,
        AnyAction
    >
) => {
    store = stores;
};

/**
 * 属性队列，用于判断哪些属性是需要添加到sessionStorage中的，
 */
export let SessionMap: Map<string, string[]>;
/**
 * 属性队列，用于判断哪些属性是需要添加到localStorage中的，
 */
export let LocalMap: Map<string, string[]>;

/**
 * 将属性添加到SessionStorage中
 */
export function SessionStorage(...params: any) {
    // 因为是属性装饰器有函数提升效果，所以需要初始化Map，且需要确保SessionMap也存在变量提升！
    SessionMap || (SessionMap = new Map<string, string[]>());
    const [target, property] = params;
    const contextName = target.constructor.name;
    // 将该属性添加到sessionStorage属性队列中去
    let list = SessionMap.get(contextName);
    list = list ? [...list, property] : [property];
    SessionMap.set(contextName, list);
}

/**
 * 将属性添加到LocalStorage中
 */
export function LocalStorage(...params: any) {
    // 因为是属性装饰器有函数提升效果，所以需要初始化Map，且需要确保SessionMap也存在变量提升！
    LocalMap || (LocalMap = new Map<string, string[]>());
    const [target, property] = params;
    const contextName = target.constructor.name;
    // 将该属性添加到sessionStorage属性队列中去
    let list = LocalMap.get(contextName);
    list = list ? [...list, property] : [property];
    LocalMap.set(contextName, list);
}

/**
 * 控制同步更新Module状态，方法被调用时触发
 * @param target 所属Module
 * @param property 方法名为update
 * @param descriptor 方法对象
 */
export function Update(target: any, property: string, descriptor: any) {
    // 限定方法名为update
    if (property !== 'update') return;
    // 保留update原生函数
    const oldFunc = descriptor.value;
    const contextName = target.constructor.name;
    descriptor.value = function () {
        try {
            const value = oldFunc();
            const module = { ...this };
            // 同步dispatch 如UserModule_SET ，即为发送action去更新UserModule
            store.dispatch({
                type: contextName + '_SET',
                payload: module
            });
            setSession(contextName, module);
            return value;
        } catch (e) {
            throw Error(e);
        }
    };
    // 冻结对象
    descriptor.configurable = false;
    descriptor.writable = false;
}

/**
 * 控制同步更新Module状态，方法被调用时触发，但是原生函数必须返回一个promise对象出来。
 * @param target 所属Module
 * @param property 方法名为update
 * @param descriptor 方法对象
 */
export function Action(target: any, property: string, descriptor: any) {
    // 抽出的原生函数在调用时this已经发生了改变
    // 因为被新的async覆盖了，所以需要重新apply(this)进去改变他的上下文环境
    const oldFunc = descriptor.value;
    descriptor.value = async function (...params: any[]) {
        try {
            const value = await oldFunc.apply(this, params);
            const module = { ...this };
            console.log(module);
            // 同步dispatch
            store.dispatch({
                type: target.constructor.name + '_SET',
                payload: module
            });
            setSession(target.constructor.name, module);
            return value;
        } catch (e) {
            throw Error(e);
        }
    };
    // 冻结对象
    descriptor.configurable = false;
    descriptor.writable = false;
}
