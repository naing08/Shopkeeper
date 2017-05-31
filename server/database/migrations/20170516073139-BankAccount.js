'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('BankAccount',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      Name:{
        type:Sequelize.STRING(50),
        allowNull:false
      },
      Description:{
        type:Sequelize.STRING(100),
        allowNull:true
      },
      AccountNo:{
        type:Sequelize.STRING(50),
        allowNull:false
      },
      Enabled:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:true
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable("BankAccount");
  }
};
