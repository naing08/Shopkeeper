import React from 'react';
import ItemCard from './ItemCard';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {customerOrderFetchQuery} from '../../apollo/CustomerOrder';
import AppBar from './AppBar';
class CustomerOrder extends React.Component{
	render(){
		let {CustomerOrders,customerOrderFetching,fetchMoreCustomerOrder} = this.props;
		let {page,pageSize,hasMore,CustomerOrder} = CustomerOrders?CustomerOrders:{};
		return (
			<div className="layout fullheight">
				<AppBar title="Orders"/>
				<div className="row scrollable">
					{
						CustomerOrder? CustomerOrder.map(order=>{
							order.OrderDate = new Date(order.OrderDate);
							order.createdAt=new Date(order.createdAt);
							return (<ItemCard order={order} key={order.OrderNo}/>);
						}) : null
					}
				</div>
			</div>
			)
	}
}

export default compose(
		customerOrderFetchQuery
	)(CustomerOrder);