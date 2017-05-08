import update from 'react-addons-update';
const initialData ={
	isAddToCartPopoverOpen:false,
	addToCartQty:1
};

const ProductPage=(state=initialData,action)=>{
	switch(action.type){
		case 'ADD_TO_CART_POPOVER_OPEN':
			return update(state,{
				isAddToCartPopoverOpen:{$set:true}
			});
			break;
		case 'ADD_TO_CART_POPOVER_CLOSE':
			return update(state,{
				isAddToCartPopoverOpen:{$set:false}
			});
		case 'ADD_TO_CART_POPOVER_QTY_SET':
			return update(state,{
				addToCartQty:{$set:action.qty}
			});
		default:
			return state;
	}
}

export default ProductPage;