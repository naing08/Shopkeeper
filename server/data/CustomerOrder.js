import db from '../models/index';
import {property} from 'lodash';
import PaginationHelper from '../database/PaginationHelper';

export const type=`
type CustomerOrderDetail{
	id:Int!
	Qty:Int!
	createdAt:DateTime!
	updatedAt:DateTime!
	CustomerOrderId:Int!
	Product:Product!
	Price:Float!
}
type CustomerOrder{
	id:Int!
	OrderDate:Date!
	OrderNo:String!
	createdAt:DateTime!
	updatedAt:DateTime!
	Customer:Customer!
	TotalAmount:Float!
	TotalQty:Int!
	OrderDetail:[CustomerOrderDetail]
}
type CustomerOrders{
	page:Int!
	pageSize:Int!
	totalRows:Int!
	hasMore:Boolean!
	CustomerOrder:[CustomerOrder]
}
input InputCustomerOrderDetail{
	Qty:Int!
	ProductId:Int!
	Price:Float!
}
input InputCustomerOrder{
	CustomerId:Int!
	OrderDetail:[InputCustomerOrderDetail]
}
`;

export const query=`
	CustomerOrder(customerId:Int,pageSize:Int!,page:Int!):CustomerOrders
	CustomerOrderById(id:Int!):CustomerOrder
`;

export const mutation=`
	CustomerOrder(order:InputCustomerOrder):CustomerOrder
`;

export const resolver={
	type:{
		CustomerOrderDetail:{
			id:property("id"),
			Qty:property("Qty"),
			createdAt:property("createdAt"),
			updatedAt:property("updatedAt"),
			CustomerOrderId:property("CustomerOrderId"),
			Product:detail=>{
				return detail.getProduct();
			}
		},
		CustomerOrder:{
			id:property("id"),
			OrderDate:property("OrderDate"),
			OrderNo	:property("OrderNo"),
			createdAt:property("createdAt"),
			updatedAt:property("updatedAt"),
			Customer:order=>{
				return order.getCustomer();
			},
			TotalAmount:order=>{
				return db.CustomerOrderDetail.findAll({raw:true,where:{CustomerOrderId:order.id},attributes:[[db.sequelize.fn('SUM', db.sequelize.literal('"Qty" * "Price"')),'TotalAmount']]})
				.then(result=>(result.length>0? result[0].TotalAmount:0));
			},
			TotalQty:order=>{
				return db.CustomerOrderDetail.findAll({raw:true,where:{CustomerOrderId:order.id},attributes:[[db.sequelize.fn('SUM',db.sequelize.col('Qty')),'TotalQty']]})
				.then(result=>(result.length>0 ? result[0].TotalQty:0));
			},
			OrderDetail:order=>{
				return order.getCustomerOrderDetails();
			}
		}
	},
	query:{
		CustomerOrder:(_,{customerId,pageSize,page})=>{
			page = page? page: 1;
			return PaginationHelper.getResult({db,baseQuery:db.CustomerOrder,page,pageSize,where:{},listKey:'CustomerOrder',paranoid:false});
		},
		CustomerOrderById:(_,{id})=>{
			return db.CustomerOrder.findById(id);
		}
	},
	mutation:{
		CustomerOrder:(_,{order})=>{
			let {CustomerId,OrderDetail} = order;
			return db.sequelize.transaction(t=>{
				return db.CustomerOrder.create({OrderDate:new Date(),OrderNo:'UNIQUE##NUMBER#',CustomerId},{fields:['OrderDate','OrderNo','CustomerId'],transaction:t})
					.then(order=>{
						let promises = OrderDetail.map(({Qty,ProductId,Price})=>(
								order.createCustomerOrderDetail({Qty,ProductId,Price},{fields:['Qty','ProductId','Price'],transaction:t})
							));
						return Promise.all(promises).then(()=>order);
					})
			});
		}
	}
};