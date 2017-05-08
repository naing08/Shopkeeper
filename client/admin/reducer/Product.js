/**
 * Created by ChitSwe on 1/29/17.
 */
import update from 'react-addons-update';

const initialData = {
    errors:{},
    id:null,
    Alias:'',
    Name:'',
    Price:null,
    Description:'',
    Overview:'',
    DefaultPhoto:{
        url:'',
        Format:'',
        FileName:'',
        uploading:false
    },
    Thumbnail:null,
    ProductBrandId:null,
    ProductBrand:null,
    ProductGroupId:null,
    brandSearchText:'',
    isValid:false
};

const productSpecInitialData = {
    Name:'',
    Value:'',
    id:null,
    errors:{}
};

const photoInitialData={
    FileName:'',
    Format:'',
    ProductId:null,
    id:null,
    url:'',
    uploading:false
};

const ProductSpec=(state=productSpecInitialData,action)=>{
  switch (action.type){
      case 'PRODUCT_SPEC_EDIT':
          return Object.assign({},state,action.edit);
        break;
      default:
          return state;
  }
};

const ProductPhoto = (state=photoInitialData,action)=>{
    switch(action.type){
        case 'PRODUCT_PHOTO_EDIT':
            return Object.assign({},state,action.edit);
            break;
        default:
            return state;
    }
};

function validateProduct(product){
    let {Alias,Name,Price,Description,errors} = product;
    errors=errors? errors:{};
    let isValid = true;
    if(!Alias) {
        errors.Alias = "Alias is required";
        isValid = false;
    }else
        errors.Alias = '';
    if(!Name) {
        errors.Name = "Name is required";
        isValid = false;
    }else
        errors.Name = '';
    if(!Price) {
        errors.Price = "Price is required";
        isValid=false;
    }else
        errors.Price='';
    if(!Description) {
        errors.Description = "Description is required";
        isValid = false;
    }else
        errors.Description = '';
    return {isValid,errors};
}

const Product =(state={edit:initialData},action)=>{
    switch(action.type){
        case 'PRODUCT_EDIT':
            let newProduct=Object.assign({},state.edit,action.edit);
            newProduct = Object.assign(newProduct,validateProduct(newProduct));
            return update(state,{
                edit:{
                    $set:newProduct
                }
            });
            break;
        case 'PRODUCT_DEFAULT_PHOTO_EDIT':
            return update(state,{
                edit:{
                    DefaultPhoto:{
                        $set:Object.assign({},state.edit.DefaultPhoto,action.DefaultPhoto)
                    }
                }
            });
            break;
        case 'PRODUCT_VALIDATE':
            return update(state,{
                edit:{
                    $set:Object.assign({},state.edit,validateProduct(state.edit))
                }
            });
            break;

        case 'PRODUCT_SPEC_EDIT':
            let {index,edit}=action;
            if(index != null){
                 return update(state,{
                     edit:{
                         ProductSpec:{
                             [index]:{
                                 $set:ProductSpec(state.edit.ProductSpec[index],action)
                             }
                         }
                     }
                 });
            }else{
                return update(state,{
                    edit:{
                        ProductSpec:{
                            $unshift:[ProductSpec(null,action)]
                        }
                    }
                });
            }
            break;
        case 'PRODUCT_SPEC_DESTROY':
            let newState = update(state,{
                edit:{
                    ProductSpec:{
                        $splice:[[action.index,1]]
                    },
                    specErrors:{
                        $set:[]//reset errors
                    }
                }
            });
            return newState;
            break;
        case 'PRODUCT_PHOTO_ADD':
            return update(state,{
                edit:{
                    Photo:{
                        $unshift:action.photo
                    }
                }
            });
            break;

        case 'PRODUCT_PHOTO_DESTROY':
            return update(state,{
                edit:{
                    Photo:{
                        $splice:[[action.index,1]]
                    }
                }
            });
            break;
        case 'PRODUCT_PHOTO_EDIT':
            return update(state,{
                edit:{
                    Photo:{
                        [action.index]:{
                            $set:ProductPhoto(state.edit.Photo[action.index],action)
                        }
                    }
                }
            });
            break;
        default:
            return state;
            break;
    }
};


export {initialData,productSpecInitialData,photoInitialData};
export default Product;