import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router } from '../../services';
import DevTools from './devTools';
import {history} from './../../helpers';

const App = ({ routes, store }) => (
  <Provider store={store}>
    <Router children={routes} history={history} />
    {/* <DevTools /> */}

  </Provider>
);

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
