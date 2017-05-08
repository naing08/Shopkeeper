module.exports=(sequelize,DataTypes)=>{
	var CustomerOrderDetail = sequelize.define('CustomerOrderDetail',{
		Qty:{
			type:DataTypes.INTEGER,
			allowNull:false,
			validate:{
				notEmpty:{
					msg:'Qty is required'
				},
				min:{
					args:[1],
					msg:'Qty need to be greater than 0'
				}
			}
		},
		Price:{
			type:DataTypes.DECIMAL(10,4),
			allowNull:false,
			validate:{
				notEmpty:{
					msg:'Price is required'
				},
				min:{
					args:[0],
					msg:'Price cannot be negative number'
				}
			}
		}
	},{
		classMethods:{
			associate:(models)=>{
				models.CustomerOrder.hasMany(CustomerOrderDetail);
				CustomerOrderDetail.belongsTo(models.CustomerOrder);

				models.Product.hasMany(CustomerOrderDetail);
				CustomerOrderDetail.belongsTo(models.Product);
			}
		}
	});	
	return CustomerOrderDetail;
};