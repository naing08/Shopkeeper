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
	editCartItem(qty){
		let {editCartQty,items,index} = this.props;
		editCartQty({Qty:qty},index);
	}
	render(){
		let {open,closeMe,anchorEl,items,index} = this.props;
		let addToCartQty = items[index]? items[index].Qty:1;
		return (
			<Popover
				style={{height:'180px'}}
				open={open}
				onRequestClose={closeMe}
				anchorEl={anchorEl}
				anchorOrigin={{horizontal: 'left', vertical: 'top'}}
          		targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
			>
				<div style={{padding:'10px 20px 20px 20px'}}>
					<h4>Order Quantity</h4>					
					<div className="row" style={{alignItems:'center'}}>
						<FloatingActionButton mini={true} onClick={()=>{this.editCartItem(++addToCartQty);}}>
							<ContentAdd/>
						</FloatingActionButton>
						<NumberEditor id="addToCartQty" onChange={(value)=>{this.editCartItem(value);}} className="numberinput" value={addToCartQty} numberPrecision={0} style={{width:'70px',marginLeft:'10px',marginRight:'10px',textAlign:'right'}}/>
						<FloatingActionButton mini={true} onClick={()=>{this.editCartItem(--addToCartQty);}}>
							<ContentRemove/>
						</FloatingActionButton>
					</div>
					<RaisedButton label="OK" onClick={closeMe}/>
				</div>
			</Popover>
			);
	}
}

export default compose(
		connect(
				state=>({items:state.ProductBrowser.cart.items}),
				dispatch=>({					
					editCartQty:(item,index)=>{
						dispatch({type:'PRODUCT_CART_UPDATE_ITEM',item,index});
					}
				})
			)
	)(AddToCartPopup);

