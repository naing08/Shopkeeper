import React from 'react';
import {Card,CardHeader,CardMedia,CardActions} from 'material-ui/Card';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {productByIdQuery} from '../../apollo/Product';
import ContentClear from 'material-ui/svg-icons/content/clear';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import EditQtyPopup from './EditQtyPopup';
import IconButton from 'material-ui/IconButton';
import Accounting from 'accounting';
class CartItem extends React.Component{
	constructor(){
		super(...arguments);
		this.state={anchorEl:null,isOpenEditQtyPopup:false};
	}
	componentWillReceiveProps(nextProps){
		let currentLoading = this.props.loadingProductById;
		let nextLoading = nextProps.loadingProductById;
		let {index} = nextProps;
		if(currentLoading && !nextLoading && nextProps.ProductById){
			let {Price} = nextProps.ProductById;
			nextProps.editItem(index,{Price});
		}
			
	}

	componentWillUpdate(){
		this.isQtyInputGotFocus = this.qtyInput && document.activeElement == this.qtyInput;
	}
	componentDidUpdate(){
		if(this.isQtyInputGotFocus)
			this.qtyInput.focus();
	}
	render(){

		let {ProductById,loadingProductById,index,removeItem,showSnackbar,editItem} = this.props;
		let {DefaultPhoto,Alias,Name,Price} = ProductById?ProductById:this.props;
		let {Qty} = this.props;
		return (
			
			<div className="row cart-item" >
					<IconButton>
						<ContentClear/>
					</IconButton>
					<img style={{width:'75px',height:'75px'}}  src={DefaultPhoto? DefaultPhoto.url:null} />
					<div className="col-xs row cart-product">
						<div className='col-xs-12 cart-product-name'>
							{Name}
						</div>
						<div className="row between-xs around-sm col-xs-12  cart-product-numbers">
							<div className="cart-product-price" >
								{Accounting.formatMoney(Price)}
							</div>
							<div className="cart-product-qty">
								<input ref={input=>{this.qtyInput=input;}} id={`cartItemQty${index}`} name={`cartItemQty${index}`} key={`cartItemQty${index}`} type="text" value={Qty} onChange={e=>{editItem(index,{Qty:e.target.value});}}/>
							</div>
							<div className="cart-product-subtotal">
								{Accounting.formatMoney(Qty * Price)}
							</div>
						</div>
					</div>
				</div>
			);
	}
}

export default compose(		
		connect(
			state=>({}),
			dispatch=>({
				removeItem:index=>{
					dispatch({type:'PRODUCT_CART_REMOVE_ITEM',index});
				},
				editItem:(index,item)=>{
					dispatch({type:'PRODUCT_CART_UPDATE_ITEM',index,item});
				},
				showSnackbar:(message)=>{
					dispatch({type:'SITE_SNACKBAR_OPEN',message})
				}
			})
			),
		productByIdQuery
	)(CartItem);

