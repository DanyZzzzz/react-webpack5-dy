import React, { FC } from 'react';
import { Provider, useSelector } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { getStore } from './decorators';
import { reducers } from './storage';

let modules = {};
interface Props {
    children: any;
    value: any;
}

/**
 * ReduxProvider组件
 */
const ReduxProvider: FC<Props> = ({ children, value }) => {
    modules = value;
    const reducer = combineReducers(reducers(modules));
    const store = createStore(reducer, process.env.NODE_ENV === 'development' ? composeWithDevTools() : undefined);
    getStore(store);
    return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;

/**
 * module Hook
 * 使用react-redux的useSelector重新组装每个Module对象
 */
export function useModule<T>(): T {
    const { state } = useSelector(state => ({ state }));
    const obj = {};
    // 重新组装module
    Reflect.ownKeys(modules).forEach(key => {
        const module = Reflect.get(modules, key);
        const moduleState = Reflect.get(state, module.constructor.name);
        Reflect.set(obj, key, Object.assign(module, moduleState));
    });
    // 对Module进行类型断言
    return obj as T;
}
