import React,{PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from '../Dropzone';
import PhotoManager from '../../../common/PhotoManager';
import {updateCustomerMutation} from '../../../common/apollo/Customer/index';
import {initialData} from '../../../common/apollo/reducer/Customer';
import LoadingIndicator from '../LoadingIndicator';
class EditCustomerDialog extends React.Component{
	constructor(){
		super(...arguments);
		this.state={errorText:'',loading:false,loadingMessage:''};
	}

	
	handleSubmit(){
		let {CustomerEdit,update,closeDialog} = this.props;
		let{id,FullName,PhoneNo,Email,Region,Township,Address,Photo,PhotoFormat,} = CustomerEdit;
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
			this.setState({loading:false,errorText:error});
		});
	}

	
	render(){
		let {open,edit,closeDialog,CustomerEdit} = this.props;
		let {errorText,loading,loadingMessage} = this.state;
		let {FullName,PhoneNo,Email,Region,Township,Address,errors} = CustomerEdit;
		const dialogActions = [
			<FlatButton
		        label="Cancel"
		        primary={true}
		        onTouchTap={()=>{
		        	edit(initialData);
		        	closeDialog();
		        }}
		      />,
		      <FlatButton
		        label="Submit"
		        primary={true}
		        onTouchTap={()=>{
		        	this.handleSubmit().then(()=>{		        		
		        		edit(initialData);
		        		closeDialog();
		        	});
		        }}
		      />
		];
		
		return (<Dialog 
					open={open}
					title="Edit Customer Info"
					modal={true}
					autoScrollBodyContent={true}
					actions={dialogActions}
				>
					<div className="row around-xs">
						<TextField hintText="Name" className="col-xs-50" floatingLabelText = "Name" errorText = {errors.FullName} value={FullName} onChange={(e)=>{edit({FullName:e.target.value});}}/>
						<TextField hintText="Phone No" className="col-xs-50" floatingLabelText="Phone No" errorText = {errors.PhoneNo} value = {PhoneNo} onChange = {(e)=>{edit({PhoneNo:e.target.value});}}/>
						<TextField hintText = "Email" floatingLabelText="Email" errorText = {errors.Email} value = {Email} onChange={(e)=>{edit({Email:e.target.value});}}/>
						<TextField hintText = "Region" floatingLabelText = "Region" errorText = {errors.Region} value = {Region} onChange={(e)=>{edit({Region:e.target.value});}}/>
						<TextField hintText = "Township" floatingLabelText = "Township" errorText = {errors.Township} value = {Township} onChange = {(e)=>{edit({Township:e.target.value});}}/>
						<TextField hintText="Address" multiLine={true} rows={5} floatingLabelText = "Address" errorText = {errors.Address} value = {Address} onChange = {(e)=>{edit({Address:e.target.value});}}/>
					</div>
					<LoadingIndicator loading={loading} errorText = {errorText} loadingMessage={loadingMessage} />
				</Dialog>);
	}
}

export default compose(
	connect(
			(state)=>({open:state.Customer.editDialogOpen,CustomerEdit:state.Customer.edit}),
			(dispatch)=>({
				closeDialog:()=>{dispatch({type:'CUSTOMER_EDIT_DIALOG_CLOSE'});},
				edit:(edit)=>{dispatch({type:'CUSTOMER_EDIT',edit});},
				validateCustomer:()=>{dispatch({type:'CUSTOMER_VALIDATE'});}
			})
		),
	updateCustomerMutation
	)(EditCustomerDialog);