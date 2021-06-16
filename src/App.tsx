import React from 'react';
import { HashRouter } from 'react-router-dom';
import { RouteWithSubRoutes } from './Component/Route/router';
import routesConfig from './config/router';
import NoMatch from './pages/__Component/NoMatch';

function App() {
    return (
        <HashRouter>
            <RouteWithSubRoutes route={routesConfig} NoMatch={NoMatch}></RouteWithSubRoutes>
        </HashRouter>
    );
}

export default App;
