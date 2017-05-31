import React from 'react';
import CartItem from './CartItem';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import AppBar from "./AppBar";
import FlatButton from 'material-ui/FlatButton';
import Accounting from 'accounting';
import {withRouter} from 'react-router';

class Cart extends React.Component{
	componentDidMount(){
		let {loadItems} = this.props;
		loadItems();
	}
	render(){
		let {items,grandTotal,router} = this.props;
		return (
			<div className="fullheight layout">
				<AppBar title="Items in Cart"/>
				<div className="fullheight scrollable">
					<div className="cart-grid">
						<div >
							<div className="cart-header row">
								<div className="product-name col-xs-12">Product Name</div>
								<div className="product-numbers row between-xs">
									<div className="product-price">Unit Price</div>
									<div className="product-qty">Qty</div>
									<div className="product-subtotal">Subtotal</div>
								</div>
							</div>
							{items? items.map((i,index)=>(<CartItem key ={i.id} index={index} {...i}/>)):null}
						</div>
						<div className="summary-row row">
							<div className="grandtotal-label col-xs-12">
								Grand Total
							</div>
							<div className="grandtotal-number">
								{Accounting.formatMoney(grandTotal)}
							</div>
						</div>
						<div className="row between-xs cart-actions-row" >
							<FlatButton label="Continue Shopping" primary={true} onClick={()=>{router.push("/");}}/>
							<FlatButton label="PROCEED TO CHECKOUT" primary={true} onClick={()=>{router.push("/checkout")}}/>
						</div>
					</div>
				</div>
			</div>
			);
	}
}

export default compose(
		connect(
			state=>({items:state.ProductBrowser.cart.items,grandTotal:state.ProductBrowser.cart.grandTotal}),
			dispatch=>({
				loadItems:()=>{
					dispatch({type:'PRODUCT_CART_ITEMS_RELOAD'})
				}
			})
			),
		withRouter
	)(Cart);