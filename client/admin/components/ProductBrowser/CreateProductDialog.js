import React from 'react';
import Dialog from 'material-ui/Dialog';
import ProductGeneralInfoEditor from './ProductGeneralInfoEditor';
import FlatButton from 'material-ui/FlatButton';
import {createProductQuery} from '../../apollo/Product';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import LoadingIndicator from '../../../common/LoadingIndicator'
class CreateProductDialog extends React.Component{
	constructor(){
		super(...arguments);
		this.state={
			busy:false,
			busyMessage:'',
			errorText:''
		};
	}
	saveProduct(){
		let {productEdit,create,onRequestClose,showSnackbar,edit} = this.props;
		let {isValid,Alias,Name,Price,Description,ProductGroupId,Overview,ProductBrandId,DefaultPhoto} = productEdit? productEdit:{};
		let {uploading,FileName,Format} = DefaultPhoto? DefaultPhoto:{};
		let inputDefaultPhoto = DefaultPhoto? {FileName,Format}:null;
		if(uploading){
			showSnackbar("Product photo is still uploading!. Please wait.");
			return;
		}
		if(isValid){
			this.setState({busy:true,busyMessage:'Creating new product',errorText:''});
			create({
				variables:{
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
			}).then(({errors,instance})=>{
				this.setState({busy:false,busyMessage:'', errorText:''});
				if(instance)
					onRequestClose();
				else{
					edit(Object.assign({},instance,{errors}));
				}

			}).catch(error=>{
				this.setState({busy:false,busyMessage:'',errorText:error});
			});
		}
	}
	render(){
		let {open,onRequestClose} = this.props;
		let {busy,busyMessage,errorText} = this.state;
		let dialogActions = [
				<FlatButton 
					label="Cancel"
					primary={true}
					onTouchTap={onRequestClose}
				/>,
				<FlatButton
					label="OK"
					primary={true}
					onTouchTap={this.saveProduct.bind(this)}
				/>
		];
		return (
			<Dialog
				open={open}
				actions={dialogActions}
				modal={true}
				title="Create new product"
			>
				<ProductGeneralInfoEditor onImageUploadComplete={()=>{}}/>
				<LoadingIndicator loading={busy} loadingMessage={busyMessage} errorText={errorText}/>
			</Dialog>
			);
	}
}

export default compose(
	createProductQuery,
	connect(
			state=>({productEdit:state.Product.edit}),
			dispatch=>({
				edit:(edit)=>{
					dispatch({type:'PRODUCT_EDIT',edit});
				},
				showSnackbar:(message)=>{
	                dispatch({
	                    type:'ADMIN_SITE_SNACKBAR_OPEN',
	                    message
	                });
	            }
			})
		)
	)(CreateProductDialog);