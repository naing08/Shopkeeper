import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import NumberEditor from  '../../../common/NumberEditor';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

class AddToCartPopup extends React.Component{
	addCartItem(){
		let {Product,addToCartQty,addCartItem,closeMe,showSnackbar} = this.props;
		let {id,Alias,Name} = Product;
		addCartItem({id,Alias,Name,Qty:addToCartQty});
		closeMe();
		showSnackbar(`${addToCartQty} of ${Name} has been added to cart.`);
	}
	render(){
		let {open,closeMe,anchorEl,addToCartQty,setQty} = this.props;
		return (
			<Popover
				style={{height:'180px'}}
				open={open}
				onRequestClose={closeMe}
				anchorEl={anchorEl}
				anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          		targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
			>
				<div style={{padding:'10px 20px 20px 20px'}}>
					<h4>Order Quantity</h4>					
					<div className="row" style={{alignItems:'center'}}>
						<FloatingActionButton mini={true} onClick={()=>{setQty(++addToCartQty);}}>
							<ContentAdd/>
						</FloatingActionButton>
						<NumberEditor id="addToCartQty" onChange={setQty} className="numberinput" value={addToCartQty} numberPrecision={0} style={{width:'70px',marginLeft:'10px',marginRight:'10px',textAlign:'right'}}/>
						<FloatingActionButton mini={true} onClick={()=>{setQty(--addToCartQty);}}>
							<ContentRemove/>
						</FloatingActionButton>
					</div>
					<RaisedButton label="OK" onClick={this.addCartItem.bind(this)}/>
				</div>
			</Popover>
			);
	}
}

export default compose(
		connect(
				state=>({open:state.ProductPage.isAddToCartPopoverOpen,addToCartQty:state.ProductPage.addToCartQty}),
				dispatch=>({
					closeMe:()=>{
						dispatch({type:'ADD_TO_CART_POPOVER_CLOSE'});
					},
					setQty:(qty)=>{
						dispatch({type:'ADD_TO_CART_POPOVER_QTY_SET',qty});
					},
					addCartItem:(item)=>{
						dispatch({type:'PRODUCT_CART_ADD_ITEM',item});
					},
					showSnackbar:(message)=>{
						dispatch({type:'SITE_SNACKBAR_OPEN',message});
					}
				})
			)
	)(AddToCartPopup);

