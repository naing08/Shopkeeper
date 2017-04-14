/**
 * Created by ChitSwe on 12/22/16.
 */
import React from 'react';
import { render } from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'isomorphic-fetch';
import 'babel-polyfill';
import routes from './routes';
import { Router, browserHistory } from 'react-router';
import Preference from '../common/Preference';
import  '../common/dateUtils';
import Accounting from 'accounting';
import {ApolloProvider} from 'react-apollo';
import createApolloClient from '../common/apollo/createApolloClient';
import { createNetworkInterface } from 'apollo-client';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {default as theme} from '../common/adminMuiTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import createStore from '../common/apollo/createAdminStore';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
Accounting.settings = {
    currency: Preference.format.currency,
    number: Preference.format.number
};


const networkInterface = createNetworkInterface({
    uri: '/graphql',
    opts: {
        credentials: 'same-origin',
    },
    transportBatching: true,
});

const client = createApolloClient({
    networkInterface: networkInterface,
    initialState: window.__APOLLO_STATE__, // eslint-disable-line no-underscore-dangle
    ssrForceFetchDelay: 100,
});

const store = createStore({client});
render(
    <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <ApolloProvider client={client} store={store}>
            <Router history={browserHistory} >
                {routes}
            </Router>
        </ApolloProvider>
    </MuiThemeProvider>
    , document.getElementById("content"));

