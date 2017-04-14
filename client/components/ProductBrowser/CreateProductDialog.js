/**
 * Created by ChitSwe on 2/6/17.
 */
import React,{PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import {
    Step,
    Stepper,
    StepLabel,
} from 'material-ui/Stepper';
import {initialData} from '../../../common/apollo/reducer/Product';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ProductSpecGrid from './ProductSpecGrid';
import PhotoEditor from './PhotoEditor';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {updateProductQuery,createProductQuery} from '../../../common/apollo/Product';
import ProductGeneralInfoEditor from './ProductGeneralInfoEditor';
import CircularProgress from 'material-ui/CircularProgress';

class CreateProductDialog extends React.Component{
    constructor(){
        super(...arguments);
        this.state = {activeStep:0,loading:false,loadingMessage:''};
    }
    renderStepContent(stepIndex){
        let product = this.props.ProductEdit? this.props.ProductEdit: Object.assign({},initialData);
        let {ProductSpec,specErrors,Photo,DefaultPhoto} = product;
        let DefaultPhotoId = DefaultPhoto? DefaultPhoto.id:null;
        let content = null;
        switch (stepIndex){
            case 0:
                content = <ProductGeneralInfoEditor/>
                break;
            case 1:
                content = <ProductSpecGrid   ProductSpecs={ProductSpec}  specErrors={specErrors} ProductId={product.id}/>;
                break;
            case 2:
                content = <PhotoEditor Photo={Photo} ProductId={product.id} DefaultPhotoId={DefaultPhotoId}/>
                break;
        }
        return content;
    }

    componentDidUpdate({open}){
        if(this.props.open && ! open){
            this.props.edit(Object.assign({},initialData));
        }
    }

    handleNext(){
        let {ProductEdit,update,create} = this.props;
        switch(this.state.activeStep){
            case 0:

                this.mutate().then(instance=>{
                    if(instance) {
                        this.setState({activeStep: this.state.activeStep + 1});
                    }
                }).catch(()=>{});
                break;
            case 1:
                this.mutate().then(()=>{
                    this.setState({activeStep: this.state.activeStep + 1});
                });
                break;
        }
    }

    mutate(){

        let {Alias,Name,id,Price,Description,ProductBrandId,Thumbnail,DefaultPhoto,ProductSpec,Photo,isValid}=this.props.ProductEdit;
        let ProductGroupId = this.props.ParentGroupId;
        if(!isValid)
            return new Promise((res,rej)=>{rej();});// return rejected promise
        let ThumbnailId = Thumbnail? Thumbnail.id:null;
        let DefaultPhotoId = DefaultPhoto? DefaultPhoto.id:null;
        this.setState({loading:true,loadingMessage:'Saving data...'});
        ProductSpec = ProductSpec? ProductSpec:[];
        let productSpec = ProductSpec.map(({id,Value,Name,ProductId})=>({id,Value,Name,ProductId}));//remove errors property
        let productPhoto = Photo.map(({id,IsThumbnail,IsDefault,FileName,Format,ProductId})=>({id,IsThumbnail,IsDefault,FileName,Format,ProductId}));//remove other property
        let variables = {Alias,Name,id,Price,Description,ProductBrandId,ProductGroupId,ThumbnailId,DefaultPhotoId,ProductSpec:productSpec,Photo:productPhoto};
        let mutatePromise ;
        if(id)
            mutatePromise = this.props.update({variables});
        else
            mutatePromise = this.props.create({variables});
        this.setState({loading:true,loadingMessage:'Saving  data...'});
        return mutatePromise
            .then(({data:{productMutate:{instance,errors,specErrors}}})=>{
                this.setState({loading:false,loadingMessage:''});
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
                    let {id,Photo,ProductSpec,DefaultPhotoId} = instance;
                    this.setState({loading:false,loadingMessage:''});
                    this.props.edit({id,Photo,ProductSpec,DefaultPhotoId});
                }
                return instance;

            }).catch(()=>{
                this.setState({loading:false,loadingMessage:''});
            });
    }

    handleBack(){
        switch (this.state.activeStep){
            case 1:
                this.setState({activeStep:this.state.activeStep - 1});

                break;
            case 2:
                this.setState({activeStep:this.state.activeStep - 1});
                break;
        }
    }

    handleComplete(){
        this.mutate().then(()=>{
            this.setState({activeStep:0});
           this.props.onComplete();
        });
    }

    handleCancel(){
        this.setState({activeStep:0});
        this.props.onReject();
    }


    render(){
        let {open} = this.props;
        let {errorText} = this.props.ProductEdit;
        let {activeStep,loading,loadingMessage} = this.state;
        return (
            <Dialog open={open}>
                <Stepper activeStep={activeStep}>
                    <Step >
                        <StepLabel>General</StepLabel>
                    </Step>
                    <Step >
                        <StepLabel>Specifications</StepLabel>
                    </Step>
                    <Step >
                        <StepLabel>Images</StepLabel>
                    </Step>
                </Stepper>
                <div>
                    {this.renderStepContent(activeStep)}
                </div>
                <div>
                    {activeStep>0?<FlatButton style={{marginRight:'10px'}} label="Back" onTouchTap={this.handleBack.bind(this)}/>:<RaisedButton style={{marginRight:'10px'}} label="Cancel" onTouchTap={this.handleCancel.bind(this)} primary={true}/>}

                    {activeStep < 2? <RaisedButton label="Next" onTouchTap={this.handleNext.bind(this)} />:<RaisedButton label="Finish" onTouchTap={this.handleComplete.bind(this)} /> }
                    <div className="row" style={{height:'64px', paddingTop:'12px',paddingLeft:'12px',borderTop:'1px solid #e3e3e3'}}>
                        {loading ? <CircularProgress/> : null} {loading ? <div style={{padding:'10px'}}>{loadingMessage}</div> : null} <div style={{padding:'10px',color:'red'}}>{loading? '': errorText}</div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

CreateProductDialog.propTypes = {
  open:PropTypes.bool.isRequired,
    onComplete:PropTypes.func.isRequired,
    onReject:PropTypes.func.isRequired
};

export default compose(
    updateProductQuery,
    createProductQuery,
    connect(
        (state)=>({ProductEdit:state.Product.edit}),
        (dispatch)=>({
            edit:(edit)=>{
                dispatch({
                    type:'PRODUCT_EDIT',
                    edit
                });
            }
        })
    )
)(CreateProductDialog);