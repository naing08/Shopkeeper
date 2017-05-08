import React from 'react';
import {Card,CardHeader,CardText} from 'material-ui/Card';
class CustomerOrder extends React.Component{
	render(){
		let {CustomerOrderById} = this.props;
		let {OrderNo,OrderDate,TotalQty,TotalAmount,Customer} = CustomerOrderById? CustomerOrderById:{};
		let {FullName,PhotoUrl} = Customer? Customer:{};
		let labelStyle={width:'140px'};
		let valueStyle={width:'100px'};
		return (
			<Card>
				<CardHeader title={FullName} avatar={PhotoUrl}/>
				<CardText>
					<div className="row">
						<div className="row">
							<div style={labelStyle}>Order No</div>
							<div style={valueStyle}>{OrderNo}</div>
						</div>
						<div className="row">
							<div style={labelStyle}>Order Date</div>
							<div style={valueStyle}>{OrderDate?OrderDate.formatAsShortDate():null}</div>
						</div>
						<div className="row">
							<div style={labelStyle}>Total Amount</div>
							<div style={valueStyle}>{TotalAmount}</div>
						</div>
						<div className="row">
							<div style={labelStyle}>Total Qty</div>
							<div style={valueStyle}>{TotalQty}</div>
						</div>
					</div>
				</CardText>
			</Card>
			);
	}
}
export default CustomerOrder;