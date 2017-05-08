import React,{PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Checkbox from 'material-ui/Checkbox';
import {login,saveUserProfile} from '../../auth';
class Login extends React.Component{
	handleLogin(){
		let {Login,showSnackbar} = this.props;
		login(Login.edit).then(result=>{
			if(result && result.success){
				saveUserProfile(result);
				window.location.href='/admin/Product';
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
		let {Login,makeEdit} = this.props;
		let {edit} = Login;
		let {UserName,Password,Remember} =edit;
		return (
			<div className="row fullheight" style={{justifyContent:'center',alignItems:'center'}}>
				<div style={{display:'inline-block'}}>
					<TextField name="UserName" hintText="User Name" ref="UserName" floatingLabelText="User Name" value={UserName} onChange={e=>{makeEdit({UserName:e.target.value});}}/>
					<br/>
					<TextField name="Password" hintText="Password" ref="Password" floatingLabelText="Password" value={Password} onChange={e=>{makeEdit({Password:e.target.value});}} type="password" />
					<br/>
					<Checkbox label="Keep Login" checked={Remember} onCheck={e=>{makeEdit({Remember:e.target.checked});}}/>
					<br/>
					<RaisedButton label="Login" secondary={true} onTouchTap={this.handleLogin.bind(this)}/>
				</div>
			</div>
			);
	}
}

export default compose(
		connect(
			state=>({Login:state.Login}),
			dispatch=>({
				showSnackbar:(message)=>dispatch({type:"ADMIN_SITE_SNACKBAR_OPEN",message}),
				makeEdit:(edit)=>{dispatch({type:'LOGIN_EDIT',edit});}
			})
			)
	)(Login);