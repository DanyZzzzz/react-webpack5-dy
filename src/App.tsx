import React from 'react';
import { HashRouter } from 'react-router-dom';
import { RouteWithSubRoutes } from './Component/Route/router';
import NoMatch from './pages/__Component/NoMatch';
import { routeConfig } from './config/autoRouter';

function App() {
    return (
        <HashRouter>
            <RouteWithSubRoutes route={routeConfig} NoMatch={NoMatch}></RouteWithSubRoutes>
        </HashRouter>
    );
}

export default App;
