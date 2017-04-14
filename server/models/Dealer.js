/**
 * Created by ChitSwe on 2/27/17.
 */
module.exports=(sequelize,DataTypes)=>{
    var Dealer=sequelize.define('Dealer',{
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
        }
    });
    return Dealer;
};