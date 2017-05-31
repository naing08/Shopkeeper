import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import bankAccountQuery from '../../apollo/BankAccount';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {CardHeader} from 'material-ui/Card';
import PaymentSlipUploader from './PaymentSlipUploader';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

class BankTransfer extends React.Component{
	
	render(){
		let {bankAccountLoading,BankAccount,BankTransfer,editBankTransfer} = this.props;
		let {BankAccountId,Attachment,TransferDate,Remark,errors} = BankTransfer? BankTransfer : {};
		return (
				<div className="checkout_payment_banktransfer_panel row">
					<div className="error-text" >{errors.BankAccountId}</div>
					<RadioButtonGroup className="col-xs-12" name="bankAccounts" className="bank-radio-group" valueSelected={BankAccountId} onChange={(e,value)=>{editBankTransfer({BankAccountId:value})}}>
						{BankAccount? BankAccount.map(({id,Name,AccountNo})=>(<RadioButton className="bank-radio-item" key={id} value={id} label={<CardHeader avatar={`/img/letter/letter_${Name[0].toLowerCase()}.png`} title={Name} subtitle={AccountNo}/>}/>)):null}
					</RadioButtonGroup>
					<DatePicker className="col-xs-12" textFieldStyle={{width:'100%'}} errorText={errors.TransferDate} value={TransferDate} hintText="Transfer Date" floatingLabelText="Transfer Date" id="BankTransfer_Date" onChange={(e,value)=>{editBankTransfer({TransferDate:value});}} formatDate={date=>date.formatAsShortDate()}/>
					<PaymentSlipUploader className="col-xs-12"/>
					<TextField className="col-xs-12" id="BankTransfer_Remark" multiLine={true} rows={5} errorText={errors.Remark} value={Remark} hintText="Remark" floatingLabelText="Remark" onChange={e=>{editBankTransfer({Remark:e.target.value})}}/>
				</div>
			);
	}
}


export default compose(
		connect(
			state=>({BankTransfer:state.Checkout.Payment.BankTransfer}),
			dispatch=>({
				editBankTransfer:edit=>{
					dispatch({type:'CHECKOUT_PAYMENT_BANKTRANSFER_EDIT',edit});
				}
			})
			),
		bankAccountQuery
	)(BankTransfer);