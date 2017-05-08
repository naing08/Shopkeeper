import React from 'react';
import CustomerOrderDetail from './CustomerOrderDetail';
class CustomerOrderDetailGrid extends React.Component{
	render(){
		let {CustomerOrderById} = this.props;
		let {OrderDetail} = CustomerOrderById? CustomerOrderById:{};
		return (
			<div className="row">
				{
					OrderDetail? OrderDetail.map(detail=>(<CustomerOrderDetail OrderDetail={detail} key={detail.id}/>)) : null
				}
			</div>
			)
	}
}

export default CustomerOrderDetailGrid;