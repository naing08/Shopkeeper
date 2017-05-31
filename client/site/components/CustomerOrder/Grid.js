import React from 'react';
import {customerOrderFetchQuery} from '../../apollo/CustomerOrder';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import Accounting from 'accounting';
import CsGrid from './CsGrid';
class Grid extends React.Component{
	constructor(){
		super(...arguments);
		this.state={
			primaryKey:'OrderNo',
			changeToCardAt:'xs',
			cardLabelWidth:'150px',
			columns:[
				{
					caption:"Order No",
					key:"OrderNo",
					width:'200px',
					canGrow:false,
					canGrow:1
				},
				{
					caption:'Date',
					key:'OrderDate',
					width:'100px',
					canGrow:false,
					hideAt:'xs',
					format:(value)=>(value? value.formatAsShortDate():'')
				},
				{
					caption:'Ship To',
					key:'ShipToName',
					width:'150px',
					canGrow:2,
					hideAt:'sm'
				},
				{
					caption:'Qty',
					key:'TotalQty',
					width:'50px',
					canGrow:false,
					textAlign:'right',
					captionAlign:'center',
					hideAt:'lg',
					format:(value)=>(value?Accounting.formatNumber(value,0):'')
				},{
					caption:'Amount',
					key:'TotalAmount',
					width:'150px',
					canGrow:false,
					textAlign:'right',
					captionAlign:'center',
					hideAt:'md',
					format:(value)=>(value? Accounting.formatMoney(value): '')
				},{
					caption:'Address',
					key:'Address',
					width:'200px'
				}
			]
		};
	}
	render(){
		let {CustomerOrders,customerOrderFetching,fetchMoreCustomerOrder} = this.props;
		let {page,pageSize,hasMore,CustomerOrder} = CustomerOrders?CustomerOrders:{};
		let data = CustomerOrder? CustomerOrder.map(order=>{order.OrderDate = new Date(order.OrderDate); return order;}):[];
		let {primaryKey,changeToCardAt,cardLabelWidth,columns} = this.state;
		return (
			<CsGrid
				primaryKey={primaryKey} 
				changeToCardAt={changeToCardAt}
				cardLabelWidth={cardLabelWidth}
				columns={columns}
				loading ={customerOrderFetching}
				fetchMore={fetchMoreCustomerOrder}
				hasMore={hasMore}
				page={page}
				pageSize={pageSize}
				data={data}
			/>
			);
	}	
}

export default compose(
		customerOrderFetchQuery
	)(Grid);

