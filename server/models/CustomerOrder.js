module.exports=(sequelize,DataTypes)=>{
	var CustomerOrder = sequelize.define('CustomerOrder',{
		OrderDate:{
			type:DataTypes.DATEONLY,
			allowNull:false,
			validate:{
                notEmpty:{
                    msg:'Order date is required.'
                }
            }
		},
		OrderNo:{		
			type:DataTypes.STRING(20),
			allowNull:false,
			validate:{
	                notEmpty:{
	                    msg:'Order no  is required.'
	                },
	                len:{
	                    args:[[0,20]],
	                    msg:'Need to be less than 20 chars long.'
	                }
	            }
			}
		},{
		classMethods:{
			associate:(models)=>{
				models.Customer.hasMany(CustomerOrder);
				CustomerOrder.belongsTo(models.Customer);
			}
		}
	});	
	return CustomerOrder;
};