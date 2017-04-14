/**
 * Created by ChitSwe on 3/4/17.
 */
import React,{PropTypes} from 'react';
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import {graphql,compose} from 'react-apollo';
import CircularProgress from 'material-ui/CircularProgress';
import ContentClear from 'material-ui/svg-icons/content/clear';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import Dropzone from 'react-dropzone';
import PhotoManager from '../../../common/PhotoManager';
import {connect} from 'react-redux';
import {userByIdQuery,updateUserMutation} from '../../../common/apollo/User/index';
class EditItemCard extends React.Component{

    constructor(){
        super(...arguments);
        this.state = {loading:false,loadingMessage:''};
    }

    componentDidMount(){
        this.props.edit(Object.assign({},this.props.User,{errors:{}}));
    }

      componentDidUpdate({UserById,loadingUserById}){
        if(!this.props.loadingUserById && loadingUserById && this.props.UserById){//if initial data received
            let {id,FullName,UserName,Photo,PhotoFormat,PhotoUrl,ThumbnailUrl,UserAccountId} = this.props.UserById;
            this.setState({loading:false,loadingMessage:''});
            this.props.edit({id,FullName,UserName,Photo,PhotoFormat,PhotoUrl,ThumbnailUrl,UserAccountId,errors:{}});
        }
    }

    onImageDrop(files){
        this.props.edit({Photo:files[0].preview});
        this.handleImageUpload(files[0]);
    }
    handleImageUpload(file) {
        this.setState({loading:true,loadingMessage:'Uploading photo ...'});
        PhotoManager.User.upload(file)
            .then(({secure_url,format,public_id})=>{
                this.props.edit({Photo:public_id,PhotoFormat:format,PhotoUrl:secure_url});
                this.setState({loading:false,loadingMessage:''});
                this.mutate(false);
            }).catch((error)=>{
            this.setState({loading:false,loadingMessage:'', errorText:error});
        });
    }



    mutate(closeAfter=true){
        let {id,FullName,UserName,UserAccountId,Photo,PhotoFormat,PhotoUrl,ThumbnailUrl}=this.props.UserEdit;
        this.setState({loading:true,loadingMessage:'Saving data...',errorText:''});
        this.props.updateUser({variables:{id,FullName,UserName,UserAccountId,Photo,PhotoFormat}})
            .then(({data:{userMutate:{instance,errors}}})=>{
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
                        this.props.edit();
                }
            }).catch(error=>{
                this.setState({loading:false,errorText:error});
            });
    }

    render(){
        let {id,FullName,UserName,PhotoUrl,errors,errorText} = this.props.UserEdit;
        let {loading,loadingMessage} = this.state;
        return (
            <div className="col-xs-12 row center-xs" style={{padding:"20px 0"}}>
                <div className="layout col-xs-12 col-sm-8 col-md-6 col-md-6 paper-5">
                    <Toolbar style={{height:'64px',backgroundColor:'#fff',borderBottom:'1px solid #e3e3e3'}}>
                        <ToolbarGroup firstChild={true}>
                            <IconButton touch={true} onClick={()=>{this.props.edit();}}>
                                <ContentClear />
                            </IconButton>
                            <ToolbarTitle text={ FullName}/>
                        </ToolbarGroup>
                        <ToolbarGroup lastChild={true}>
                            <IconButton touch={true} onClick={this.mutate.bind(this)}>
                                <NavigationCheck />
                            </IconButton>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="row" style={{backgroundColor:'#fff'}}>
                        <Dropzone
                            multiple={false}
                            accept="image/*"
                            onDrop={this.onImageDrop.bind(this)}>
                            <div>Drop an image or click to select a file to upload.</div>
                            <img style={{width:'150px',height:'150px'}} src={PhotoUrl}/>
                        </Dropzone>
                        <div style={{padding:'20px 0',flexGrow:1}}>
                            <TextField hintText="Full Name" ref="FullName" floatingLabelText="Full Name" errorText={errors.FullName} value={FullName} onChange={(e)=>{this.props.edit({FullName:e.target.value});}}/>
                            <br/>
                        </div>
                    </div>
                    <div className="row" style={{height:'64px', paddingTop:'12px',paddingLeft:'12px'}}>
                        {loading ? <CircularProgress/> : null} {loading ? <div style={{padding:'10px'}}>{loadingMessage}</div> : null} <div style={{padding:'10px',color:'red'}}>{loading? '': errorText}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default compose(
    connect(
        (state)=>({UserEdit:state.User.edit}),
        (dispatch)=>({
            edit:(edit)=>{
                dispatch({
                    type:'USER_EDIT',
                    edit
                });
            },
            validate:()=>{
                dispatch({
                   type:'USER_VALIDATE'
                });
            }
        })
    ),
    userByIdQuery,
    updateUserMutation
)(EditItemCard);

