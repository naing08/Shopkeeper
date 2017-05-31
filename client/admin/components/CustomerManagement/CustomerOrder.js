import React from 'react';
import {compose} from  'react-apollo';
import orderByCustomerIdQuery from '../../apollo/CustomerOrder';
import CustomerOrderCard from './CustomerOrderCard';
import FlatButton from 'material-ui/FlatButton';
import DataTypes from '../../../common/Grid/filtering/DataTypes';
import Grid from '../../../common/Grid/index';
class CustomerOrder extends React.Component{

	constructor(){
		super(...arguments);
		this.state={
			columns:[
				{key:"OrderNo",caption:"Order No",dataType:DataTypes.TypeString,filter:null,width:100},
				{key:"OrderDate", caption:"Date", dataType:DataTypes.TypeDate,format:'shortDate',width:100},
				{key:"ShipToName",caption:"Name",dataType:DataTypes.TypeString,width:100},
				{key:'Region',caption:'Region',dataType:DataTypes.TypeString,width:100},
				{key:'Township',caption:'Township',dataType:DataTypes.TypeString,width:100},
				{key:'TotalAmount',caption:'Amount',dataType:DataTypes.TypeNumber,width:100}
			]
			
		};
	}

	loadData(request,columns){
		let {fetchOrdersByCustomerId,customerId} = this.props;
		let {pagination:{pageSize,currentPage},order} = request;
		fetchOrdersByCustomerId({customerId,pagination:{pageSize,currentPage},orderBy:order}).then(result=>{
			if(columns)
				this.setState({columns});
		})
	}

	render(){
		let {loading,CustomerOrders} = this.props;
		let {columns} = this.state;
		let {pagination,CustomerOrder} = CustomerOrders? CustomerOrders:{};
		CustomerOrder = CustomerOrder? CustomerOrder.map(({id,OrderNo,OrderDate,ShipToName,ShipToRegion,ShipToTownship,TotalAmount})=>({id,OrderNo,OrderDate,ShipToName,Region:ShipToRegion.Name1,Township:ShipToTownship.Name1,TotalAmount})) :[];
		return (
			<div >
				<Grid
					pagination={pagination}
					columns={columns}
					data={CustomerOrder}
					fixedHeader={true}
					onRequestDataLoad={this.loadData.bind(this)} 
				/>
			</div>
			);
	}
}



const TheComponent = compose(
		orderByCustomerIdQuery
	)(CustomerOrder);

export default  (props)=>{
	let pagination = {currentPage:1,pageSize:10};
	return (<TheComponent {...props} criteria={{pagination,orderBy:[["OrderNo"]]}}/>)
};

