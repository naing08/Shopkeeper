/**
 * Created by ChitSwe on 1/25/17.
 */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import ProductBrand from './ProductBrand';
import ProductGroup from './ProductGroup'
import Product from './Product';
import User from './User';
import UserAccount from './UserAccount';
import Customer from './Customer';
import AdminSite from './AdminSite';
import Login from './Login';
import UserProfile from './UserProfile';
export default ({client})=>{
    const store = createStore(
        combineReducers({
            ProductBrand,
            ProductGroup,
            Product,
            User,
            UserAccount,
            Customer,
            AdminSite,
            Login,
            UserProfile,
            apollo: client.reducer()
        }),
        client.initialState, // initial state
        compose(
            applyMiddleware(client.middleware()),
            // If you are using the devToolsExtension, you can add it here also
            typeof window !=='undefined' && window.devToolsExtension ? window.devToolsExtension() : f => f
        )
    );
    return store;
};


