module.exports = (sequelize,DataTypes)=>{
	var PriceBook = sequelize.define('PriceBook',{
		Name:{
			type:DataTypes.STRING(50),
			allowNull:false,
			validate:{
                notEmpty:{
                    msg:'Full Name is required'
                },
                len:{
                    args:[[0,50]],
                    msg:'Need to be less than 50 chars long.'
                }
            }
		}
	});
	return PriceBook;
}