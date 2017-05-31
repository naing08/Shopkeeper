import React from 'react';
import {compose} from 'react-apollo';
import {productByIdQuery} from '../../apollo/Product';
import Accounting from 'accounting';
import {connect} from 'react-redux';
class OrderPreviewItem extends React.Component{
	componentWillReceiveProps(nextProps){
		let currentLoading = this.props.loadingProductById;
		let nextLoading = nextProps.loadingProductById;
		let {index} = nextProps;
		if(currentLoading && !nextLoading && nextProps.ProductById){
			let {Price} = nextProps.ProductById;
			nextProps.editItem(index,{Price});
		}
			
	}

	render(){
		let {ProductById,loadingProductById,index} = this.props;
		let {DefaultPhoto,Alias,Name,Price} = ProductById?ProductById:this.props;
		let {Qty} = this.props;
		return (
				<div className="item row">
					<div className="product_name">{Name}</div>
					<div className="qty">{Qty}</div>
					<div className="subtotal">{Accounting.formatMoney(Qty * Price)}</div>
				</div>
			);
	}
}

export default compose(		
		connect(
				state=>({}),
				dispatch=>({
					editItem:(index,item)=>{
						dispatch({type:'PRODUCT_CART_UPDATE_ITEM',index,item});
					}
				})
				),
		productByIdQuery
	)(OrderPreviewItem);

