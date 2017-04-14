/**
 * Created by ChitSwe on 2/26/17.
 */
module.exports=(sequelize,DataTypes)=>{
    var UserAccount = sequelize.define('UserAccount',{
        UserName:{
            type:DataTypes.STRING(20),
            allowNull:false,
            validate:{
                notEmpty:{
                    msg:'User Name is required.'
                },
                len:{
                    args:[[0,20]],
                    msg:'Need to be less than 20 chars long.'
                }
            }
        },
        Password:{
            type:DataTypes.STRING(50),
            validate:{
                len:{
                    args:[[0,50]],
                    msg:'Need to be less than 50 chars long.'
                }
            }
        }
    },{
        classMethods:{
            associate:(models)=>{
                UserAccount.hasOne(models.User);//add UserAccountId column to User Table.
                models.User.belongsTo(UserAccount);

                UserAccount.hasOne(models.Dealer);//add UserAccountId column to Dealer Table.
                models.Dealer.belongsTo(models.UserAccount);

                UserAccount.hasOne(models.Customer);
                models.Customer.belongsTo(models.UserAccount);
            }
        },
        paranoid:true
    });
    return UserAccount;
}