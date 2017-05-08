import React from 'react';
import AddToCartPopup from './AddToCartPopup';
import Badge from  'material-ui/Badge';
import EditQtyPopup from '../Cart/EditQtyPopup';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ActionAddShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import FloatingActionButton from 'material-ui/FloatingActionButton';

class Fab extends React.Component{
	constructor(){
		super(...arguments);
		this.state={
			addToCartPopoverTargetEl:null
		}
	}
	componentDidMount(){
		let {reloadItemsInCard} = this.props;
		reloadItemsInCard();
	}
	findIndexOfProductInCart(id){
		let index = -1;
		let {cartItems} = this.props;
		for(let item of cartItems){
			if(item.id === id){
				index = cartItems.indexOf(item);
				break;
			}
		}
		return index;
	}
	render(){
		let {id,cartItems,openAddToCartPopover,isAddToCartPopoverOpen,closeAddToCartPopover,ProductById} = this.props;
		let index = id?  this.findIndexOfProductInCart(id) : -1;
		let orderQty = index >=0 ? cartItems[index].Qty:0;
		let addToCartFab = <FloatingActionButton  
						style={orderQty? null:{position:'absolute',right:'30px',bottom:'20px'}}
						onClick={(e)=>{
							e.preventDefault();
							this.setState({addToCartPopoverTargetEl:e.currentTarget});
							openAddToCartPopover();
						}} >

							<ActionAddShoppingCart/>
						</FloatingActionButton>
						;

		return (<div>
				{
						orderQty? <Badge badgeContent={orderQty} 
								secondary={true}
		      					badgeStyle={{top: 10, right: 10}} 
		      					style={{position:'absolute',right:'16px',bottom:'16px'}}>
								{addToCartFab}
							</Badge>
							:
							addToCartFab
				}
				{
					index>=0? 
					<EditQtyPopup open ={isAddToCartPopoverOpen} closeMe={closeAddToCartPopover} index={index} anchorEl={this.state.addToCartPopoverTargetEl}/>
					: 
					<AddToCartPopup Product={ProductById} anchorEl={this.state.addToCartPopoverTargetEl}/>
				}
			</div>)
	}
}

export default compose(
		connect(
			state=>({cartItems:state.ProductBrowser.cart.items,isAddToCartPopoverOpen:state.ProductPage.isAddToCartPopoverOpen}),
			dispatch=>({
					openAddToCartPopover:()=>{
						dispatch({type:'ADD_TO_CART_POPOVER_OPEN'});
					},
					closeAddToCartPopover:()=>{
						dispatch({type:'ADD_TO_CART_POPOVER_CLOSE'});
					},
					reloadItemsInCard:()=>{
						dispatch({type:'PRODUCT_CART_ITEMS_RELOAD'});
					}
				})
			)
	)(Fab);