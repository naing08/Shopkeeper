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
		let {open,onDrawerStateChange,router,cartItems,userProfile,resetUserProfile} = this.props
		let {profilePic,fullName,userName} = userProfile? userProfile : {};
		let cartItemsCount = cartItems? cartItems.length: 0;

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
						<MenuItem onClick={()=>{router.push("/cart");onDrawerStateChange(false);}} primaryText="Cart" leftIcon={<ActionShoppingCart/>} rightIcon={<Badge className="badge" badgeContent={cartItemsCount} secondary={true} badgeStyle={{top: 0, left: 0}}/>}/>
						<MenuItem onClick={()=>{router.push("/orders");onDrawerStateChange(false);}} primaryText="My Orders" leftIcon={<ActionDescription/>}/>
						{userName? <MenuItem primaryText="Log out" onClick={()=>{logout();onDrawerStateChange(false);router.push('/Login');resetUserProfile();}} leftIcon={<ActionLock/>}/>: <MenuItem primaryText="Log in" onClick={()=>{router.push('/Login');onDrawerStateChange(false);}} leftIcon={<CommunicationVpnKey/>}/>}
					</Menu>
				</div>
			</Drawer>
			);
	}
}

export default compose(
		connect(
			state=>({open:state.Site.isNavDrawerOpen,cartItems:state.ProductBrowser.cart.items,userProfile:state.UserProfile}),
			dispatch=>({
					onDrawerStateChange:(open)=>{
						if(open)
							dispatch({type:'SITE_NAV_DRAWER_OPEN'});
						else
							dispatch({type:'SITE_NAV_DRAWER_CLOSE'});
					},
					resetUserProfile:()=>{
						dispatch({type:'USER_PROFILE_RESET'});
					}
				})
			),
		withRouter
	)(NavDrawer);