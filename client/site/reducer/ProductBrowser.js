import update from 'react-addons-update';
const initialData = {
	search:null,
	isSearchMode:false,
	cart:{
		items:[]
	}
}
const cartOperation=(action)=>{
	let jItems = localStorage.getItem('cart_items');
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
			action.item.Qty = Math.max(1,action.item.Qty);
			newState = update(items,{
				[action.index]:{
					$set:Object.assign({},items[action.index],action.item)
				}
			});
			break;
	}
	localStorage.setItem("cart_items", JSON.stringify(newState));
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
		 	return update(state,{
		 		cart:{
		 			items:{
		 				$set:cartOperation(action)
		 			}
		 		}
		 	})
			break;
		default:
			return state;
	}
}
export {initialData};
export default ProductBrowser;