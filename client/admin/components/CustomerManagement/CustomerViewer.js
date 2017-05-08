import React from 'react';
import {Card, CardHeader,CardText} from 'material-ui/Card';
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import {customerByIdQuery} from '../../apollo/Customer';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import muiThemeable from 'material-ui/styles/muiThemeable';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Paper from 'material-ui/Paper';
import {white} from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import CommunicationLocation_On from 'material-ui/svg-icons/communication/location-on';
import CommunicationPhone from 'material-ui/svg-icons/communication/phone';
import CommunicationContactMail from 'material-ui/svg-icons/communication/contact-mail';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import FlatButton from 'material-ui/FlatButton';
import CommunicationKey from 'material-ui/svg-icons/communication/vpn-key';
import ActionLock from 'material-ui/svg-icons/action/lock';
import ActionLockOpen from 'material-ui/svg-icons/action/lock-open';
import EditCustomerDialog from './EditCustomerDialog';
import ImagePhotoCamera from 'material-ui/svg-icons/image/photo-camera';
import FilePickerHidden from '../../../common/FilePickerHidden';
import {updateCustomerMutation} from '../../apollo/Customer';
import PhotoManager from '../../../../common/PhotoManager';
import UserAccountDialog from '../UserManagement/UserAccountDialog';
import {reactivateUserAccountMutation} from '../../apollo/UserAccount';
import CustomerOrder from  './CustomerOrder';
class CustomerViewer extends React.Component{
    constructor(){
        super(...arguments);
        this.state={imageUploading:false,errorText:'',loading:false, loadingMessage:''};
    }
    openEditDialog(){
        let {openEditDialog,edit,CustomerById} = this.props;
        if(CustomerById){
            let {id,FullName,PhoneNo,Email,Township,Region,Address,Photo,PhotoFormat} = CustomerById;
            edit({id,FullName,PhoneNo,Email,Township,Region,Address,Photo,PhotoFormat});
            openEditDialog();
        }
    }

    changeUserAccount(){
        let {openUserAccountDialog,editUserName,CustomerById} = this.props;
        let {UserAccountId,UserName,id} = CustomerById;
        editUserName({id:UserAccountId,UserName:UserName? UserName:'',EntityId:id,EntityType:'CUSTOMER'});
        openUserAccountDialog();
    }

     reactivateAccount(){
        let {showSnackbar} = this.props;
        this.setState({loading:true});
        this.props.reactivateUserAccount(this.props.CustomerById.UserAccountId)
            .then(()=>{this.setState({loading:false});showSnackbar("Account has been reactivated.");})
            .catch((error)=>{this.setState({loading:false});showSnackbar(error);});
    }

    handleImageUpload(file){
        this.setState({imageUploading:true,errorText:''});
        return PhotoManager.Customer.upload(file)
            .then(({secure_url,format,public_id})=>{
                this.props.edit({Photo:public_id,PhotoFormat:format,PhotoUrl:secure_url});
                return this.handleSubmit()
                    .then(({secure_url,format,public_id})=>{
                        this.setState({imageUploading:false});
                    });
            }).catch((error)=>{
                this.setState({imageUploading:false, errorText:error});
             });
    }

    onFilesAccepted(accepted,rejected,e){
        if(accepted){
            let file = accepted[0];
            if(file){
                this.handleImageUpload(file);
            }
        }
    }



