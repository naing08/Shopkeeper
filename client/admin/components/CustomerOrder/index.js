import React from 'react';
import CustomerOrder from './CustomerOrder';
import CustomerOrderDetailGrid from './CustomerOrderDetailGrid';
import {customerOrderByIdQuery} from '../../apollo/CustomerOrder';
import {compose} from 'react-apollo';

class CustomerOrderPage extends React.Component{
	render(){
		let {CustomerOrderById} = this.props;
		if(CustomerOrderById)
			CustomerOrderById.OrderDate = new Date(CustomerOrderById.OrderDate);
		return (
			<div className="layout scrollable fullheight">
				<CustomerOrder CustomerOrderById={CustomerOrderById}/>
				<CustomerOrderDetailGrid CustomerOrderById={CustomerOrderById}/>
			</div>
			);
	}
}

const TheComponent =  compose(
		customerOrderByIdQuery
	)(CustomerOrderPage);


export default ({params})=>{
	let {id} = params? params:{};
	return (<TheComponent id={id}/>);
}