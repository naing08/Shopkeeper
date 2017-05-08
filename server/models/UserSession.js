module.exports=(sequelize,DataTypes)=>{
	var UserSession = sequelize.define('UserSession',{
		SessionKey:{
			type:DataTypes.STRING(100),
			allowNull:false
		},
		ExpiredIn:{
			type:DataTypes.INTEGER
		},
		Counter:{
			type:DataTypes.INTEGER,
			allowNull:false
		}
	},{
			classMethods:{
				associate:(models)=>{
                	models.UserAccount.hasMany(UserSession);
					UserSession.belongsTo(models.UserAccount);
				}
			}
		});
	return UserSession;
}