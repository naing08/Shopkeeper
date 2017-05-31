import React,{PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from '../Dropzone';
import PhotoManager from '../../../../common/PhotoManager';
import {updateCustomerMutation} from '../../apollo/Customer';
import {initialData} from '../../reducer/Customer';
import LoadingIndicator from '../../../common/LoadingIndicator';
import regionQuery from '../../apollo/Region';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import TownshipSelector from '../TownshipSelector';
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
		let {open,edit,closeDialog,CustomerEdit,Region} = this.props;
		Region = Region? Region:[];
		let {errorText,loading,loadingMessage} = this.state;
		let {FullName,PhoneNo,Email,RegionId,TownshipId,Address,errors} = CustomerEdit;
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
						<SelectField 
							name="customer_region" 
							value={RegionId} 
							onChange={
								(e,index,value)=>{
									edit({RegionId:value,Region:Region[index].Name1});
								}
							}
							floatingLabelText="Region"
							hintText="Region"
							errorText={errors.RegionId}
							id="customer_region"
							dropDownMenuProps={
								{
									targetOrigin:{vertical:'bottom',horizontal:'left'},
	                        		anchorOrigin:{vertical:'top',horizontal:'left'}
								}
							}
						>
							{
								Region? Region.map(({id,Name1,Name2},index)=>(<MenuItem value={id} primaryText={Name1} key={index}/>)):null
							}
						</SelectField>
						<TownshipSelector 
							regionId={RegionId} 
							onChange={
								(TownshipId,Township)=>{edit({TownshipId,Township});}
							}
							value={TownshipId}
							selectFieldProps={{
								name:"customer_township",
								floatingLabelText:"Township",
								hintText:"Township",
								errorText:errors.TownshipId,
								id:"customer_township"
							}}
						/>
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
	updateCustomerMutation,
	regionQuery
	)(EditCustomerDialog);