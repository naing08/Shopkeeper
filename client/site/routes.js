/**
 * Created by ChitSwe on 2/25/17.
 */
import React from 'react';
import {Route,IndexRoute} from 'react-router';
import Layout from './layout';
import Home from './component/home';
export default (
    <Route component={Layout} path="/">
        <IndexRoute component={Home}/>
        <Route component={Home} path="/home"/>
    </Route>
);