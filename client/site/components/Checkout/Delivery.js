import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TownshipSelector from '../TownshipSelector';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import regionQuery from '../../apollo/Region';
import {Card,CardText,CardHeader} from 'material-ui/Card';
import {customerByIdQuery} from '../../apollo/Customer';

class Delivery extends React.Component{

	constructor(){
		super(...arguments);
	}
	componentDidMount(){
		let {CustomerById,editDelivery,resetDelivery} = this.props;
		if(CustomerById){
			let {FullName,PhoneNo,Email,Region,Township,Address} = CustomerById;
			let RegionId = Region? Region.id: null;
			let TownshipId=Region?Region.id:null;
			editDelivery({ShipToName:FullName,ShipToPhoneNo:PhoneNo,ShipToEmail:Email,ShipToRegionId:RegionId,ShipToTownshipId:TownshipId,ShipToAddress:Address});
		}else{
			resetDelivery();
		}
	}
	componentWillReceiveProps({loadingCustomerById,CustomerById,editDelivery}){
		let current_loadingCustomerById = this.props.loadingCustomerById;
		if(current_loadingCustomerById && !loadingCustomerById && CustomerById){
			let {FullName,PhoneNo,Email,Region,Township,Address} = CustomerById;
			let RegionId = Region? Region.id: null;
			let TownshipId=Region?Region.id:null;
			editDelivery({ShipToName:FullName,ShipToPhoneNo:PhoneNo,ShipToEmail:Email,ShipToRegionId:RegionId,ShipToTownshipId:TownshipId,ShipToAddress:Address});
		}
	}
	render(){
		let {delivery,editDelivery,Region,openLoginDialog,userProfile} = this.props;
		let {userId,userName,profilePic,accountType,fullName} = userProfile? userProfile: {};
		let cardHeader = 
		Region = Region? Region:[];
		let {ShipToName,ShipToPhoneNo,ShipToEmail,ShipToRegionId,ShipToTownshipId,ShipToAddress,errors} = delivery? delivery:{};
		errors = errors? errors: {};
		return (
			<Card>
				{userId && accountType == "CUSTOMER" ? (<CardHeader title={fullName} subtitle={userName} avatar={profilePic}/>) : (<div style={{fontSize:'14px',fontWeight:'300', padding:'16px 16px 0 16px'}}>Already registered? <a href="#" onClick={e=>{e.preventDefault();openLoginDialog();}}>Log in</a> to your account</div>)}
				<CardText  className="checkout_delivery_panel row">
					<TextField className="checkout_delivery_field name col-xs-12" id="Delivery_Name" name="Delivery_Name" value={ShipToName} onChange={e=>{editDelivery({ShipToName:e.target.value})}} floatingLabelText="Name" hintText="Name" errorText={errors.ShipToName}/>
					<TextField className="checkout_delivery_field phone col-xs-12" id="Delivery_Phone" name="Delivery_Phone" value={ShipToPhoneNo} onChange={e=>{editDelivery({ShipToPhoneNo:e.target.value})}} floatingLabelText="Phone No" hintText="Phone No" errorText={errors.ShipToPhoneNo}/>
					<TextField className="checkout_delivery_field email col-xs-12" id="Delivery_Email" name="Delivery_Email" value={ShipToEmail} onChange={e=>{editDelivery({ShipToEmail:e.target.value})}} floatingLabelText="Email" hintText="Email" errorText={errors.ShipToEmail}/>
					<SelectField 
						className="checkout_delivery_field region col-xs-12"
						name="Delivery_Region" 
						value={ShipToRegionId} 
						onChange={
							(e,index,value)=>{
								editDelivery({ShipToRegionId:value,ShipToRegion:Region[index].Name1});
							}
						}
						floatingLabelText="Region"
						hintText="Region"
						errorText={errors.ShipToRegionId}
						id="Delivery_Region"
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
						regionId={ShipToRegionId} 
						onChange={
							(ShipToTownshipId,ShipToTownship)=>{editDelivery({ShipToTownshipId,ShipToTownship});}
						}
						value={ShipToTownshipId}
						selectFieldProps={{
							name:"Delivery_Township",
							floatingLabelText:"Township",
							hintText:"Township",
							errorText:errors.ShipToTownshipId,
							id:"Delivery_Township",
							className:"checkout_delivery_field township col-xs-12"
						}}
					/>
					<TextField className="checkout_delivery_field address col-xs-12" id="Delivery_Address" multiLine={true} rows={5} name="Delivery_Address" value={ShipToAddress} onChange={e=>{editDelivery({ShipToAddress:e.target.value});} } floatingLabelText="Address" hintText="Address" errorText={errors.ShipToAddress}/>
				</CardText>
			</Card>
			);
	}
}

const CustomerByIdQueryWrapper = compose(
		customerByIdQuery
	)(Delivery);

const TheComponent = ({userProfile,...props})=>{
	let {entityId,accountType} = userProfile? userProfile:{};
	if(accountType !== 'CUSTOMER')
		entityId=null;
	return <CustomerByIdQueryWrapper {...props} customerId={entityId} userProfile={userProfile} />
};

export default compose(
		connect(
				state=>({delivery:state.Checkout.Delivery,userProfile:state.UserProfile}),
				dispatch=>({
					editDelivery:edit=>{
						dispatch({type:'CHECKOUT_DELIVERY_EDIT',edit});
					},
					openLoginDialog:()=>{
						dispatch({type:'LOGIN_DIALOG_OPEN'});
					},
					resetDelivery:()=>{
						dispatch({type:'CHECKOUT_DELIVERY_RESET'});
					}
				})
			),
		regionQuery
	)(TheComponent);