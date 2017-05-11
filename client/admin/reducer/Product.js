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
    errors:{},
    isValid:true
};

const photoInitialData={
    FileName:'',
    Format:'',
    id:null,
    url:'',
    uploading:false,
    error:''
};

const productPriceInitialData={
    id:null,
    Name:'',
    Price:null,
    errors:{},
    isValid:false
};

const relatedProductInitialData={
    id:null,
    Alias:'',
    Name:'',
    DefaultPhotoUrl:null,
    loading:false
};

function validateProductPrice(price){
    let {Price,errors} = price;
    errors = errors? errors:{};
    let isValid = true;
    if(!Price && Price !==0){
        isValid = false;
        errors.Price="Price is invalid.";
    }else
        errors.Price="";
    return {isValid,errors};
}

const ProductPrice=(state=productPriceInitialData,action)=>{
    switch(action.type){
        case 'PRODUCT_PRICE_EDIT':
            let newPrice = Object.assign({},state,action.edit);
            return Object.assign({},newPrice,validateProductPrice(newPrice));
            break;
    }
}

const ProductSpec=(state=productSpecInitialData,action)=>{
  switch (action.type){
      case 'PRODUCT_SPEC_EDIT':
            let newSpec = Object.assign({},state,action.edit);
            return Object.assign({},newSpec,validateProductSpec(newSpec));
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

const RelatedProduct=(state=relatedProductInitialData,action)=>{
    switch(action.type){
        case 'PRODUCT_RELATED_PRODUCT_EDIT':
            return Object.assign({},state,action.edit)
            break;
        default:
            return state;
    }
}

function validateProductSpec(spec){
    let {Name,Value,errors}=spec;
    errors=errors? errors:{};
    let isValid = true;
    if(!Name) {
        errors.Name="Name is required";
        isValid=false;
    }else
        errors.Name="";

    if(!Value){
        errors.Value="Value is required";
        isValid = false;
    }else
        errors.Value="";
    return {isValid,errors};
}

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

const Product =(state={edit:initialData,spec:[],photo:[],price:[],relatedProducts:[]},action)=>{
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
            let newSpec = ProductSpec(state.spec[index],action);
            return update(state,{
                     spec:{
                             [index]:{
                                 $set:newSpec
                             }
                         }
                 });
            break;
        case 'PRODUCT_SPEC_SET':
            return update(state,{
                spec:{
                    $set:action.spec
                }
            });
            break;
        case 'PRODUCT_SPEC_ADD':
            return update(state,{
                    spec:{
                        $push:[ProductSpec(null,{type:'PRODUCT_SPEC_EDIT',edit:productSpecInitialData})]
                    }
                });
            break;
        case 'PRODUCT_SPEC_DESTROY':
            let newState = update(state,{
                spec:{
                    $splice:[[action.index,1]]
                }
            });
            return newState;
            break;
        case 'PRODUCT_PHOTO_SET':
            return update(state,{
                photo:{
                    $set:action.photo
                }
            });
            break;
        case 'PRODUCT_PHOTO_ADD':
            return update(state,{
                photo:{
                        $unshift:action.photo
                    }
            });
            break;
        case 'PRODUCT_PHOTO_DESTROY':
            return update(state,{
                photo:{
                    $splice:[[action.index,1]]
                }
            });
            break;
        case 'PRODUCT_PHOTO_EDIT':
            return update(state,{
                photo:{
                    [action.index]:{
                        $set:ProductPhoto(state.photo[action.index],action)
                    }
                }
            });
            break;
        case 'PRODUCT_PRICE_EDIT':
            return update(state,{
                price:{
                    [action.index]:{
                        $set:ProductPrice(state.price[action.index],action)
                    }
                }
            });
            break;
        case 'PRODUCT_PRICE_ADD':
            return update(state,{
                price:{
                    $push:[Object.assign({},action.productPrice,{errors:{}})]
                }
            });
            break;
        case 'PRODUCT_PRICE_SET':
            return update(state,{
                price:{
                    $set:action.items
                }
            });
        case 'PRODUCT_RELATED_PRODUCTS_SET':
            return   update(state,{
                relatedProducts:{
                    $set:action.items
                }
            });
            break;
        case 'PRODUCT_RELATED_PRODUCT_ADD':
            return update(state,{
                relatedProducts:{
                    $push:[action.relatedProduct]
                }
            });
        case 'PRODUCT_RELATED_PRODUCT_REMOVE':
            return update(state,{
                relatedProducts:{
                     $splice:[[action.index,1]]
                }
            })
            break;
        case 'PRODUCT_RELATED_PRODUCT_EDIT':
            return update(state,{
                relatedProducts:{
                    [action.index]:{
                        $set:RelatedProduct(state.relatedProducts[index],action)
                    }
                }
            });
        default:
            return state;
            break;
    }
};


export {initialData,productSpecInitialData,photoInitialData};
export default Product;