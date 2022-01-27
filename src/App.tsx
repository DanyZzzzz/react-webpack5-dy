import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import { RouteWithSubRoutes } from './Component/Route/router';
import NoMatch from './pages/__Component/NoMatch';
import { routeConfig } from './config/autoRouter';

function App(): React.ReactElement {
    return (
        <HashRouter>
            <RouteWithSubRoutes
                before={(location): void => {
                    console.log(location);
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
