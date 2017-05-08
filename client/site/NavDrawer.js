import React from 'react';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ActionShoppingCart from 'material-ui/svg-icons/action/shopping-cart';
import ActionDescription from 'material-ui/svg-icons/action/description';
import {CardHeader} from 'material-ui/Card';
import {getUserProfile} from '../auth';
import Badge from "material-ui/Badge";
import {withRouter} from 'react-router';
class NavDrawer extends React.Component{
	constructor(){
		super(...arguments);
		this.state={
			profile_pic:null,
			full_name:'',
			user_name:''
		};
		this.didMounted=false;
	}
	componentDidMount(){
		let profile = getUserProfile();
		let {profile_pic,full_name,user_name} = profile? profile:{};
		this.setState({profile_pic,full_name,user_name});
		this.didMounted = true;
	}

	getCartItems(){
		let cartItems = [];
		if(typeof window !=="undefined"){
			cartItems=JSON.parse(localStorage.getItem("cart_items"));
		}
		return cartItems;
	}


	render(){
		let {open,onDrawerStateChange,router} = this.props
		let {profile_pic,full_name,user_name} = this.state;
		let cartItemsCount = this.didMounted? this.getCartItems().length: 0;


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
								<img src={profile_pic} style={{width:'75px',borderRadius:'50%'}}/>
							</div>
							<CardHeader style={{flexShrink:0}} title={<span style={{color:'#fff'}}>{full_name}</span>} subtitle={<span style={{color:'#fff'}}>{user_name}</span>}/>
						</div>
					</div>
					<Menu>
						<MenuItem onClick={()=>{router.push("/cart");onDrawerStateChange(false);}} primaryText="Cart" leftIcon={<ActionShoppingCart/>} rightIcon={<Badge className="badge" badgeContent={cartItemsCount} secondary={true} badgeStyle={{top: 0, left: 0}}/>}/>
						<MenuItem primaryText="My Orders" leftIcon={<ActionDescription/>}/>
					</Menu>
				</div>
			</Drawer>
			);
	}
}

export default compose(
		connect(
			state=>({open:state.Site.isNavDrawerOpen}),
			dispatch=>({
					onDrawerStateChange:(open)=>{
						if(open)
							dispatch({type:'SITE_NAV_DRAWER_OPEN'});
						else
							dispatch({type:'SITE_NAV_DRAWER_CLOSE'});
					}
				})
			),
		withRouter
	)(NavDrawer);