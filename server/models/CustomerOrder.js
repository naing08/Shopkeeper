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
		},
		ShipToName:{
			type:DataTypes.STRING(50),
			allowNull:false,
			validate:{
				notEmpty:{
					msg:'Name is required.'
				},
				len:{
					args:[[0,50]],
					msg:'Need to be less than 50 chars long.'
				}
			}
		},
		ShipToPhoneNo:{
			type:DataTypes.STRING(20),
			allowNull:false,
			validate:{
				notEmpty:{
					msg:'Phone no is required.'
				},
				len:{
					args:[[0,20]],
					msg:'Need to be less than 20 chars long.'
				}
			}
		},
		ShipToEmail:{
			type:DataTypes.STRING(50),
			allowNull:true,
			validate:{
				len:{
					args:[[0,50]],
					msg:'Need to be less than 50 chars long.'
				}
			}
		},
		ShipToAddress:{
			type:DataTypes.STRING(500),
			allowNull:false,
			validate:{
				len:{
					args:[[0,500]],
					msg:'Need to be less than 500 chars long.'
				},
				notEmpty:{
					msg:'Ship to address is required.'
				}
			}
		}
		},{
		classMethods:{
			associate:(models)=>{
				models.Customer.hasMany(CustomerOrder);
				CustomerOrder.belongsTo(models.Customer);
				CustomerOrder.belongsTo(models.Township,{as:'ShipToTownship'});
			}
		}
	});	
	return CustomerOrder;
};