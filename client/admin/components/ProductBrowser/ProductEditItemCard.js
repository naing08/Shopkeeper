/**
 * Created by ChitSwe on 1/22/17.
 */

import React,{PropTypes} from "react";
import {Link,withRouter} from 'react-router';
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import {graphql} from 'react-apollo';
import CircularProgress from 'material-ui/CircularProgress';
import ContentClear from 'material-ui/svg-icons/content/clear';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import ProductSpecGrid from './ProductSpecGrid';
import {Tabs,Tab} from 'material-ui/Tabs';
import  {updateProductQuery,productByIdQuery} from '../../apollo/Product';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {initialData} from '../../reducer/Product';
import PhotoEditor from './PhotoEditor';
import ProductGeneralInfoEditor from './ProductGeneralInfoEditor';
class ProductEditItemCard extends React.Component{
    constructor(){
        super(...arguments);
        let {Alias,Name,id} = this.props.Product;
        let {loadingProductById} = this.props;
        this.state={loading:loadingProductById,loadingMessage:loadingProductById? 'Loading product detail info...':''};
        //this.props.edit({Alias,Name,id,errors:{},specErrors:[],Photo:[]});
    }

    componentDidUpdate({ProductById,loadingProductById}){
        if(!this.props.loadingProductById && loadingProductById && this.props.ProductById){//if initial data received
            let {Alias,Name,id,Price,Description,ProductBrandId,ProductBrand,ProductGroupId,Thumbnail,DefaultPhoto,Photo} = this.props.ProductById;
            let brandSearchText = ProductBrand? `${ProductBrand.Alias}-${ProductBrand.Name}`: '';
            Thumbnail = Object.assign({},Thumbnail);
            DefaultPhoto = Object.assign({},DefaultPhoto);
            ProductBrand = Object.assign({},ProductBrand);
            let ProductSpec = [];
            this.props.ProductById.ProductSpec.every(({id,ProductId,Name,Value},i)=>{
                ProductSpec.push({id,ProductId,Name,Value});
                return true;
            });
            this.setState({loading:false,loadingMessage:''});
            this.props.edit({brandSearchText,Alias,Name,id,Price,Description,ProductBrandId,ProductGroupId,Thumbnail,DefaultPhoto,ProductSpec,errors:{},Photo});
        }
    }
    mutate(closeAfter=true){
        let {Alias,Name,id,Price,Description,ProductBrandId,ProductGroupId,Thumbnail,DefaultPhoto,ProductSpec,Photo,isValid}=this.props.ProductEdit;
        if(!isValid)
            return;
        let ThumbnailId = Thumbnail? Thumbnail.id:null;
        let DefaultPhotoId = DefaultPhoto? DefaultPhoto.id:null;
        this.setState({loading:true,loadingMessage:'Saving data...'});
        ProductSpec = ProductSpec? ProductSpec:[];
        let productSpec = ProductSpec.map(({id,Value,Name,ProductId})=>({id,Value,Name,ProductId}));//remove errors property
        let productPhoto = Photo.map(({id,IsThumbnail,IsDefault,FileName,Format,ProductId})=>({id,IsThumbnail,IsDefault,FileName,Format,ProductId}));//remove other property
        this.props.update({variables:{Alias,Name,id,Price,Description,ProductBrandId,ProductGroupId,ThumbnailId,DefaultPhotoId,ProductSpec:productSpec,Photo:productPhoto}})
            .then(({data:{productMutate:{instance,errors,specErrors}}})=>{
                if(instance == null ){
                    const errs = {};
                    if(errors)
                        errors.every((error)=>{
                            if(error.key)
                                errs[error.key] = error.message;
                            else
                                this.props.edit({errorText:error.message});
                            return true;
                        });
                    this.setState({loading:false});
                    this.props.edit({errors:errs,specErrors: specErrors? specErrors:null});
                }else{
                    this.setState({loading:false,loadingMessage:''});
                    let {id,Photo,ProductSpec,DefaultPhotoId} = instance;
                    this.props.edit({id,Photo,ProductSpec,DefaultPhotoId});
                    if(closeAfter)
                        this.props.onCancelEdit();
                }
            });
    }


    render(){
        let product = this.props.ProductEdit? this.props.ProductEdit: Object.assign({},initialData,this.props.Product);
        let {Name,errorText,ProductSpec,id,specErrors,Photo,DefaultPhoto} = product;
        let DefaultPhotoId = DefaultPhoto? DefaultPhoto.id:null;
        let {onCancelEdit} = this.props;
        let {loading,loadingMessage} = this.state;
        return (
            <div className="col-xs-12 row center-xs" style={{padding:"20px 0"}}>
                <div className="layout col-xs-12 col-sm-12  col-md-10 col-lg-10 paper-5">
                    <Toolbar style={{height:'64px',backgroundColor:'#fff',borderBottom:'1px solid #e3e3e3'}}>
                        <ToolbarGroup firstChild={true}>
                            <IconButton touch={true} onClick={onCancelEdit}>
                                <ContentClear />
                            </IconButton>
                            <ToolbarTitle text={ Name}/>
                        </ToolbarGroup>
                        <ToolbarGroup lastChild={true}>
                            <IconButton touch={true} onClick={this.mutate.bind(this)}>
                                <NavigationCheck />
                            </IconButton>
                        </ToolbarGroup>
                    </Toolbar>
                    <Tabs>
                        <Tab label="General">
                            <ProductGeneralInfoEditor/>
                        </Tab>
                        <Tab label="Specifications">
                            <ProductSpecGrid   ProductSpecs={ProductSpec}  specErrors={specErrors} ProductId={id}/>
                        </Tab>
                        <Tab label="Images">
                            <PhotoEditor Photo={Photo} ProductId={id} DefaultPhotoId={DefaultPhotoId}/>
                        </Tab>
                    </Tabs>
                    <div className="row" style={{height:'64px', paddingTop:'12px',paddingLeft:'12px',borderTop:'1px solid #e3e3e3'}}>
                        {loading ? <CircularProgress/> : null} {loading ? <div style={{padding:'10px'}}>{loadingMessage}</div> : null} <div style={{padding:'10px',color:'red'}}>{loading? '': errorText}</div>
                    </div>
                </div>
            </div>
        );
    }
}









export default compose(
    productByIdQuery,
    updateProductQuery,
    connect(
        (state)=>({ProductEdit:state.Product.edit}),
        (dispatch)=>({
            edit:(edit)=>{
                dispatch({
                    type:'PRODUCT_EDIT',
                    edit
                });
            },
            validate:()=>{
                dispatch({
                   type:'PRODUCT_VALIDATE'
                });
            }
        })
    )
)(ProductEditItemCard);