module.exports=(sequelize,DataTypes)=>{
	var BankAccount= sequelize.define('BankAccount',{
		Name:{
			type:DataTypes.STRING(50),
			allowNull:false,
			validate:{
				notEmpty:{
					msg:'Name is required'
				},
				len:{
					args:[[0,50]],
					msg:'Need to be less than 50 characters'
				}
			}
		},
		Description:{
			type:DataTypes.STRING(100),
			allowNull:false,
			validate:{
				len:{
					args:[[0,100]],	
					msg:'Need to be less than 100 characters'
				}
			}
		},
		AccountNo:{
			type:DataTypes.STRING(50),
			allowNull:false,
			validate:{
				len:{
					msg:'Need to be less than 50 characters',
					args:[[0,100]]
				},
				notEmpty:{
					msg:'Account No is required'
				}
			}
		},
		Enabled:{
			type:DataTypes.BOOLEAN,
			allowNull:false
		}
	});
	return BankAccount;
}