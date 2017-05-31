import React,{PropTypes} from 'react';
import {Link} from 'react-router';
import AdminSiteSnackbar from './components/AdminSiteSnackbar';
import LoginDialog from './components/LoginDialog';
import {logout} from '../auth';
import NavDrawer from './NavDrawer';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {getUserProfile} from '../auth';
class Layout extends React.Component{
    componentDidMount(){
        let {setUserProfile} = this.props;
        let {user_id,user_name,account_type,profile_pic,full_name,entity_id} = getUserProfile();
        setUserProfile({
            userId:user_id,
            userName:user_name,
            accountType:account_type,
            profilePic:profile_pic,
            fullName:full_name,
            entityId:entity_id
        });
    }
    render(){
        return (

            <div>
                {this.props.children}
                <AdminSiteSnackbar/>
                <LoginDialog/>
               <NavDrawer/>
            </div>
        );
    }
}

Layout.PropTypes = {
    children:PropTypes.element
};
export default compose(
        connect(
            state=>({}),
            dispatch=>({
                setUserProfile:(edit)=>{
                    dispatch({type:'USER_PROFILE_EDIT',edit});
                }
            })
            )
    )(Layout);
