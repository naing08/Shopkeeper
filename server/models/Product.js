/**
 * Created by ChitSwe on 1/2/17.
 */
module.exports=(sequelize,DataTypes)=>{
    var Product=sequelize.define('Product',{
        Alias:{
            type: DataTypes.STRING(50),
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'Alias is required'
                },
                len:{
                    args:[[0,50]],
                    msg:'Need to be less than 50 char.'
                }
            }
        },
        Name:{
            type:DataTypes.STRING(100),
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'Name is required'
                },
                len:{
                    args:[[0,100]],
                    msg:'Need to be less than 100 char.'
                }
            }
        },
        Price:DataTypes.DECIMAL(10,4),
        Description:DataTypes.TEXT

    },{
        classMethods:{
            associate:(models)=>{
                Product.belongsTo(models.ProductGroup);
                models.ProductGroup.hasMany(Product);
                Product.hasMany(models.ProductPhoto);
                Product.belongsTo(models.ProductPhoto,{as:"DefaultPhoto",constraints:false});
                Product.belongsTo(models.ProductPhoto,{as:"Thumbnail", constraints:false});
                Product.belongsTo(models.ProductBrand);
                Product.hasMany(models.ProductSpecification);
            }
        }
    });
    return Product;
}