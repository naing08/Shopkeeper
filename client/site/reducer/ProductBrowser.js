import update from 'react-addons-update';
import {setCookie,getCookie} from '../../cookieManager';
const initialData = {
	search:null,
	isSearchMode:false,
	cart:{
		items:[],
		grandTotal:0
	}
}
const computeGrandTotal=(cartItems)=>{
	let grandTotal = 0;
	for(let item of cartItems){
		let subTotal = item.Qty * item.Price;
		grandTotal += subTotal || !isNaN(subTotal)? subTotal:0;
	}
	return grandTotal;
}
const cartOperation=(action)=>{
	let jItems = getCookie('cart_items');
	let items = jItems? JSON.parse(jItems):[];
	let newState = items;
	switch(action.type){
		case 'PRODUCT_CART_ADD_ITEM':
			action.item.Qty = Math.max(1,action.item.Qty);
			newState =  update(items,{
				$unshift:[action.item]
			});
			break;
		case 'PRODUCT_CART_REMOVE_ITEM':
			newState =  update(items,{
				$splice:[[action.index,1]]
			});
			break;
		case 'PRODUCT_CART_UPDATE_ITEM':
			let newItem = Object.assign({},items[action.index],action.item);
			if(!newItem.Qty)
				newItem.Qty = 1;
			newItem.Qty = Math.max(1,newItem.Qty);
			newState = update(items,{
				[action.index]:{
					$set:newItem
				}
			});
			break;
		case 'PRODUCT_CART_ITEMS_RESET':
			newState=[];
			break;
	}
	setCookie("cart_items", JSON.stringify(newState));
	return newState;
};

const ProductBrowser = (state = initialData,action)=>{
	let newState = null;
	switch(action.type){
		case 'PRODUCT_BROWSER_SEARCH':
			return update(state,{
				search:{$set:action.search}
			});
			break;
		case 'PRODUCT_BROWSER_SHOW_SEARCH':
			return update(state,{
				isSearchMode:{$set:true}
			});
			break;
		case 'PRODUCT_BROWSER_HIDE_SEARCH':
			return update(state,{
				isSearchMode:{$set:false}
			});
		case 'PRODUCT_CART_ADD_ITEM':
		case 'PRODUCT_CART_REMOVE_ITEM':			
		case 'PRODUCT_CART_UPDATE_ITEM':
		case 'PRODUCT_CART_ITEMS_RELOAD':
		case 'PRODUCT_CART_ITEMS_RESET':
		 	newState= update(state,{
		 		cart:{
		 			items:{
		 				$set:cartOperation(action)
		 			},
		 			grandTotal:{
		 				$set:0
		 			}
		 		}
		 	});
		 	return update(newState,{
		 		cart:{
		 			grandTotal:{
		 				$set:computeGrandTotal(newState.cart.items)
		 			}
		 		}
		 	});
			break;
		default:
			return state;
	}
}
export {initialData};
export default ProductBrowser;