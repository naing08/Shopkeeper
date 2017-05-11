module.exports= (sequelize,DataTypes)=>{
	var ProductPrice = sequelize.define('ProductPrice',{
		Price:{
			type:DataTypes.DECIMAL(14,2),
			allowNull:false,
			validate:{
				notEmpty:{
					msg:'Price is required'
				},
				min:{
					args:[0],
					msg:'Must be non-negative number.'
				}
			}
		}
	},{
		classMethods:{
			associate:(models)=>{
				models.Product.hasMany(ProductPrice);
				ProductPrice.belongsTo(models.Product);
				models.PriceBook.hasMany(ProductPrice);
				ProductPrice.belongsTo(models.PriceBook);
			}
		}
	});
	return ProductPrice;
}