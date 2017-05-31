/**
 * Created by ChitSwe on 2/25/17.
 */
import React from 'react';
import {Route,IndexRoute} from 'react-router';
import Layout from './layout';
import Home from './components/home';
import ProductBrowser from './components/ProductBrowser/index';
import Login from './components/Login';
import ProductPage from './components/ProductPage/index';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/index';
import CustomerOrder from './components/CustomerOrder/index';
import OrderViewer from './components/OrderViewer/index';
import Grid from './components/CustomerOrder/Grid';
export default (
    <Route component={Layout} path="/">
        <IndexRoute component={Home}/>
        <Route component={Login} path="/Login"/>
        <Route component={Home} path="/home"/>
        <Route component={ProductBrowser} path="/ProductBrowser(/:id)"/>
        <Route component={ProductPage} path="/Product(/:id)"/>
        <Route component={Cart} path="/cart"/>
        <Route component={Checkout} path="/checkout"/>
        <Route component={CustomerOrder} path="/orders"/>
        <Route component={OrderViewer} path="/order/:id"/>
        <Route component={Grid} path="/grid"/>
    </Route>
);