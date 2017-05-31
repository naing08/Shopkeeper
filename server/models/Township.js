module.exports=(sequelize,DataTypes)=>{
	var Township = sequelize.define('Township',{
		Name1:{
			type:DataTypes.STRING(50),
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'Name1 is required'
                },
                len:{
                    args:[[0,50]],
                    msg:'Need to be less than 50 chars long.'
                }
            }
		},
		Name2:{
			type:DataTypes.STRING(50),
            allowNull:true,
            validate:{
                len:{
                    args:[[0,50]],
                    msg:'Need to be less than 50 chars long.'
                }
            }
		}
	},{
        classMethods:{
            associate:models=>{
                models.Region.hasMany(Township);
                Township.belongsTo(models.Region);
            }
        }
    });
	return Township;
};