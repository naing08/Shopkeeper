import React from 'react';
import Delivery from './Delivery';
import Payment from './Payment';
import OrderPreview from './OrderPreview';
import RaisedButton from 'material-ui/RaisedButton';
import {createCustomerOrder} from '../../apollo/CustomerOrder';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AppBar from './AppBar';
import SignUpDialog from '../SignUpDialog';
import {saveUserProfile} from '../../../auth';
import {withRouter} from 'react-router';
import {signUpCustomerMutation} from '../../apollo/Customer';
class Checkout extends React.Component{

	constructor(){
		super(...arguments);
		this.state={
			disableSubmit:false,
			submittedOrderNo:'',
			orderSuccessDialogOpen:false
		};
	}
	handleSignUp(){
		let {checkout,SignUp:{UserName,Password,Remember},registerCustomer,setUserProfile} = this.props;
		let {ShipToName,ShipToPhoneNo,ShipToEmail,ShipToTownshipId,ShipToAddress} = checkout.Delivery;
		return registerCustomer({UserName,Password,FullName:ShipToName,PhoneNo:ShipToPhoneNo,Email:ShipToEmail,TownshipId:ShipToTownshipId,Address:ShipToAddress,Remember})
		.then(({data:{RegisterCustomer}})=>{
			let session = RegisterCustomer;
			saveUserProfile(session);
			let {user_id,user_name,account_type,profile_pic,full_name}=session;
			setUserProfile({userId:user_id,userName:user_name,accountType:account_type,profilePic:profile_pic,fullName:full_name});
			this.submitOrder();
			return {success:true,message:''};
		}).catch(error=>{
			return {success:false,message:error.message};
		});
	}
	requestSignUp(){
		let {openSignUpDialog} = this.props;
		openSignUpDialog();
	}
	
	submitOrder(){
		let {createCustomerOrder,checkout,cartItems,showSnackbar,setBankTransfer,setDelivery,userProfile} = this.props;
		let {ShipToName,ShipToPhoneNo,ShipToEmail,ShipToTownshipId,ShipToAddress} = checkout.Delivery;
		let detail = cartItems.map(({id,Qty,Price})=>({ProductId:id,Qty,Price}));
		let {Attachment,TransferDate,Remark,BankAccountId}= checkout.Payment.BankTransfer;
		let order = {
			ShipToName,
			ShipToPhoneNo,
			ShipToEmail,
			ShipToTownshipId,
			ShipToAddress,
			OrderDetail:detail,
			BankTransfer:{Attachment,TransferDate,Remark,BankAccountId}
		};
		this.setState({disableSubmit:true});
		createCustomerOrder(order).then(({data})=>{
			let {CustomerOrder} = data? data: {};
			let{instance,errors,detail,bankTransfer} = CustomerOrder?CustomerOrder:{};
			let bankTransferErrors = bankTransfer? bankTransfer.errors:{};
			if(!instance){
				let errorMessage="";
				const errs = {};
                errors.every((error)=>{
                    if(error.key)
                        errs[error.key] = error.message;
                    else
                        errorMessage = error.message;
                    return true;
                });
				setDelivery({errors:errs});
				const bankTransferErrs = {};
                bankTransferErrors.every((error)=>{
                    if(error.key)
                        bankTransferErrs[error.key] = error.message;
                    else
                        errorMessage=error.message;
                    return true;
                });
				setBankTransfer({errors:bankTransferErrors});
				showSnackbar("Could not submit order." + errorMessage);
				this.setState({disableSubmit:false});
			}else{
				let {OrderNo} = instance;
				this.setState({submittedOrderNo:OrderNo,orderSuccessDialogOpen:true});
			}
		}).catch(error=>{
			showSnackbar("Could not submit order." + error.message);
			this.setState({disableSubmit:false});
		});
	}
	handleSubmitOrder(){
		let {checkout,showSnackbar,userProfile} = this.props;
		let {userId,accountType} = userProfile? userProfile: {};
		
		if(checkout.Delivery.isValid && checkout.Payment.BankTransfer.isValid){
			if(!userId || accountType !=='CUSTOMER'){
				this.requestSignUp();
			}else{
				this.submitOrder();
			}
		}else{
			showSnackbar('You have to fill all information required to make checkout.');
		}
	}

	render(){
		let {router,cartItems,resetCartItems} = this.props; 
		let {disableSubmit,submittedOrderNo,orderSuccessDialogOpen} = this.state;
		return (
				<div className="layout fullheight">
					<AppBar title="Check out"/>
					{
						cartItems.length==0?
						(<div style={{padding:'16px',textAlign:'center'}}>Your cart is empty.</div>)
						:
						(<div className="row  checkout_panel scrollable fullheight">
							<div className="col-xs-12 col-md-4 delivery">
								<h3>Shipping Info</h3>
								<Delivery/>
							</div>
							<div  className="col-xs-12 col-md-4 payment">
								<h3>Payment</h3>
								<Payment/>
							</div>
							<div  className="col-xs-12 col-md-4 order_preview">
								<h3>Order Preview</h3>
								<OrderPreview/>
								<RaisedButton style={{display:"block",margin:'16px'}} disabled={disableSubmit} label="submit order" onClick={this.handleSubmitOrder.bind(this)} secondary={true}/>
							</div>
							<Dialog
								open={orderSuccessDialogOpen}
								title="Order submitted"
								actions={
									[
										<FlatButton label="OK" onClick={()=>{this.setState({orderSuccessDialogOpen:false}); resetCartItems(); router.push('/');}}/>
									]
								}
							>
								Your order has been submitted. Please note order no <em>{submittedOrderNo}</em>
							</Dialog>
							<SignUpDialog	onRequestSignUp={this.handleSignUp.bind(this)} />
						</div>)
					}
					
				</div>
			);
	}
}

export default compose(
	connect(
		state=>({checkout:state.Checkout,cartItems:state.ProductBrowser.cart.items,userProfile:state.UserProfile,SignUp:state.SignUp}),
		dispatch=>({
			showSnackbar:message=>{
				dispatch({type:'SITE_SNACKBAR_OPEN',message});
			},
			setDelivery:(edit)=>{
				dispatch({type:'CHECKOUT_DELIVERY_EDIT',edit});
			},
			setBankTransfer:(edit)=>{
				dispatch({type:'CHECKOUT_PAYMENT_BANKTRANSFER_EDIT',edit});
			},
			resetCartItems:()=>{
				dispatch({type:'PRODUCT_CART_ITEMS_RESET'});
			},
			openSignUpDialog:()=>{
				dispatch({type:'SIGNUP_EDIT',edit:{dialogOpen:true}});
			},
			setUserProfile:(edit)=>{
				dispatch({type:'USER_PROFILE_EDIT',edit});
			}
		})
		),
	createCustomerOrder,
	signUpCustomerMutation,
	withRouter
	)(Checkout);