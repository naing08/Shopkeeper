/**
 * Created by ChitSwe on 1/25/17.
 */
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import ProductBrand from './reducer/ProductBrand';
import ProductGroup from './reducer/ProductGroup'
import Product from './reducer/Product';
import User from './reducer/User';
import UserAccount from './reducer/UserAccount';
import Customer from './reducer/Customer';
export default ({client})=>{
    const store = createStore(
        combineReducers({
            ProductBrand,
            ProductGroup,
            Product,
            User,
            UserAccount,
            Customer,
            apollo: client.reducer(),
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


