import React from 'react';
import { PathLinkParmas } from '.';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import loadable from '@loadable/component';
import { useHistory } from 'react-router';
/**
 *  预加载
 */
export const PathLink = (props: PathLinkParmas) => {
    const { to, className, style, onClick, componentPath, children } = props;
    const history = useHistory();
    /**
     * 检测点击路由与当前路由是否相同
     * @param path 将要去的路由
     * @returns 查看去的路由和目前路由是否相同
     */
    const isThisPage = (path: string) => {
        const location = window.location;
        const { hash } = location;
        return '#' + path === hash;
    };
    /**
     *检测相同则不前往，不相同则载入路由
     * @returns
     */
    const intercept = () => {
        if (!isThisPage(to)) {
            NProgress.start();

            return new Promise((resolve, reject) => {
                loadable(() =>
                    /* @vite-ignore */
                    import(`@/${componentPath}`).then(
                        res => {
                            resolve(false);
                            NProgress.done();
                            return res;
                        },
                        rej => {
                            NProgress.done();
                            reject(true);
                            return rej;
                        }
                    )
                ).preload();
            });
        } else {
            return true;
        }
    };

    /**
     * 点击事件，这里用来判断前后是否路由相同，且go是否属于promise对象
     * @param e
     */
    const clickLink = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        onClick && onClick(e);
        e.preventDefault();
        const isThis = isThisPage(to);
        const go = await intercept();
        if (!isThis && !go) {
            history.push(to);
        }
    };
    return (
        <a href={to} style={style} className={className} onClick={clickLink}>
            {children}
        </a>
    );
};
