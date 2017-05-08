import React from 'react';
import CartItem from './CartItem';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import AppBar from "./AppBar";
class Cart extends React.Component{
	componentDidMount(){
		let {loadItems} = this.props;
		loadItems();
	}
	render(){
		let {items} = this.props;
		return (
			<div className="fullheight layout">
				<AppBar title="Items in Cart"/>
				<div className="fullheight scrollable">
					<div className="row">
						{items? items.map((i,index)=>(<CartItem key ={index} index={index} {...i}/>)):null}
					</div>
				</div>
			</div>
			);
	}
}

export default compose(
		connect(
			state=>({items:state.ProductBrowser.cart.items}),
			dispatch=>({
				loadItems:()=>{
					dispatch({type:'PRODUCT_CART_ITEMS_RELOAD'})
				}
			})
			)
	)(Cart);