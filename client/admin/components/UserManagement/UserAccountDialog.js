import React,{PropTypes} from "react";
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import ActionDelete from 'material-ui/svg-icons/action/delete'
import ContentClear from 'material-ui/svg-icons/content/clear';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import IconButton from 'material-ui/IconButton';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import muiThemeable from 'material-ui/styles/muiThemeable';
import ActionDone from 'material-ui/svg-icons/action/done';
import {deactivateUserAccountMutation,saveUserAccountMutation,savePasswordMutation} from '../../apollo/UserAccount';
class savePasswordDialog extends React.Component{
	constructor(){
		super(...arguments);
		this.state = {
			deactivating:false,
			saving:false,
			loadingMessage:'',
			editingUserName:false
		};
	}
	updateUserName(){
		let {UserAccountEdit,saveUserAccount,showSnackbar} = this.props;
    	let {id,UserName,EntityId,EntityType} = UserAccountEdit;
    	this.setState({saving:true,loadingMessage:'Saving user account...'});
    	saveUserAccount({id,UserName:UserName.UserName,EntityId,EntityType})
    	.then(result=>{
    		if(result.data && result.data.saveUserAccount){
    			let {UserAccount} = result.data.saveUserAccount;
    			let {id,UserName} = UserAccount;
    			editUserName({id,UserName});
				showSnackbar("User account has been saved.");
    		}
    		this.setState({saving:false,loadingMessage:'',editingUserName:false});
    	})
    	.catch((error)=>{this.setState({saving:false,loadingMessage:'',editingUserName:false});showSnackbar(error)});
    }
    savePassword(){
    	let {UserAccountEdit,editUserName,showSnackbar} = this.props;
    	let {Password,id,UserName,EntityId,EntityType} = UserAccountEdit;
    	let {isValid,NewPassword,OldPassword} = Password;
    	this.setState({saving:true,loadingMessage:'Saving user account...'});
    	this.props.savePassword({id,UserName:UserName.UserName,EntityId,Password:NewPassword,OldPassword,EntityType})
    	.then((result)=>{
    		if(result.data && result.data.savePassword ){
    			let {UserAccount} = result.data.savePassword;
    			let {id} = UserAccount;
    			editUserName({id});
    			showSnackbar("User account has been saved.");
    		}
    		this.setState({saving:false,loadingMessage:'',editUserName:false});
    	})
    	.catch((error)=>{this.setState({saving:false,loadingMessage:'',editUserName:false});showSnackbar(error);});
    }
    deactivateAccount(){
    	let {showSnackbar} = this.props;
    	this.setState({deactivating:true});
    	this.props.deactivateUserAccount(this.props.UserAccountEdit.id)
    	.then(()=>{this.setState({deactivating:false});showSnackbar("Account has been deactivated.");})
    	.catch((error)=>{this.setState({deactivating:false});showSnackbar(error);});
    }

	render(){
		let {isDialogOpen,closeDialog,UserAccountEdit,editUserName,editPassword,muiTheme} = this.props;
		let {editingUserName} = this.state;
		let resetAndCloseDialog = ()=>{
			editUserName({id:null,EntityId:null,EntityType:'',UserName:''});
			editPassword({OldPassword:'',NewPassword:'',ConfirmPassword:''});//reset store to default
			closeDialog();
		};
		const deactivatingIndicator = this.state.loading?<CircularProgress size={30} thickness={3} style={{verticalAlign:'middle'}}/>:null;
		let {saving,loadingMessage,deactivating} = this.state;
		let{ UserName,Password,id} = UserAccountEdit;
		let errorText = '';
		let dialogActions = [
			<FlatButton primary={true} onTouchTap={resetAndCloseDialog} label="Close" icon={<ContentClear />}/>,
		];
		if(UserAccountEdit.id)
			dialogActions.push(<FlatButton secondary={true} onTouchTap={this.deactivateAccount.bind(this)} label={deactivating? deactivatingIndicator : 'Deactivate'} icon={<ActionDelete />}/>);
		return (
			<Dialog modal={true} open={isDialogOpen} actions={dialogActions} contentStyle={{maxWidth:'300px'}}>
				{
					UserAccountEdit.id?
					(
						<div className="row" >
							<TextField style={{width:'200px'}} value={UserName.UserName} disabled={!editingUserName} onChange={(e)=>{editUserName({UserName:e.target.value});}}  hintText="User Name" floatingLabelText="User Name" errorText={UserName.errorText} />
							{
								editingUserName?
								(<IconButton touch={true} onTouchTap={this.updateUserName.bind(this)} style={{marginTop:'20px'}}>
									<ActionDone color={muiTheme.palette.primary1Color}/>
								</IconButton>)
								:
								(<IconButton touch={true} onTouchTap={()=>{this.setState({editingUserName:true});}} style={{marginTop:'20px'}}>
									<EditorModeEdit color={muiTheme.palette.primary1Color}/>
								</IconButton>)
							}
						</div>
						)
					:
					<TextField value={UserName.UserName} onChange={(e)=>{editUserName({UserName:e.target.value});}}  hintText="User Name" floatingLabelText="User Name" errorText={UserName.errorText} />
				}
				<br/>
				<TextField value={Password.OldPassword} onChange={e=>{editPassword({OldPassword:e.target.value});}} hintText = "Old Password" floatingLabelText ="Old Password" errorText = {Password.errors.OldPassword}/>
				<br/>
				<TextField value={Password.NewPassword} onChange={e=>{editPassword({NewPassword:e.target.value});}} hintText="New Password" floatingLabelText="New Password" errorText = {Password.errors.NewPassword}/>
				<br/>
				<TextField value={Password.ConfirmPassword} onChange={e=>{editPassword({ConfirmPassword:e.target.value});}} hintText="Confirm Account" floatingLabelText = "Confirm Password" errorText = {Password.errors.ConfirmPassword} />
				<br/>
				<RaisedButton label="SAVE" secondary={true} onTouchTap={this.savePassword.bind(this)}/>
				<div className="row" style={{height:'64px', paddingTop:'12px',paddingLeft:'12px'}}>
                        {saving ? <CircularProgress/> : null} {saving ? <div style={{padding:'10px'}}>{loadingMessage}</div> : null} <div style={{padding:'10px',color:'red'}}>{saving? '': errorText}</div>
                </div>
			</Dialog>
			);
	}
}


export default compose(
		connect(
				(state)=>({
					isDialogOpen:state.UserAccount.isDialogOpen,
					UserAccountEdit:state.UserAccount
				}),
				(dispatch)=>({
					closeDialog:()=>{dispatch({type:'USER_ACCOUNT_PASSWORD_DIALOG_CLOSE'});},
					editUserName:(edit)=>{
						dispatch({type:'USERNAME_EDIT',edit});
					},
					editPassword:(edit)=>{
						dispatch({type:'PASSWORD_EDIT',edit});
					},
					showSnackbar:(message)=>{
						dispatch({type:'ADMIN_SITE_SNACKBAR_OPEN',message});
					}
				})
			),
		muiThemeable(),
		deactivateUserAccountMutation,
		saveUserAccountMutation,
		savePasswordMutation
	)(savePasswordDialog);
