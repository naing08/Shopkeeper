/**
 * Created by ChitSwe on 1/2/17.
 */
module.exports=(sequelize,DataTypes)=>{
  var ProductSpecification=sequelize.define('ProductSpecification',{
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
      Value:{
          type:DataTypes.STRING(200),
          allowNull:false,
          validate:{
              notEmpty:{
                  msg:'Value is required'
              },
              len:{
                  args:[[0,200]],
                  msg:'Need to be less than 200 char.'
              }
          }
      }
  },{
      classMethods:{
          associate:(models)=>{
              ProductSpecification.belongsTo(models.Product);
          }
      }
  });
  return ProductSpecification;
};