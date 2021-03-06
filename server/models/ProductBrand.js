/**
 * Created by ChitSwe on 1/2/17.
 */
module.exports=(sequelize,DataTypes)=>{
    var ProductBrand = sequelize.define("ProductBrand", {
        Alias:{
            type:DataTypes.STRING(50),
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
        Photo:DataTypes.STRING(255),
        PhotoFormat:DataTypes.STRING(10)
    },{
        paranoid:true
    });
    return ProductBrand;
};