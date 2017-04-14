/**
 * Created by ChitSwe on 2/27/17.
 */
module.exports = (sequelize,DataTypes)=>{
  var User = sequelize.define('User',{
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
      PhotoFormat:DataTypes.STRING(10)

  },{
      classMethods:{
          associate:(models)=>{
              User.belongsToMany(models.Privilege,{through:'UserPrivilege'});
              models.Privilege.belongsToMany(User,{through:'UserPrivilege'});
          }
      }
  });



  return User;
};