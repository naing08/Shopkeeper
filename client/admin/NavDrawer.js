import React from 'react';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ActionShoppingCart from 'material-ui/svg-icons/action/shopping-cart';
import ActionDescription from 'material-ui/svg-icons/action/description';
import CommunicationVpnKey from 'material-ui/svg-icons/communication/vpn-key';
import ActionLock from 'material-ui/svg-icons/action/lock';
import {CardHeader} from 'material-ui/Card';
import {logout} from '../auth';
import Badge from "material-ui/Badge";
import {withRouter} from 'react-router';
class NavDrawer extends React.Component{

	render(){
		let {open,onDrawerStateChange,router,userProfile,resetUserProfile} = this.props
		let {profilePic,fullName,userName} = userProfile? userProfile : {};

		return (
			<Drawer
				docked={false}
				width={300}
				open={open}
				onRequestChange={onDrawerStateChange}
			>
				<div className="layout">
					<div style={{height:'168px', backgroundImage:'url("/img/bg_navdrawer_header.png")',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}>
						<div className="layout fullheight" >
							<div className="fullheight" style={{padding:'23px 0 0 15px'}}>
								<img src={profilePic} style={{width:'75px',borderRadius:'50%'}}/>
							</div>
							<CardHeader style={{flexShrink:0}} title={<span style={{color:'#fff'}}>{fullName}</span>} subtitle={<span style={{color:'#fff'}}>{userName}</span>}/>
						</div>
					</div>
					<Menu>
						<MenuItem primaryText="Product Browser" onClick={()=>{router.push('/admin/Product');onDrawerStateChange(false);}} />
						<MenuItem primaryText="Product Brand" onClick={()=>{router.push('/admin/ProductBrand');onDrawerStateChange(false);}}/>
						<MenuItem primaryText="System User" onClick={()=>{router.push('/admin/UserManagement');onDrawerStateChange(false);}}/>
						<MenuItem primaryText="Customers" onClick={()=>{router.push('/admin/CustomerManagement');onDrawerStateChange(false);}}/>
						{userName? <MenuItem primaryText="Log out" onClick={()=>{logout();onDrawerStateChange(false);router.push('/Login');resetUserProfile();}} leftIcon={<ActionLock/>}/>: <MenuItem primaryText="Log in" onClick={()=>{router.push('/Login');onDrawerStateChange(false);}} leftIcon={<CommunicationVpnKey/>}/>}
					</Menu>
				</div>
			</Drawer>
			);
	}
}

export default compose(
		connect(
			state=>({open:state.AdminSite.isNavDrawerOpen,userProfile:state.UserProfile}),
			dispatch=>({
					onDrawerStateChange:(open)=>{
						if(open)
							dispatch({type:'ADMIN_SITE_NAV_DRAWER_OPEN'});
						else
							dispatch({type:'ADMIN_SITE_NAV_DRAWER_CLOSE'});
					},
					resetUserProfile:()=>{
						dispatch({type:'USER_PROFILE_RESET'});
					}
				})
			),
		withRouter
	)(NavDrawer);