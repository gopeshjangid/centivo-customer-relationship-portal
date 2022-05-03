import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/app';
import routes from './routes';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/scss/style.scss';
import configureStore from './store';
import rootSaga from './sagas';
import "react-datepicker/dist/react-datepicker.css";
import Error from './Error';

const store = configureStore(window.__INITIAL_STATE__);
store.runSaga(rootSaga);

ReactDOM.render(
    <Error>
        <App routes={routes} store={store} />
    </Error>, document.getElementById('app'));