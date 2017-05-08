/**
 * Created by ChitSwe on 1/27/17.
 */
import update from 'react-addons-update';
const ProductGroup = (state={edit:{errors:{},Alias:'',Name:'',Photo:'',PhotoFormat:'',id:null}},action)=>{
    switch(action.type){
        case 'PRODUCT_GROUP_EDIT':
            return update (state,{
                edit:{
                    $set:Object.assign({},state.edit,action.edit)
                }
            });
            break;
        default:
            return state;
            break;
    }
}

export default ProductGroup;