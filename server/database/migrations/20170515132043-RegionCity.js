'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('Region',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE,
      Name1:{
        type:Sequelize.STRING(50),
        allowNull:false
      },
      Name2:{
        type:Sequelize.STRING(50),
        allowNull:true
      }
    });
    queryInterface.createTable('Township',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE,
      Name1:{
        type:Sequelize.STRING(50),
        allowNull:false
      },
      Name2:{
        type:Sequelize.STRING(50),
        allowNull:true
      },
      RegionId:{
        type:Sequelize.INTEGER,
        references:{
          model:'Region',
          key:'id'
        }
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable("Township");
  }
};
