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
import {createUserMutation} from '../../../common/apollo/User/index';

class CreateItemCard extends React.Component{

    constructor(){
        super(...arguments);
        this.state = {loading:false,loadingMessage:''};
    }

    componentDidMount(){
        this.props.edit();
    }

    onImageDrop(files){
        this.props.edit({
            PhotoUrl: files[0].preview
        });

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



    mutate(){
        let {id,FullName,Photo,PhotoFormat}=this.props.UserEdit;
        this.setState({loading:true,loadingMessage:'Saving data...',errorText:''});
        this.props.createUser({variables:{FullName,Photo,PhotoFormat}})
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
                    this.props.hideCreateItemCard();
                }
            }).catch(error=>{
                this.setState({loading:false,errorText:error});
            });
    }

    render(){
        let {FullName,PhotoUrl,errorText,errors} = this.props.UserEdit;
        let {loading,loadingMessage} = this.state;
        return (
            <div className="col-xs-12 row center-xs" style={{padding:"20px 0"}}>
                <div className="layout col-xs-12 col-sm-8 col-md-6 col-md-6 paper-5">
                    <Toolbar style={{height:'64px',backgroundColor:'#fff',borderBottom:'1px solid #e3e3e3'}}>
                        <ToolbarGroup firstChild={true}>
                            <IconButton touch={true} onClick={this.props.hideCreateItemCard}>
                                <ContentClear />
                            </IconButton>
                            <ToolbarTitle text="Create New User"/>
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
        (state)=>{
            return {UserEdit:state.User.create}
        },
        (dispatch)=>(
            {
                edit:(create)=>{
                    dispatch({
                        type:'USER_CREATE',
                        create
                    });
                },
                hideCreateItemCard:()=>{
                    dispatch({type:'USER_CREATE_CARD_HIDE'});
                }
            }
        )
    ),
    createUserMutation
)(CreateItemCard);