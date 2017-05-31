import update from 'react-addons-update';
const initialData = {
	Delivery:{
		ShipToName:'',
		ShipToPhoneNo:'',
		ShipToEmail:'',
		ShipToTownshipId:null,
		ShipToTownship:'',
		ShipToAddress:'',
		ShipToRegionId:null,
		ShipToRegion:'',
		errors:{}
	},
	Payment:{
		Method:null,
		BankTransfer:{
			BankAccountId:null,
			Attachment:'',
			Remark:'',
			TransferDate:null	,
			attachmentUploading:false,
			errors:{}
		},
	}
}

function validateDeliveryInformation(delivery){
	let {ShipToName,ShipToPhoneNo,ShipToTownshipId,ShipToRegionId,ShipToAddress,errors}=delivery;
	errors = errors? errors:{};
	let isValid = true;
	if(!ShipToName){
		errors.ShipToName = "Name is required";
		isValid=false;
	}else{
		errors.ShipToName="";
	}
	if(!ShipToPhoneNo){
		errors.ShipToPhoneNo = "Phone no is required";
		isValid = false;
	}else{
		errors.ShipToPhoneNo = "";
	}
	if(!ShipToTownshipId){
		errors.ShipToTownshipId = "Select township";
		isValid=false
	}else
		errors.ShipToTownshipId="";

	if(!ShipToRegionId){
		errors.ShipToRegionId="Select region";
		isValid = false;
	}else
		errors.ShipToRegionId="";

	if(!ShipToAddress){
		errors.ShipToAddress = "Address is required";
		isValid = false;
	}
	else
		errors.ShipToAddress = "";

	return {isValid,errors};
}

function validateBankTransfer(bankTransfer){
	let {TransferDate,Attachment,BankAccountId,errors} = bankTransfer;
	errors = errors? errors: {};
	let isValid = true;
	if(!TransferDate){
		isValid = false;
		errors.TransferDate="Transfer date is required.";
	}else
		errors.TransferDate="";

	if(!Attachment){
		isValid = false;
		errors.Attachment = "Attachment is required.";
	}else
		errors.Attachment = "";

	if(!BankAccountId){
		isValid = false;
		errors.BankAccountId = "Please select bank account.";
	}else{
		errors.BankAccountId = "";		
	}
	return {isValid,errors};
}


const Delivery=(state,action)=>{
	switch(action.type){
		case 'CHECKOUT_DELIVERY_EDIT':
			let {RegionId} = action.edit;
			if('RegionId' in action.edit){
				if(RegionId !==state.RegionId)
					action.edit.TownshipId=null;
			}
			let newState = Object.assign({},state,action.edit);
			return Object.assign({},newState,validateDeliveryInformation(newState));
			break;
		case 'CHECKOUT_DELIVERY_RESET':
			return Object.assign({},initialData.Delivery,validateDeliveryInformation(initialData.Delivery));
			break;
		default:
			return state;
	}
}

const BankTransfer=(state,action)=>{
	switch(action.type){
		case 'CHECKOUT_PAYMENT_BANKTRANSFER_EDIT':
			let newState = Object.assign({},state,action.edit);
			return Object.assign({},newState,validateBankTransfer(newState));
			break;
		case 'CHECKOUT_PAYMENT_BANKTRANSFER_RESET':
			return Object.assign({},initialData.Payment.BankTransfer,validateBankTransfer(initialData.Payment.BankTransfer));
		default:
			return state;
	}
}

const Payment=(state,action)=>{
	switch(action.type){
		case 'CHECKOUT_PAYMENT_EDIT':
			return Object.assign({},state,action.edit);
			break;
		case 'CHECKOUT_PAYMENT_RESET':
			return update(Object.assign({},initialData.Payment),{
				BankTransfer:{
					$set:BankTransfer(initialData.BankTransfer,{type:'CHECKOUT_PAYMENT_BANKTRANSFER_RESET'})
				}
			});
			break;
		case 'CHECKOUT_PAYMENT_BANKTRANSFER_EDIT':
		case 'CHECKOUT_PAYMENT_BANKTRANSFER_RESET':
			return update(state,{
				BankTransfer:{
					$set:BankTransfer(state.BankTransfer,action)
				}
			});
			break;
		default:
			return state;
	}
}

const Checkout=(state=initialData,action)=>{
	switch(action.type){
		case 'CHECKOUT_RESET':
			return Checkout(initialData,{type:'CHECKOUT_VLAIDATE'});
			break;
		case 'CHECKOUT_VLAIDATE':
			return update(state,{
				Delivery:{
					$set:Object.assign({},state.Delivery,validateDeliveryInformation(state.Delivery))
				},
				Payment:{
					BankTransfer:{
						$set:Object.assign({},state.BankTransfer,validateBankTransfer(state.Payment.BankTransfer))
					}
				}
			});
			break;
		case 'CHECKOUT_DELIVERY_RESET':
		case 'CHECKOUT_DELIVERY_EDIT':
			return update(state,{
				Delivery:{
					$set:Delivery(state.Delivery,action)
				}
			})
			break;
		case 'CHECKOUT_PAYMENT_RESET':
		case 'CHECKOUT_PAYMENT_EDIT':
		case 'CHECKOUT_PAYMENT_BANKTRANSFER_EDIT':
		case 'CHECKOUT_PAYMENT_BANKTRANSFER_RESET':
			return update(state,{
				Payment:{
					$set:Payment(state.Payment,action)
				}
			});
			break;
		default:
			return state;
	}
}

export default Checkout;			