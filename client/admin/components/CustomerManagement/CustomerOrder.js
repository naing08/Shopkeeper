import React from 'react';
import {compose} from  'react-apollo';
import orderByCustomerIdQuery from '../../apollo/CustomerOrder';
import CustomerOrderCard from './CustomerOrderCard';
import FlatButton from 'material-ui/FlatButton';

class CustomerOrder extends React.Component{

	render(){
		let {loading,CustomerOrders,fetchMoreOrdersByCustomerId} = this.props;
		let {page,pageSize,totalRows,hasMore,CustomerOrder} = CustomerOrders? CustomerOrders:{};
		return (
			<div >
				<div className="row">
					{
						CustomerOrder? 
						CustomerOrder.map((order)=>{
							order.OrderDate = new Date(order.OrderDate);
							return (<CustomerOrderCard key={order.id} {...order}/>);
						})
						:
						null
					}
				</div>
				<div style={{justifyContent:'center',alignItems:'center'}} className="row">
						{hasMore? <FlatButton style={{margin:'0 auto'}} label="More" onClick={()=>{fetchMoreOrdersByCustomerId(page+1);}}/>:null}
				</div>
			</div>
			);
	}
}

export default compose(
		orderByCustomerIdQuery
	)(CustomerOrder);