import React from 'react';
import {Route,IndexRoute} from 'react-router';
import Layout from './layout';
import Home from './components/home';
import ProductBrandBrowser from './components/ProductBrand/index';
import ProductBrowser from './components/ProductBrowser/index';
import UserBrowser from './components/UserManagement/UserBrowser';
import CustomerBrowser from './components/CustomerManagement/CustomerBrowser';
import CustomerViewer from './components/CustomerManagement/CustomerViewer';
import Login from './components/Login';
import CustomerOrderPage from './components/CustomerOrder/index';
import ProductPage from './components/ProductPage/index';
import {default as Test} from '../Test';
export default (
    <Route component={Layout} path="/admin">
        <IndexRoute component={Home}/>
        <Route component={ProductBrandBrowser} path="/admin/ProductBrand"/>
        <Route component={ProductBrowser} path="/admin/Product(/:id)"/>
        <Route component={UserBrowser} path="/admin/UserManagement"/>
        <Route component={CustomerBrowser} path="/admin/CustomerManagement" />
        <Route component={CustomerViewer} path="/admin/Customer(/:id)"/>
        <Route component={CustomerOrderPage} path="/admin/CustomerOrder(/:id)"/>
        <Route component={ProductPage} path="/admin/ProductDetail(/:id)" />
        <Route component={Login} path="/admin/Login"/>
        <Route component={Test} path="/admin/Test"/>
    </Route>
);
