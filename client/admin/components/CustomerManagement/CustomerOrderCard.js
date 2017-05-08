import React from 'react';
import {Card,CardHeader,CardText} from 'material-ui/Card';


class CustomerOrderCard extends React.Component{
	render(){
		let {id, OrderNo,OrderDate,TotalAmount,TotalQty} = this.props;
		let labelStyle = {
			width:'130px'
		}
		return (
			<div className="grid-item col-lg-3 col-md-4 col-sm-6 col-xs-12 ">
				<Card>
					<CardHeader title={`#${OrderNo}`}/>
					<CardText>
						<div className="row">
							<div style={labelStyle}>Order Date</div>
							<div>{OrderDate.formatAsShortDate()}</div>
						</div>
						<div className="row">
							<div style={labelStyle}>Total Amount</div>
							<div>{TotalAmount}</div>
						</div>
						<div className="row">
							<div style={labelStyle}>Total Qty</div>
							<div>{TotalQty}</div>
						</div>
					</CardText>
				</Card>
			</div>
			);
	}
}

export default CustomerOrderCard;