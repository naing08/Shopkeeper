import React,{PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ContentClear from 'material-ui/svg-icons/content/clear';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
class SignUpDialog extends React.Component{
	handleSignUp(){
		let {onRequestSignUp,SignUp,closeDialog} = this.props;
		let {isValid} = SignUp;
		if(isValid){
			onRequestSignUp().then(({success,message})=>{
				if(success)
					closeDialog();
			});
		}
	}
	render(){
		let {SignUp,makeEdit,closeDialog} = this.props;
		let {UserName,Password,ConfirmPassword,dialogOpen,Remember,errors} = SignUp;
		return (
			<Dialog
				title="Sign up"
				contentStyle={{width:'400px'}}
				open={dialogOpen}
				actions={[
						<FlatButton label="OK" secondary={true} onTouchTap={this.handleSignUp.bind(this)}/>,
						<FlatButton label="Cancel" onTouchTap={closeDialog}/>
					]}
			>
				<div className="row">
					<TextField errorText={errors.UserName} className="col-xs-12" name="UserName" id="UserName" hintText="User Name" ref="UserName" floatingLabelText="User Name" value={UserName} onChange={e=>{makeEdit({UserName:e.target.value});}}/>
					<TextField errorText={errors.Password} className="col-xs-12" name="Password" id="Password" hintText="Password" ref="Password" floatingLabelText="Password" value={Password} onChange={e=>{makeEdit({Password:e.target.value});}} type="password" />
					<TextField errorText={errors.ConfirmPassword} className="col-xs-12" name="ConfirmPassword" id="Password" hintText="Confirm Password" ref="ConfirmPassword" floatingLabelText="Confirm Password" value={ConfirmPassword} onChange={e=>{makeEdit({ConfirmPassword:e.target.value});}} type="password" />
					<Checkbox  className="col-xs-12" label="Keep Login" checked={Remember} onCheck={e=>{makeEdit({Remember:e.target.checked});}}/>
				</div>
			</Dialog>
			);
	}
}

export default compose(
		connect(
			state=>({SignUp:state.SignUp}),
			dispatch=>({
				showSnackbar:(message)=>dispatch({type:"SITE_SNACKBAR_OPEN",message}),
				makeEdit:(edit)=>{dispatch({type:'SIGNUP_EDIT',edit});},
				closeDialog:()=>{
					dispatch({type:'SIGNUP_EDIT',edit:{dialogOpen:false}});
				}
			})
			)
	)(SignUpDialog);