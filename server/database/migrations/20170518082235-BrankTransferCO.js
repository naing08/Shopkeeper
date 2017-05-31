'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable("BankTransferForCO",{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      BankTransferId:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'BankTransfer',
          key:'id'
        }
      },
      CustomerOrderId:{
        type:Sequelize.INTEGER,
        allowNull:false ,
        references:{
          model:"CustomerOrder",
          key:'id'
        }
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable("BankTransferForCO");
  }
};
