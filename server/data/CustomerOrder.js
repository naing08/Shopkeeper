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
	ShipToTownship:Township!
	ShipToRegion:Region!
	ShipToName:String!
	ShipToPhoneNo:String!
	ShipToEmail:String
	ShipToAddress:String!
	OrderDetail:[CustomerOrderDetail]
}
type CustomerOrders{
	currentPage:Int!
	page:Int!
	pageSize:Int!
	totalRows:Int!
	totalPages:Int!
	hasMore:Boolean!
	CustomerOrder:[CustomerOrder]
}


input InputCustomerOrderDetail{
	Qty:Int!
	ProductId:Int!
	Price:Float!
}
input InputCustomerOrder{
	ShipToTownshipId:Int!
	ShipToName:String!
	ShipToPhoneNo:String!
	ShipToEmail:String
	ShipToAddress:String!
	OrderDetail:[InputCustomerOrderDetail]
	BankTransfer:InputBankTransfer
}

type CustomerOrderMutationResult{
	instance:CustomerOrder
	errors:[error]
	detail:[CustomerOrderDetailMutationResult]
	bankTransfer:BankTransferMutationResult
}

type CustomerOrderDetailMutationResult{
	instance:CustomerOrderDetail
	errors:[error]
}


`;

export const query=`
	CustomerOrderByCustomerId(customerId:Int,criteria:criteria):CustomerOrders
	CustomerOrder(pageSize:Int,page:Int):CustomerOrders
	CustomerOrderById(id:Int!):CustomerOrder
`;

export const mutation=`
	CustomerOrder(order:InputCustomerOrder):CustomerOrderMutationResult
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
			ShipToTownship:order=>{
				return order.getShipToTownship();
			},
			ShipToRegion:order=>{
				return order.getShipToTownship().then(township=>(township.getRegion()));
			},
			ShipToName:property("ShipToName"),
			ShipToPhoneNo:property("ShipToPhoneNo"),
			ShipToEmail:property("ShipToEmail"),
			ShipToAddress:property("ShipToAddress"),
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
		CustomerOrderByCustomerId:(_,{customerId,criteria})=>{
			let {pagination,orderBy} = criteria? criteria:{};
			let {currentPage,pageSize} = pagination? pagination:{currentPage:1,pageSize:10};
			currentPage = currentPage? currentPage: 1;
			let where = true;
			if(customerId)
				where = {CustomerId:customerId};
			return PaginationHelper.getResult({db,baseQuery:db.CustomerOrder,page:currentPage,pageSize,where,listKey:'CustomerOrder',paranoid:false,order:orderBy});
		},
		CustomerOrder(_,{pageSize,page},{user,httpResponse}){
			page=page? page:1;
			pageSize=pageSize? pageSize:5;
			if(!user.isAuthenticated){
				httpResponse.status(401).send("User is not authenticated.");
				return null;
			}
			return user.getCustomer()
			.then(customer=>{
				if(!customer){
					httpResponse.status(403).send("Only customer is allowed");
					return null;
				}
				return PaginationHelper.getResult({db,baseQuery:db.CustomerOrder,page,pageSize,where:{CustomerId:customer.id},listKey:'CustomerOrder',paranoid:false,order:[['createdAt','DESC']]});
			});
			
		},
		CustomerOrderById:(_,{id})=>{
			return db.CustomerOrder.findById(id);
		}
	},
	mutation:{
		CustomerOrder:(_,{order},{user,httpResponse})=>{
			if(!user.isAuthenticated){
				httpResponse.status(401).send("User is not authenticated.");
				return null;
			}

			return user.getCustomer()
			.then(customer=>{
				if(!customer){
					httpResponse.status(403).send("Only customer is allowed.");
					return null;
				}
				let {ShipToName,ShipToPhoneNo,ShipToEmail,ShipToAddress,ShipToTownshipId,OrderDetail,BankTransfer} = order;
				return db.sequelize.transaction(t=>{
					return db.CustomerOrder.create({OrderDate:new Date(),OrderNo:(new Date()).uniqueNumber(),CustomerId:customer.id,ShipToName,ShipToPhoneNo,ShipToEmail,ShipToAddress,ShipToTownshipId},{fields:['OrderDate','OrderNo','CustomerId','ShipToName','ShipToPhoneNo','ShipToEmail','ShipToAddress','ShipToTownshipId'],transaction:t})
						.then(order=>{
							let promises = OrderDetail.map(({Qty,ProductId,Price})=>(
									order.createCustomerOrderDetail({Qty,ProductId,Price},{fields:['Qty','ProductId','Price'],transaction:t})
									.then(detail=>({instance:detail}))
									.catch(error=>{
										if(error.errors)
						                	return new Promise((resolve)=>{resolve({errors:error.errors.map(e=>({key:e.path,message:e.message}))});});
						                else
						                	return error;
									})
								));
							return Promise.all(promises).then(detail=>{
								let {TransferDate,Remark,Attachment} = BankTransfer;
								return order.createBankTransfer({TransferDate,Remark,Attachment},{transaction:t,fields:['TransferDate','Remark','Attachment']})
									.then(bankTransfer=>({instance:bankTransfer}))
									.then(bankTransfer=>({instance:order,detail,bankTransfer}))
									.catch(error=>{
										if(error.errors)
						                	return new Promise((resolve)=>{resolve({bankTransfer:{errors:error.errors.map(e=>({key:e.path,message:e.message}))}});});
						                else
						                	return error;
									});
							});
						}).catch((error)=>{
				        	if(error.errors)
			                	return new Promise((resolve)=>{resolve({errors:error.errors.map(e=>({key:e.path,message:e.message}))});});
			                else
			                	return error;
			            });
				});
			});
		}
	}
};