import React from 'react';
import {Card,CardText} from 'material-ui/Card';
import {customerOrderByIdQuery} from '../../apollo/CustomerOrder';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import DetailCard from './DetailCard';
import Accounting from 'accounting';
import AppBar from './AppBar';
class OrderViewer extends React.Component{
	render(){
		let {loading,Order} = this.props;
		let {OrderNo,OrderDate,ShipToName,ShipToEmail,ShipToPhoneNo,ShipToTownship,ShipToRegion,ShipToAddress,createdAt,OrderDetail,TotalQty, TotalAmount} = Order?Order: {};
		OrderDate = OrderDate? new Date(OrderDate): null;
		createdAt = createdAt? new Date(createdAt) :null;
		let Region = ShipToRegion? ShipToRegion.Name1: '';
		let Township = ShipToTownship? ShipToTownship.Name1:'';
		let labelStyle = {
			opacity:"0.8"
		};
		return (
			<div className="order-viewer fullheight">
				<AppBar title={`Order ${OrderNo}`}/>
				<div className="scrollable" style={{padding:'16px'}}>
					<div className="header-viewer">
						<h3>Order Info</h3>
						<Card>
							<CardText>
								<div className="row" style={{lineHeight:'24px'}} >
									<div className="col-xs-4" style={labelStyle}>Order no</div>
									<div className="col-xs-8">{OrderNo}</div>

									<div className="col-xs-4" style={labelStyle}>Order date</div>
									<div className="col-xs-8">{OrderDate ? OrderDate.formatAsShortDate(): null}</div>

									<div className="col-xs-4" style={labelStyle}>Ship to</div>
									<div className="col-xs-8">{ShipToName}</div>

									<div className="col-xs-4" style={labelStyle}>Phone No</div>
									<div className="col-xs-8">{ShipToPhoneNo}</div>

									<div className="col-xs-4" style={labelStyle}>Email</div>
									<div className="col-xs-8">{ShipToEmail}</div>

									<div className="col-xs-4" style={labelStyle}>Township</div>
									<div className="col-xs-8">{`${Township} , ${Region}`}</div>

									<div className="col-xs-4" style={labelStyle}>Address</div>
									<div className="col-xs-8">{ShipToAddress}</div>

									<div className="col-xs-4" style={labelStyle}>Total qty </div>
									<div className="col-xs-8">{Accounting.formatNumber(TotalQty,0)} </div>

									<div className="col-xs-4" style={labelStyle}>Total amount </div>
									<div className="col-xs-8">{Accounting.formatMoney(TotalAmount)}</div>

									<div className="col-xs-12" style={{textAlign:'right', paddingTop:'4px', fontWeight:300,fontSize:'14px'}}>{createdAt? createdAt.timeAgo(): null}</div>
								</div>
							</CardText>
						</Card>
					</div>
					<div className="order-detail-viewer">
						<h3>Order Detail</h3>
						<Card>
							<CardText>
								<div className="layout detail-grid">
									<div className="detail-header row">
										<div className="product-name col-xs-12">Product Name</div>
										<div className="product-numbers row between-xs">
											<div className="product-price">Unit Price</div>
											<div className="product-qty">Qty</div>
											<div className="product-subtotal">Subtotal</div>
										</div>
									</div>
									{OrderDetail? OrderDetail.map(orderDetail=>(<DetailCard orderDetail={orderDetail} key={orderDetail.id}/>)) : null}
								</div>
							</CardText>
						</Card>
					</div>
				</div>
			</div>
			);
	}
}


const TheComponent = compose(
		customerOrderByIdQuery
	)(OrderViewer);

export default ({params,...props})=>{
	let {id} = params? params: {};
	return (<TheComponent orderId={id} {...props}/>);
}