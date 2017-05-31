import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import Accounting from 'accounting';
import {Card,CardText} from 'material-ui/Card'
import OrderPreviewItem from './OrderPreviewItem';

class OrderPreview extends React.Component{
	componentDidMount(){
		let {loadItems} = this.props;
		loadItems();
	}
	render(){
		let {items,grandTotal} = this.props;
		return (
		<Card className="order_preview_panel">
			<CardText>
				<div className="header row">
					<div className="product_name">Product Name</div>
					<div className="qty">Qty</div>
					<div className="subtotal">Subtotal</div>
				</div>
				{
					items? items.map((i,index)=>(<OrderPreviewItem key ={i.id} index={index} {...i}/>)):null
				}
				<div className="footer">
					<div className="row">
						<div className="label grand_total">GRAND TOTAL</div>
						<div className="value grand_total">{Accounting.formatMoney(grandTotal)}</div>
					</div>
				</div>
			</CardText>
		</Card>);
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
			)
	)(OrderPreview);