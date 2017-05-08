import React,{PropTypes} from 'react';
import {Link} from 'react-router';
import AdminSiteSnackbar from './components/AdminSiteSnackbar';
import LoginDialog from './components/LoginDialog';
import {logout} from '../auth';
class Layout extends React.Component{
    render(){
        return (

            <div>
                {this.props.children}
                <AdminSiteSnackbar/>
                <LoginDialog/>
               
            </div>
        );
    }
}

Layout.PropTypes = {
    children:PropTypes.element
};
export default Layout;
