import React from 'react';
import ProductSpecEditor from './ProductSpecEditor';
import ProductGeneralInfoEditor from '../ProductBrowser/ProductGeneralInfoEditor';
import {Card,CardHeader,CardActions,CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {updateProductQuery,productByIdQuery,initialData} from '../../apollo/Product';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import LoadingIndicator from '../../../common/LoadingIndicator';
import AppBar from './AppBar';
import PhotoEditor from './PhotoEditor';
import ProductPriceEditor from './ProductPriceEditor';
import RelatedProductGrid from './RelatedProductGrid';
class ProductPage extends React.Component{
	constructor(){
		super(...arguments);
		this.state={
			generalInfo:{
				busy:false,
				busyMessage:'',
				errorText:''
			}
		};
	}

	componentDidMount(){
		let {ProductById} = this.props;//for server side rendering
		this.updateStore(ProductById,false);
	}
	
	componentWillReceiveProps(nextProps){
		let {ProductById} = nextProps;//for client side rendering
		let currentProductById = this.props.ProductById;
		let nextLoading= nextProps.loadingProductById;
		let currentLoading = this.props.loadingProductById;
		if(currentLoading && !nextLoading && ProductById ){
			this.updateStore(ProductById,false);
		}else if(currentProductById !== ProductById && ProductById)
			this.updateStore(ProductById,true);
	}

	updateStore(product,productOnly){
		if(!product)
			return;
		let {editProduct,setProductSpec,createProductSpec,setPhoto,setProductPrice,setRelatedProducts} = this.props;
		let {ProductSpec,Photo,ProductPrice,RelatedProducts,...Product} = product? product: {};
		let {ProductBrand} = Product ? Product: {};
		Product.brandSearchText = ProductBrand ? `${ProductBrand.Alias}-${ProductBrand.Name}` : '';		
		editProduct(Product);
		if(!productOnly){
			ProductSpec = ProductSpec? ProductSpec.map(({id,Name,Value})=>({id,Name,Value,errors:{}})) : [];
			ProductPrice = ProductPrice? ProductPrice.map(({id,PriceBookName,Price})=>({id,PriceBookName,Price,errors:{}})): [];
			setProductSpec(ProductSpec);
			setPhoto(Photo);
			setProductPrice(ProductPrice);
			setRelatedProducts(RelatedProducts);
			if(ProductSpec.length ==0)
				createProductSpec();
		}
	}
	updateGeneralInfo(){
		let {update,ProductId,productEdit,editProduct} = this.props;
		let {isValid,Alias,Name,Price,Description,ProductGroupId,Overview,ProductBrandId,DefaultPhoto} = productEdit? productEdit:{};
		let {uploading,FileName,Format} = DefaultPhoto? DefaultPhoto:{};
		let inputDefaultPhoto = DefaultPhoto? {FileName,Format}:null;
		if(uploading){
			showSnackbar("Product photo is still uploading!. Please wait.");
			return;
		}
		if(isValid){
			this.setState({generalInfo:{busy:true,busyMessage:'Saving product info.',errorText:''}});
			update({
				variables:{
					id:ProductId,
					product:{
						Alias,
						Name,
						Price,
						Description,
						ProductGroupId,
						Overview,
						ProductBrandId,
						DefaultPhoto:inputDefaultPhoto
					}
				}
			}).then(({instance,errors})=>{
				this.setState({generalInfo:{busy:false,busyMessage:'', errorText:''}});
				editProduct(Object.assign({},instance,{errors}));
			}).catch(error=>{
				this.setState({generalInfo:{busy:false,busyMessage:'',errorText:error}});
			});
		}
	}
	render(){
		let {generalInfo:{busy,busyMessage,errorText}} = this.state;
		let {productEdit} = this.props;
		let {Name,DefaultPhoto} = productEdit? productEdit : {}	;
		let DefaultPhotoId = DefaultPhoto? DefaultPhoto.id: null;
		let {ProductId} = this.props;
		return (
				<div className="fullheight layout">
					<AppBar title={Name}/>
					<div className="scrollable fullheight" >
						<div style={{padding:"5px 0"}}>
							<Card style={{maxWidth:'1024px', margin:'0 auto'}}>
								<CardHeader title="General Information"/>
								<CardText>
									<ProductGeneralInfoEditor onImageUploadComplete={()=>{}}/>
									<LoadingIndicator loading={busy} loadingMessage={busyMessage} errorText={errorText}/>
								</CardText>
								<CardActions>
									<FlatButton label="Save" onClick={this.updateGeneralInfo.bind(this)} primary={true}/>
								</CardActions>
							</Card>
						</div>
						<div style={{padding:"5px 0"}}>
							<ProductSpecEditor style={{maxWidth:'1024px', margin:'0 auto'}} ProductId={ProductId}/>
						</div>
						<div style={{padding:"5px 0"}}>
							<PhotoEditor style={{maxWidth:'1024px', margin:'0 auto'}}  ProductId={ProductId} DefaultPhotoId={DefaultPhotoId}/>
						</div>
						<div style={{padding:"5px 0"}}>
							<ProductPriceEditor style={{maxWidth:'1024px', margin:'0 auto'}} ProductId={ProductId}/>
						</div>
						<div style={{padding:"5px 0"}}>
							<RelatedProductGrid  style={{maxWidth:'1024px', margin:'0 auto'}} ProductId={ProductId} />
						</div>
					</div>
				</div>
			);
	}
}

const TheComponent =   compose(
	updateProductQuery,
	productByIdQuery,
	connect(
			state=>({productEdit:state.Product.edit}),
			dispatch=>({
				editProduct:(edit)=>{
					dispatch({type:'PRODUCT_EDIT',edit});
				},
				showSnackbar:(message)=>{
	                dispatch({
	                    type:'ADMIN_SITE_SNACKBAR_OPEN',
	                    message
	                });
	            },
	            setProductSpec:(items)=>{
						dispatch({type:'PRODUCT_SPEC_SET',spec:items});
				},
				createProductSpec:()=>{
					dispatch({type:'PRODUCT_SPEC_ADD'});
				},
				setPhoto:(photo)=>{
					dispatch({type:'PRODUCT_PHOTO_SET',photo});
				},
				setProductPrice:(items)=>{
						dispatch({type:'PRODUCT_PRICE_SET',items});
				},
				setRelatedProducts:(items)=>{
					dispatch({type:'PRODUCT_RELATED_PRODUCTS_SET',items});
				}
			})
		)
	)(ProductPage);

	export default ({params:{id}})=>{
		return (<TheComponent ProductId={id} Product={{id}}/>);
	};