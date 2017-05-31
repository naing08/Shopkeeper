import React from 'react';
import BankTransfer from './BankTransfer';
import {Card,CardText} from 'material-ui/Card'
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
class Payment extends React.Component{
	componentDidMount(){
		let {resetPayment} = this.props;
		resetPayment();
	}
	render(){
		return (
			<Card className="checkout_payment">
				<CardText>
					<BankTransfer/>
				</CardText>
			</Card>
			)
	}
}

export default compose(
		connect(
			state=>({}),
			dispatch=>({
				resetPayment:()=>{
					dispatch({type:'CHECKOUT_PAYMENT_RESET'});
				}
			})
			)
	)(Payment);