/**
 * Created by ChitSwe on 2/27/17.
 */
module.exports=(sequelize,DataTypes)=>{
    var Customer=sequelize.define('Customer',{
        FullName:{
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
        },
        Photo:DataTypes.STRING(255),
        PhotoFormat:DataTypes.STRING(10),
        PhoneNo:{
            type:DataTypes.STRING(20),
            validate:{
                len:{
                    args:[[0,20]],
                    msg:'Need to be less than 20 chars long.'
                }   
            }
        },
        Email:{
            type:DataTypes.STRING(50),
            allowNull:true,
            validate:{
                len:{
                    args:[[0,50]],
                    msg:'Need to be less than 50 chars long.'
                },
                isEmail:{
                    msg:'Email address is invalid.'
                }
            }
        },
        Address:{
            type:DataTypes.STRING(500),
            validate:{
                len:{
                    args:[[0,500]],
                    msg:'Need to be less than 500 chars long.'
                }
            }
        },
        IsConfirmedPhoneNo:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        },
        IsConfirmedEmail:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        },
        IsModerated:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false
        }
    },{
        classMethods:{
            associate:models=>{
                Customer.belongsTo(models.Township);
            }
        }
    });
    return Customer;
};