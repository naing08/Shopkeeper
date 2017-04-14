/**
 * Created by ChitSwe on 2/27/17.
 */
module.exports = (sequelize,DataTypes)=>{
  var Privilege = sequelize.define('Privilege',{
      Alias:{
          type:DataTypes.STRING(20),
          allowNull:false
      },
      Name:{
          type:DataTypes.STRING(50)
      }
  });
  return Privilege;
};