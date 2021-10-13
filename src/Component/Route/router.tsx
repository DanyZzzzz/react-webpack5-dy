import React, { createContext, FC, useContext, useMemo } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RouteInterface, RoutesInterface } from '.';

export const RouterContext = createContext<any>(null);

export const RouteWithSubRoutes: FC<RoutesInterface> = ({ route, NoMatch, before }) => {
    const defaultRouter = route.find(item => item.default && item.path);

    const searchMemo = useMemo(() => {
        return new Set();
    }, [route]);
    const match = window.location.hash.replace('#', '');
    return (
        <Switch>
            {route &&
                route.map((item: RouteInterface) => {
                    searchMemo.add(item.path);
                    return (
                        <Route
                            exact={item.exact}
                            path={item.path}
                            key={item.path}
                            render={(props: any) => {
                                const Warp = <item.component {...props}> </item.component>;
                                before && before(location);
                                return (
                                    <RouterContext.Provider
                                        value={{
                                            router: item.routes && item.routes.length ? <RouteWithSubRoutes route={item.routes} NoMatch={NoMatch} /> : null
                                        }}
                                    >
                                        {Warp}
                                    </RouterContext.Provider>
                                );
                            }}
                        />
                    );
                })}
            {defaultRouter && <Redirect exact from={'/'} to={defaultRouter.path} />}

            {searchMemo.has(match) ? null : <Route path={match} render={NoMatch} />}
        </Switch>
    );
};

export const RouterView = () => {
    const Router = useContext(RouterContext);
    return Router.router ? Router.router : <></>;
};
