import React,{PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Checkbox from 'material-ui/Checkbox';
import {login,saveUserProfile} from '../../auth';
import Dialog from 'material-ui/Dialog';
class Login extends React.Component{
	handleLogin(){
		let {Login,showSnackbar,closeDialog,setUserProfile} = this.props;
		login(Login.edit).then(result=>{
			if(result && result.success){
				saveUserProfile(result);
				let {user_id,user_name,account_type,profile_pic,full_name,entity_id}=result;
				setUserProfile({userId:user_id,userName:user_name,accountType:account_type,profilePic:profile_pic,fullName:full_name,entityId:entity_id});
				closeDialog();
			}else if(result)
				showSnackbar(`Could not login.${result.message}`);
			else
				showSnackbar(`Could not login`);
		})
		.catch(error=>{
			showSnackbar("Could not login " + error.message);
		});
	}
	render(){
		let {Login,makeEdit,closeDialog} = this.props;
		let {edit,open} = Login;
		let {UserName,Password,Remember} =edit;
		return (
			<Dialog
				title="Log in"
				contentStyle={{width:'400px'}}
				open={open}
				actions={[
						<FlatButton label="Login" secondary={true} onTouchTap={this.handleLogin.bind(this)}/>,
						<FlatButton label="Cancel" onTouchTap={closeDialog}/>
					]}
			>
				<div className="row">
					<TextField className="col-xs-12" name="UserName" id="UserName" hintText="User Name" ref="UserName" floatingLabelText="User Name" value={UserName} onChange={e=>{makeEdit({UserName:e.target.value});}}/>
					<TextField className="col-xs-12" name="Password" id="Password" hintText="Password" ref="Password" floatingLabelText="Password" value={Password} onChange={e=>{makeEdit({Password:e.target.value});}} type="password" />
					<Checkbox className="col-xs-12" label="Keep Login" checked={Remember} onCheck={e=>{makeEdit({Remember:e.target.checked});}}/>
				</div>
			</Dialog>
			);
	}
}

export default compose(
		connect(
			state=>({Login:state.Login}),
			dispatch=>({
				showSnackbar:(message)=>dispatch({type:"SITE_SNACKBAR_OPEN",message}),
				makeEdit:(edit)=>{dispatch({type:'LOGIN_EDIT',edit});},
				closeDialog:()=>{
					dispatch({type:'LOGIN_DIALOG_CLOSE'});
				},
				setUserProfile:(edit)=>{
					dispatch({type:'USER_PROFILE_EDIT',edit});
				}
			})
			)
	)(Login);