    handleSubmit(){
        let {CustomerEdit,CustomerById,update} = this.props;
        let{id,FullName,PhoneNo,Email,Region,Township,Address} = CustomerById;
        let {Photo,PhotoFormat} = CustomerEdit;
        this.setState({loading:true,loadingMessage:'Saving customer info...'});
        return update({variables:{
            id,
            FullName,
            PhoneNo,
            Email,
            Region,
            Township,
            Address,
            Photo,
            PhotoFormat
        }}).then(({data:{customerMutate:{instance,errors}}})=>{
            if(errors && errors.length>0){
                    const errs = {};
                    errors.every((error)=>{
                        if(error.key)
                            errs[error.key] = error.message;
                        else
                            this.setState({errorText:error.message});
                        return true;
                    });
                    this.setState({loading:false});
                    this.props.edit({errors:errs});
                    return Promise.reject(errs);
                }else{
                    this.setState({loading:false,loadingMessage:''});
                    this.props.edit({id:instance.id});
                }
        }).catch(error=>{
            this.setState({errorText:error});
        });
    }
    
    
    renderAppBar(title){
        let {loadingCustomerById,muiTheme,CustomerById} = this.props;
        let {loading} = this.state;
        let accountActionButtons = [];
        if(CustomerById){
            let {UserAccountId,UserName} = CustomerById;
            if(UserAccountId && !UserName){
                accountActionButtons.push(<IconButton key="reactivateAccount" onClick={this.reactivateAccount.bind(this)} touch={true} tooltip="Reactivate Account"><ActionLockOpen color={white}/></IconButton>);
            }
            else if(UserAccountId && UserName){
                accountActionButtons.push(<IconButton key="changePassword" onClick={this.changeUserAccount.bind(this)} touch={true} tooltip="Change Password"><CommunicationKey color={white}/></IconButton>);
            }
            else{
                accountActionButtons.push( <IconButton key="createAccount" onClick={this.changeUserAccount.bind(this)} touch={true} tooltip="Create Account"><CommunicationKey color={white}/></IconButton>);
            }
        }
        let toolBar = <Toolbar style={{height:'64px',backgroundColor:muiTheme.palette.primary1Color}}>
        <ToolbarGroup firstChild={true}>
            <IconButton touch={true}>
                <NavigationMenu color={white} />
            </IconButton>
            <ToolbarTitle style={{color:'#fff'}} text={title}/>
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
            {loadingCustomerById? null: <IconButton  onClick={this.openEditDialog.bind(this)} touch={true} tooltip="Edit Customer Info"><EditorModeEdit color={white}/></IconButton>}
            {accountActionButtons}
            {loadingCustomerById || loading ? <CircularProgress />:null}
        </ToolbarGroup>
    </Toolbar>;
    
    return (
        <Paper zDepth={5}>
            {toolBar}
        </Paper>
    );
    }
	render(){
		let {CustomerById,loadingCustomerById,muiTheme} = this.props;
        let {errorText} = this.state;
        if(CustomerById){
            let {id,FullName,Region,Township,ThumbnailUrl,Address,PhoneNo, Email} = CustomerById;
    		return (
    				<div className="layout fullheight">
                        {this.renderAppBar(`Customer - ${FullName}`)}
                        <div className="scrollable">
                            <EditCustomerDialog />
                            <Card>
                                <CardHeader title={
                                    <div className="row" style={{alignItems:'center'}}>{FullName} 
                                        <IconButton tooltip="Change Profile Photo" onClick={()=>{this.filePickerHidden.click();}} style={{padding:'0px',height:'24px'}} touch={true}>
                                            <ImagePhotoCamera  color={muiTheme.palette.primary1Color} />
                                            <FilePickerHidden ref={ el => this.filePickerHidden = el} accept="image/*" multiple={false} onFilesAccepted={this.onFilesAccepted.bind(this)}/>
                                        </IconButton>
                                        {this.state.imageUploading ? <CircularProgress size={30} thickness={3}/>:null}
                                    </div>} avatar={ThumbnailUrl} subtitle={`${Township},${Region}`} />
                                <CardText >
                                    <div className='row' style={{alignItems:'center'}}>
                                        <div className='row' style={{width:'200px',alignItems:'center'}}>
                                            <FlatButton href={`tel:${PhoneNo}`} primary={true}  icon={<CommunicationPhone/>}/>
                                            <div style={{paddingLeft:'5px'}}>Phone No</div>
                                        </div>
                                        <div>
                                            <b>{PhoneNo}</b>
                                        </div>
                                    </div>
                                    <div className='row' style={{alignItems:'center'}}>
                                        <div className='row' style={{width:'200px',alignItems:'center'}}>
                                            <FlatButton href={`mailto:${Email}`} primary={true}  icon={<CommunicationContactMail/>}/>
                                            <div style={{paddingLeft:'5px'}}>Email</div>
                                        </div>
                                        <div>
                                            <b>{Email}</b>
                                        </div>
                                    </div>
                                    <div className='row' style={{alignItems:'center'}}>
                                        <div className='row' style={{width:'200px',alignItems:'center'}}>
                                            <FlatButton href="#" primary={true}  icon={<CommunicationLocation_On/>}/>
                                            <div style={{paddingLeft:'5px'}}>Address</div>
                                        </div>
                                        <div>
                                            <b>{Address}</b>
                                        </div>
                                    </div>
                                </CardText>
                                <UserAccountDialog/>
                            </Card>
                            <CardHeader title="Orders"/>
                            <CustomerOrder customerId={id} page={1} pageSize={10}/>
                        </div>
    				</div>
    			);
        }else{
            return (
                    <div className="layout fullheight">
                        {this.renderAppBar('Customer')}
                    </div>
                );
        }
	}
}


export default compose(
        connect(
                (state)=>({CustomerEdit:state.Customer.edit}),
                (dispatch)=>({
                    openEditDialog:()=>{
                        dispatch({type:'CUSTOMER_EDIT_DIALOG_OPEN'});
                    },
                    edit:(edit)=>{
                        dispatch({type:'CUSTOMER_EDIT',edit});
                    },
                    editUserName:(edit)=>{
                        dispatch({type:'USERNAME_EDIT',edit});
                    },
                    editPassword:(edit)=>{
                        dispatch({type:'PASSWORD_EDIT',edit});
                    },
                    openUserAccountDialog:()=>{
                        dispatch({type:'USER_ACCOUNT_PASSWORD_DIALOG_OPEN'});
                    },
                    showSnackbar:(message)=>{
                        dispatch({type:'ADMIN_SITE_SNACKBAR_OPEN',message});
                    }
                })
            ),
        muiThemeable(),
		customerByIdQuery,
        updateCustomerMutation,
        reactivateUserAccountMutation
	)(CustomerViewer);