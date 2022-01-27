import Page from '@/pages/index';
import loadable from '@loadable/component';
export const routeConfig = [
    {
        routes: [
            {
                routes: [],
                default: true,
                componentPath: 'pages/login/index.tsx',
                path: '/login',
                component: loadable(() => import('@/pages/login/index'))
            },
            {
                routes: [
                    {
                        routes: [],
                        componentPath: 'pages/main/a/index.tsx',
                        path: '/main/a',
                        component: loadable(() => import('@/pages/main/a/index'))
                    },
                    {
                        routes: [],
                        componentPath: 'pages/main/b/index.tsx',
                        path: '/main/b',
                        component: loadable(() => import('@/pages/main/b/index'))
                    },
                    {
                        routes: [],
                        componentPath: 'pages/main/c/index.tsx',
                        path: '/main/c',
                        component: loadable(() => import('@/pages/main/c/index'))
                    }
                ],
                componentPath: 'pages/main/index.tsx',
                path: '/main',
                component: loadable(() => import('@/pages/main/index'))
            }
        ],
        componentPath: 'pages/index.tsx',
        path: '/',
        component: Page
    }
];
