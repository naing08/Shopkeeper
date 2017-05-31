import React from 'react';
import {Card,CardText} from 'material-ui/Card';
import Accounting from 'accounting';
import {withRouter} from 'react-router';
class ItemCard extends React.Component{
	render(){
		let {order,router} = this.props;
		let {OrderNo,OrderDate,ShipToName,TotalQty,TotalAmount,createdAt,id} = order? order:{};
		let labelStyle = {
			opacity:"0.8"
		};
		return (
			<div style={{padding:"4px"}} className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
				<Card style={{cursor:'pointer'}} onClick={(e)=>{e.preventDefault();router.push(`/order/${id}`)}}>
					<CardText>
						<div style={{cursor:'hand'}} className="row" style={{lineHeight:'24px'}} >
							<div className="col-xs-4" style={labelStyle}>Order no</div>
							<div className="col-xs-8">{OrderNo}</div>

							<div className="col-xs-4" style={labelStyle}>Order date</div>
							<div className="col-xs-8">{OrderDate.formatAsShortDate()}</div>

							<div className="col-xs-4" style={labelStyle}>Ship to</div>
							<div className="col-xs-8">{ShipToName}</div>

							<div className="col-xs-4" style={labelStyle}>Total qty </div>
							<div className="col-xs-8">{Accounting.formatNumber(TotalQty)} </div>

							<div className="col-xs-4" style={labelStyle}>Total amount </div>
							<div className="col-xs-8">{Accounting.formatMoney(TotalAmount)}</div>

							<div className="col-xs-12" style={{textAlign:'right', paddingTop:'4px', fontWeight:300,fontSize:'14px'}}>{createdAt.timeAgo()}</div>
						</div>
					</CardText>
				</Card>
			</div>
			);
	}
}

export default withRouter(ItemCard);