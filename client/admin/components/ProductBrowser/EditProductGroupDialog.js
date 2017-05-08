/**
 * Created by ChitSwe on 1/22/17.
 */

import React,{PropTypes} from "react";
import {Link,withRouter} from 'react-router';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import ContentClear from 'material-ui/svg-icons/content/clear';
import FlatButton from 'material-ui/FlatButton';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import Dropzone from 'react-dropzone';
import PhotoManager from '../../../../common/PhotoManager';
import Dialog from 'material-ui/Dialog';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {fragments,insertQuery,updateQuery} from '../../apollo/ProductGroup';


class EditProductGroupDialog extends React.Component{

    constructor(){
        super(...arguments);

        this.state = {imagePath:''};
    }

    componentDidMount() {
        if (this.props.isEditMode) {
            let {Alias,Name,id,Photo,PhotoFormat} = this.props;
            this.setState({imagePath:Photo});
            this.props.edit({Alias,Name,id,Photo,PhotoFormat});
        }else{
            this.props.edit({errors:{},Alias:'',Name:'',id:null,Photo:'',PhotoFormat:''});
            this.setState({imagePath:''});
        }
    }

    onImageDrop(files){
        this.setState({
            imagePath: files[0].preview
        });

        this.handleImageUpload(files[0]);
    }
    handleImageUpload(file) {
        this.setState({loading:true,loadingMessage:'Uploading photo ...'});
        PhotoManager.ProductGroup.upload(file)
            .then(({secure_url,format,public_id})=>{
                this.props.edit({Photo:public_id,PhotoFormat:format});
                this.setState({loading:false,loadingMessage:'',imagePath:secure_url});
            }).catch((error)=>{
            this.setState({loading:false,loadingMessage:'', errorText:error});
        });
    }



    mutate(closeAfter=true){
        let {Alias,Name,id,Photo,PhotoFormat}=this.props.ProductGroupEdit;
        let {ParentGroupId,isEditMode,updateMutation,saveMutation} = this.props;
        let mutate = isEditMode? updateMutation: saveMutation;
        this.setState({loading:true,loadingMessage:'Saving data...',errorText:''});
        mutate({variables:{Alias,Name,id,Photo,PhotoFormat,ParentGroupId}})
            .then(({data:{productGroupMutate:{instance,errors}}})=>{
                if(errors && errors.length>0){
                    const errs = {};
                    errors.every((error)=>{
                        if(error.key)
                            errs[error.key] = error.message;
                        else
                            this.props.edit({errorText:error.message});
                        return true;
                    });
                    this.setState({loading:false});
                    this.props.edit({errors:errs});
                }else{
                    this.setState({loading:false,loadingMessage:''});
                    if(closeAfter)
                        this.props.onCancelEdit();
                }
            });
    }

    render(){
        let {onCancelEdit,isOpen,dialogCaption} = this.props;
        let {loadingMessage,loading,imagePath} = this.state;
        let {Alias,Name,errorText,errors} = this.props.ProductGroupEdit;
        let actions = [
            <div className="row" style={{paddingLeft:'12px',display:'inline-block',float:'left'}}>
                {loading ? <CircularProgress size={36} style={{verticalAlign:'middle'}}/> : null} {loading ? <div style={{display:'inline-block'}}>{loadingMessage}</div> : null} <div style={{color:'red'}}>{loading? '': errorText}</div>
            </div>,
            <FlatButton   onTouchTap={this.mutate.bind(this)} label="Save" icon={<NavigationCheck />}/>,
            <FlatButton primary={true} onTouchTap={onCancelEdit} label="Cancel" icon={<ContentClear />}/>
        ];
        return (
            <Dialog modal={true} open={isOpen} actions={actions} title={dialogCaption}>
                <div className="layout  ">

                    <div className="row center-xs" style={{backgroundColor:'#fff'}}>
                        <Dropzone
                            multiple={false}
                            accept="image/*"
                            onDrop={this.onImageDrop.bind(this)}>
                            <div>Drop an image or click to select a file to upload.</div>
                            <img style={{width:'150px',height:'150px'}} src={imagePath}/>
                        </Dropzone>
                        <div style={{padding:'20px 0',flexGrow:1}}>
                            <TextField hintText="Alias" ref="Alias" floatingLabelText="Alias" errorText={errors.Alias} value={Alias} onChange={(e)=>{this.props.edit({Alias:e.target.value});}}/>
                            <br/>
                            <TextField hintText="Name" ref="Name" floatingLabelText="Name" value={Name} errorText={errors.Name} onChange={(e)=>{this.props.edit({Name:e.target.value});}}/>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default compose(
    insertQuery,
    updateQuery,
    connect(
        (state)=>({ProductGroupEdit:state.ProductGroup.edit}),
        (dispatch)=>({
            edit:(edit)=>{
                dispatch({type:'PRODUCT_GROUP_EDIT',edit});
            }
        })
    )
)(EditProductGroupDialog);