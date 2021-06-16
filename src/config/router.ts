import { RouteInterface } from '@/Component/Route/index';
import Page from '@/pages/index';
import loadable from '@loadable/component';

const routesConfig: RouteInterface[] = [
    {
        path: '/',

        component: Page,
        componentPath: 'pages/index.tsx',
        routes: [
            {
                default: true,

                path: '/login',
                component: loadable(() => import('@/pages/login/index')),
                componentPath: 'pages/login/index.tsx',
            },
            {
                path: '/main',
                component: loadable(() => import('@/pages/main/index')),
                componentPath: 'pages/main/index.tsx',
                routes: [
                    {
                        path: '/main/a',
                        component: loadable(() => import('@/pages/main/a/index')),
                        componentPath: 'pages/main/a/index.tsx',
                    },
                    {
                        path: '/main/b',
                        component: loadable(() => import('@/pages/main/b/index')),
                        componentPath: 'pages/main/b/index.tsx',
                    },
                    {
                        path: '/main/c',
                        component: loadable(() => import('@/pages/main/c/index')),
                        componentPath: 'pages/main/c/index.tsx',
                    },
                ],
            },
        ],
    },
];

export default routesConfig;
