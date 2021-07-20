import React from 'react';
import { HashRouter } from 'react-router-dom';
import { RouteWithSubRoutes } from './Component/Route/router';
import NoMatch from './pages/__Component/NoMatch';
import { routeConfig } from './config/autoRouter';

function App() {
    return (
        <HashRouter>
            <RouteWithSubRoutes
                before={location => {
                    //例如
                    //    if(localStorage.getItem("login")=="false")
                    //     return  window.location.hash="#/login"
                }}
                route={routeConfig}
                NoMatch={NoMatch}
            ></RouteWithSubRoutes>
        </HashRouter>
    );
}

export default App;
