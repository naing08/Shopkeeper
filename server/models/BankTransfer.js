module.exports=(sequelize,DataTypes)=>{
	var BankTransfer = sequelize.define('BankTransfer',{
		TransferDate:{
			type:DataTypes.DATEONLY,
			allowNull:false,
			validate:{
				notEmpty:{
					msg:'Date is required.'
				}
			}
		},
		Remark:{
			type:DataTypes.STRING(500),
			validate:{
				len:{
					args:[[0,500]],
					msg:'Need to be less than 500 chars'
				}
			}
		},
		Attachment:{
			type:DataTypes.STRING(50)
		}
	},{
		classMethods:{
			associate:(models)=>{
				models.BankTransfer.belongsToMany(models.CustomerOrder,{through:'BankTransferForCO'});
				models.CustomerOrder.belongsToMany(models.BankTransfer,{through:'BankTransferForCO'});
				models.BankTransfer.belongsTo(models.BankAccount);
				models.BankAccount.hasMany(models.BankTransfer);
			}
		}
	});
	return BankTransfer;
};