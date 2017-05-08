/**
 * Created by ChitSwe on 2/25/17.
 */
import React,{PropTypes} from 'react';
import {Link} from 'react-router';
import SiteSnackbar from './components/SiteSnackbar';
import NavDrawer from './NavDrawer';
class Layout extends React.Component{
	
    render(){
        return (

            <div>
                {this.props.children}
                <SiteSnackbar/>
                <NavDrawer/>
            </div>
        );
    }
}

Layout.PropTypes = {
    children:PropTypes.element
};
export default Layout;
