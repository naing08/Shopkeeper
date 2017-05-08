/**
 * Created by ChitSwe on 2/7/17.
 */
import React,{PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import AutoComplete from '../../../common/AutoComplete';
import CurrencyEditor from '../../../common/CurrencyEditor';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {productBrandListQuery} from '../../apollo/ProductBrand';
import {initialData} from '../../reducer/Product';
import Dropzone from 'react-dropzone';
import CircularProgress from 'material-ui/CircularProgress';
import PhotoManager from '../../../../common/PhotoManager';

class ProductGeneralInfoEditor extends React.Component{


    onImageDrop(files){
        let {defaultPhotoEdit,showSnackbar,onImageUploadComplete} = this.props;
        defaultPhotoEdit({url:files[0].preview,uploading:true});
        PhotoManager.Product.upload(files[0])
            .then(({secure_url,format,public_id})=>{
                defaultPhotoEdit({Format:format,FileName:public_id,url:secure_url,uploading:false});
                onImageUploadComplete();
                showSnackbar('Product photo has been uploaded.');
            }).catch((error)=>{
                defaultPhotoEdit({uploading:false});
                showSnackbar(`Could not upload photo. ${error}`);
            });
    }

    

    render(){
        let {product} = this.props;
        product = product? product: Object.assign({},initialData);
        let {Name,Price,Description,Alias,errors,id,Photo,brandSearchText,DefaultPhoto} = product;
        let {productBrandList,searchProduct,brandListLoading} = this.props;
        let {url,uploading} = DefaultPhoto? DefaultPhoto:{};
        let ProductBrand = productBrandList? productBrandList.ProductBrand:[];
        const dataSourceConfig = {
            text: 'Alias',
            value: 'id',
            secondaryText:'Name',
            avator:'Photo'
        };
        return (
            <div className="row" style={{backgroundColor:'#fff',textAlign:'center'}}>
                <div style={{padding:'20px 0',flexGrow:1}}>
                    <TextField hintText="Alias" ref="Alias" floatingLabelText="Alias" name="Alias" errorText={errors.Alias} value={Alias} onChange={(e)=>{this.props.edit({Alias:e.target.value});}}/>
                    <br/>
                    <TextField hintText="Name" ref="Name" floatingLabelText="Name" name="Name" value={Name} errorText={errors.Name} onChange={(e)=>{this.props.edit({Name:e.target.value});}}/>
                    <br/>
                    <CurrencyEditor hintText="Price" floatingLabelText="Price" name="Price" value={Price} errorText={errors.Price} onChange={x=>{this.props.edit({Price:x});}}/>
                    <br/>
                    <AutoComplete
                        hintText="Product Brand"
                        floatingLabelText="Product Brand"
                        searchText={brandSearchText}
                        onUpdateInput={(searchText)=>{this.props.edit({brandSearchText:searchText});searchProduct(searchText)}}
                        onNewRequest={(item)=>{this.props.edit({ProductBrandId:item?item.id:null,brandSearchText:item? `${item.Alias}-${item.Name}`:''});}}
                        dataSource={ProductBrand}
                        dataSourceConfig={dataSourceConfig}
                        filter={AutoComplete.noFilter}
                        openOnFocus={true}
                        loading={brandListLoading}
                    />
                </div>
                <div style={{flexGrow:1}}>
                    <TextField style={{width:'300px',textAlign:'left'}} hintText="Description" multiLine={true} rows={5} floatingLabelText="Description" errorText={errors.Description} value={Description} onChange={(e)=>{this.props.edit({Description:e.target.value});}}/>
                    <Dropzone
                            multiple={false}
                            accept="image/*"
                            onDrop={this.onImageDrop.bind(this)}>
                            <div>Drop an image or click to select a file to upload.</div>
                            <img style={{width:'150px',height:'150px'}} src={url}/>
                            {uploading? <CircularProgress />:null}
                    </Dropzone>
                </div>
            </div>
        );
    }

}



export default compose(
    productBrandListQuery,
    connect(
        (state)=>({product:state.Product.edit}),
        (dispatch)=>({
            edit:(edit)=>{
                dispatch({
                    type:'PRODUCT_EDIT',
                    edit
                });
            },
            defaultPhotoEdit:(DefaultPhoto)=>{
                dispatch({
                    type:'PRODUCT_DEFAULT_PHOTO_EDIT',
                    DefaultPhoto
                });
            },
            showSnackbar:(message)=>{
                dispatch({
                    type:'ADMIN_SITE_SNACKBAR_OPEN',
                    message
                })
            }
        })
    )
)(ProductGeneralInfoEditor);

