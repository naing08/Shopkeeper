import React,{PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from '../Dropzone';
import PhotoManager from '../../../../common/PhotoManager';
import {
    Step,
    Stepper,
    StepLabel,
} from 'material-ui/Stepper';
import {updateCustomerMutation} from '../../apollo/Customer';
import {initialData} from '../../reducer/Customer';
import LoadingIndicator from '../../../common/LoadingIndicator';
class CreateCustomerDialog extends React.Component{
	constructor(){
		super(...arguments);
		this.state={activeStep:0,imageUploading:false,errorText:'',loading:false,loadingMessage:''};
	}

	handleNext(){
		let {activeStep} = this.state;
		let {CustomerEdit,validateCustomer} = this.props;
		validateCustomer();
		let {isValid} = CustomerEdit;
		if(activeStep ===0 && isValid){
			this.handleSubmit().then(()=>{this.setState({activeStep:1});});
		}
	}

	handleBack(){
		this.setState({activeStep:0});
	}

	handleSubmit(){
		let {CustomerEdit,update,closeDialog} = this.props;
		let{id,FullName,PhoneNo,Email,Region,Township,Address,Photo,PhotoFormat} = CustomerEdit;
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

	onImageDrop(files){
		this.props.edit({PhotoUrl:files[0].preview});
        this.handleImageUpload(files[0]);
	}

	handleImageUpload(file){
		this.setState({imageUploading:true,errorText:''});
        PhotoManager.Customer.upload(file)
            .then(({secure_url,format,public_id})=>{
                this.props.edit({Photo:public_id,PhotoFormat:format,PhotoUrl:secure_url});
                this.setState({imageUploading:false});
            }).catch((error)=>{
            this.setState({imageUploading:false, errorText:error});
        });
	}

	renderStepContent(){
		let {activeStep,imageUploading } = this.state;
		let {CustomerEdit,edit} = this.props;
		let {errors,FullName,PhoneNo,Email,Region,Township,Address,PhotoUrl} = CustomerEdit;
		switch(activeStep){
			case 0:
				return (<div className="row around-xs">
							<TextField hintText="Name" className="col-xs-50" floatingLabelText = "Name" errorText = {errors.FullName} value={FullName} onChange={(e)=>{edit({FullName:e.target.value});}}/>
							<TextField hintText="Phone No" className="col-xs-50" floatingLabelText="Phone No" errorText = {errors.PhoneNo} value = {PhoneNo} onChange = {(e)=>{edit({PhoneNo:e.target.value});}}/>
							<TextField hintText = "Email" floatingLabelText="Email" errorText = {errors.Email} value = {Email} onChange={(e)=>{edit({Email:e.target.value});}}/>
							<TextField hintText = "Region" floatingLabelText = "Region" errorText = {errors.Region} value = {Region} onChange={(e)=>{edit({Region:e.target.value});}}/>
							<TextField hintText = "Township" floatingLabelText = "Township" errorText = {errors.Township} value = {Township} onChange = {(e)=>{edit({Township:e.target.value});}}/>
							<TextField hintText="Address" multiLine={true} rows={5} floatingLabelText = "Address" errorText = {errors.Address} value = {Address} onChange = {(e)=>{edit({Address:e.target.value});}}/>
						</div>);
				break;
			case 1:
				return (
						<Dropzone
							uploading={imageUploading}
							dropZoneProp = {{
                                multiple:false,
                                accept:"image/*",
                                onDrop:this.onImageDrop.bind(this),
                                style:{margin:'0 auto', textAlign:'center',width:'200px', border:'1px dashed',padding:'10px'}
                            }}>
                            <div>Drop an image or click to select a file to upload.</div>
                            <img style={{width:'150px',height:'150px'}} src={PhotoUrl}/>
                        </Dropzone>
					);
				break;
			default:
				return null;
				break;
		}
	}
	render(){
		let {open,edit,closeDialog} = this.props;
		let {activeStep,errorText,loading,loadingMessage} = this.state;
		const dialogActions = [
			<FlatButton
		        label="Cancel"
		        primary={true}
		        onTouchTap={()=>{
		        	edit(initialData);
		        	closeDialog();
		        	this.setState({activeStep:0});
		        }}
		      />
		];
		if(activeStep === 1){
			dialogActions.push(<FlatButton
			        label="Back"
			        primary={true}
			        onTouchTap={this.handleBack.bind(this)}
			      />);
			dialogActions.push(<FlatButton
		        label="Submit"
		        primary={true}
		        keyboardFocused={true}
		        onTouchTap = {()=>{
		        	this.handleSubmit().then(()=>{		        		
		        		edit(initialData);
		        		closeDialog();
		        		this.setState({activeStep:0});
		        	})
		        }}
		      />);
		}
		if(activeStep ===0){
			dialogActions.push(<FlatButton
		        label="Next"
		        primary={true}
		        onTouchTap = {this.handleNext.bind(this)}
		      />);
		}
		
		return (<Dialog 
					open={open}
					title="New Customer"
					modal={true}
					autoScrollBodyContent={true}
					actions={dialogActions}
				>
					<Stepper activeStep={activeStep}>
	                    <Step >
	                        <StepLabel>Info</StepLabel>
	                    </Step>
	                    <Step >
	                        <StepLabel>Profile Photo</StepLabel>
	                    </Step>
	                </Stepper>
					{this.renderStepContent()}
					<LoadingIndicator loading={loading} errorText = {errorText} loadingMessage={loadingMessage} />
				</Dialog>);
	}
}

export default compose(
	connect(
			(state)=>({open:state.Customer.createDialogOpen,CustomerEdit:state.Customer.edit}),
			(dispatch)=>({
				closeDialog:()=>{dispatch({type:'CUSTOMER_CREATE_DIALOG_CLOSE'});},
				edit:(edit)=>{dispatch({type:'CUSTOMER_EDIT',edit});},
				validateCustomer:()=>{dispatch({type:'CUSTOMER_VALIDATE'});}
			})
		),
	updateCustomerMutation
	)(CreateCustomerDialog);