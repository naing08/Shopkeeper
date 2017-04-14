/**
 * Created by ChitSwe on 1/25/17.
 */
import update from 'react-addons-update';


const ProductBrand =(state={edit:{errors:{},Alias:'',Name:'',Photo:'',PhotoFormat:''}},action)=>{
    switch(action.type){
        case 'PRODUCT_BRAND_EDIT':
            return update(state,{
                edit:{
                    $set:Object.assign({},state.edit,action.edit)
                }
            });
            break;
        default:
            return state;
            break;
    }
};

export default ProductBrand;