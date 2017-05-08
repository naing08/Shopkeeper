const models = require('../../models/index');

const seeder={
	dateValuedId:()=>{
		let thedate = new Date();
		let value = thedate.getFullYear();
		value += thedate.getMonth() + 1;
		value += thedate.getDate();
		value += thedate.getHours();
		value += thedate.getMinutes();
		value += thedate.getSeconds();
		value += thedate.getMilliseconds();
		return value;
	},
	customerOrderDetail:(t,order)=>{
		return models.Product.findAll({limit:10}).then(products=>{
			let promises =  products.map(p=>{
				return order.createCustomerOrderDetail({Qty:1,ProductId:p.id,Price:p.Price},{fields:['Qty','ProductId','Price'],transaction:t});
			});
			return Promise.all(promises);
		});
	},
	customerOrder:t=>{
		return  models.Customer.findAll({limit:3,transaction:t})
		.then(customers=>{
			let promises= customers.map(c=>{
				return models.CustomerOrder.create({OrderDate:new Date(),OrderNo:seeder.dateValuedId(),CustomerId:c.id},{fields:['OrderDate','OrderNo','CustomerId'],transaction:t})
					.then(order=>{
						return seeder.customerOrderDetail(t,order);
					}).catch(e=>{console.log(e);	})
			});
			return Promise.all(promises);
		});
	},
	up:(queryInterface,Sequelize)=>{
		return queryInterface.sequelize.transaction(t=>{
			let result =  seeder.customerOrder(t);
			console.log(result);
			return result;
		});
	},
	down:(queryInterface,Sequelize)=>{
		return queryInterface.sequelize.transaction(t=>{
			return models.CustomerOrderDetail.destroy({transaction:t,where:{}}).then(()=>{
				return models.CustomerOrder.destroy({transaction:t,where:{}});
			});
		});
	}
};

module.exports  = seeder;