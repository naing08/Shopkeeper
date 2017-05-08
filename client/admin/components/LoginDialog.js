import React,{PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ContentClear from 'material-ui/svg-icons/content/clear';
import {loginMutation} from '../apollo/Login';
import Checkbox from 'material-ui/Checkbox';

class LoginDialog extends React.Component{
	handleLogin(){
		let {login,Login,showSnackbar,closeDialog} = this.props;
		login(Login.edit).then(result=>{
			if(result && result.success){
				
				closeDialog();
			}else if(result)
				showSnackbar(`Could not login.${result.message}`);
			else
				showSnackbar(`Could not login`);
		})
		.catch(error=>{
			showSnackbar("Could not login " + error);
		});
	}
	render(){
		let {Login,closeDialog} = this.props;
		let {open,edit} = Login;
		let {UserName,Password,Remember} = edit;
		return (<Dialog open={open}>
			<TextField name="UserName" hintText="User Name" ref="UserName" floatingLabelText="User Name" value={UserName} />
			<br/>
			<TextField name="Password" hintText="Password" ref="Password" floatingLabelText="Password" value={Password} type="password" />
			<br/>
			<Checkbox label="Keep Login" checked={Remember}/>
			<br/>
			<FlatButton primary={true} onTouchTap={closeDialog} label="Close" icon={<ContentClear />}/>
			<RaisedButton label="Login" secondary={true} onTouchTap={this.handleLogin.bind(this)}/>
		</Dialog>);
	}
}

export default compose(
		connect(
			state=>({Login:state.Login}),
			dispatch=>({
				closeDialog:()=>{dispatch({type:"LOGIN_DIALOG_CLOSE"});},
				showSnackbar:(message)=>dispatch({type:"ADMIN_SITE_SNACKBAR_OPEN",message})
			})
			)
	)(LoginDialog);