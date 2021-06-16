import "core-js/stable";
import "regenerator-runtime/runtime";
import React from 'react';
import ReactDOM from 'react-dom';
import '@style/index.less';
import App from './App';
ReactDOM.render(<App />, document.getElementById('root'));
if (module.hot) {
    module.hot.accept();
}
