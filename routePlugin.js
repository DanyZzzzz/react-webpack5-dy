const fs = require('fs');
const path = require('path');

/**
 * 务必配置src的alias为@
 * 自定义路由映射表生成
 */
class RouterPlugin {
    constructor({ pagePath, output }) {
        if (!pagePath) {
            throw new Error('`pagePath not undefined`');
        }

        this.pagePath = pagePath;
        this.output = output || '.';
        this.componentBase = path.basename(pagePath);
        this.route = null;
    }

    apply(compiler) {
        // watchRun 是异步 hook，使用 tapAsync 触及它，还可以使用 tapPromise/tap(同步)
        // 在自动编译前生成路由映射表
        compiler.hooks.watchRun.tapAsync('RouterPlugin', (compilation, callback) => {
            this.buildRouter();
            callback();
        });

        // 在构建项目时生成路由映射表
        compiler.hooks.beforeRun.tapAsync('RouterPlugin', (compilation, callback) => {
            this.buildRouter();
            callback();
        });
    }

    buildRouter() {
        // import的静态路由
        const staticRoute = [];
        // 读取文件目录生成路由对象
        const routers = getDir(this.pagePath, this.componentBase, staticRoute);
        // 检测是否需要重新生成路由，即pages是否发生了改变，此处做的比较简单只是转换成JSON字符串进行比对
        if (!this.route || JSON.stringify(this.route) !== JSON.stringify(routers)) {
            // 格式化字符串
            let str = JSON.stringify([routers], null, 4);
            // JSON文件转换换成js文件
            str = str.replace(/"/g, '');

            console.log('[自动写入路由配置，成功]');
            // 更新路由JSON字符串
            this.route = routers;
            staticRoute.push(`import loadable from  '@loadable/component';\n`);

            fs.writeFileSync(this.output + '/autoRouter.ts', staticRoute.map(item => item).join('') + 'export const routeConfig = ' + str, {
                flag: 'w',
                encoding: 'utf-8',
                mode: '0666',
            });
        }
    }
}

function getDir(dir, componentBase, staticRoute, routePath) {
    routePath = routePath || '';
    // console.log('[开始]   ======>   ' + dir)
    try {
        const files = fs.readdirSync(dir);
        const childs = [];
        let router = {
            routes: [],
        };

        files.forEach(filename => {
            let pathname = path.join(dir, filename);
            // console.log('[读取]   ======>   ' + pathname)

            const stat = fs.statSync(pathname);

            if ('route' === path.basename(pathname, '.config')) {
                // component = JSON.parse(fs.readFileSync(pathname));
                // //console.log('==================>    ', component, Object.hasOwnProperty(component, 'noLazy'))
                // if (component.hasOwnProperty('default') && component.default) {
                //     router.default = true;

                // }
                router.default = true;
            }
            if ('index' === path.basename(pathname, '.tsx')) {
                router.componentPath = "'" + componentBase + routePath + '/index.tsx' + "'";
                router.path = "'" + routePath + "'";
                router.component = 'loadable(() => import(' + `'@/${componentBase}${routePath}/index'` + '))';

                if (routePath == '') {
                    router.path = "'" + '/' + "'";
                    router.component = 'Page';
                    staticRoute.push(`import Page${titleCase(path.basename(routePath))} from '@/${componentBase + routePath}/index';\n`);
                }
            } else if (stat.isDirectory() && isRoute(filename)) {
                childs.push(pathname);
            }
        });

        childs.forEach(pathname => {
            let child = getDir(pathname, componentBase, staticRoute, routePath + '/' + path.basename(pathname));
            if (child) {
                router.routes.push(child);
            }
        });

        return router;
    } catch (e) {
        console.log('×[自动写入路由配置，失败]');
        return {};
    }
}

function titleCase(str) {
    if (str[0] === '/') {
        str = str.slice(1);
    }
    var newStr = str.split(' ');
    for (var i = 0; i < newStr.length; i++) {
        newStr[i] = newStr[i].slice(0, 1).toUpperCase() + newStr[i].slice(1).toLowerCase();
    }
    return newStr.join(' ');
}

function isRoute(string) {
    return /^[a-z]+$/.test(string);
}

module.exports = RouterPlugin;
