'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn("CustomerOrder","ShipToName",{
      type:Sequelize.STRING(50),
      allowNull:false
    });
    queryInterface.addColumn("CustomerOrder","ShipToPhoneNo",{
      type:Sequelize.STRING(20),
      allowNull:false
    });
    queryInterface.addColumn("CustomerOrder","ShipToEmail",{
      type:Sequelize.STRING(50)
    });
    queryInterface.addColumn("CustomerOrder","ShipToAddress",{
      type:Sequelize.STRING(500)
    });
    queryInterface.addColumn("CustomerOrder","ShipToTownshipId",{
      type:Sequelize.INTEGER,
      allowNull:false,
      references:{
        model:"Township",
        key:"id"
      }
    });

    queryInterface.createTable("BankTransfer",{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE,
      TransferDate:{
        type:Sequelize.DATEONLY,
        allowNull:false
      },
      Remark:{
        type:Sequelize.STRING(500)
      },
      Attachment:{
        type:Sequelize.STRING(50),
        allowNull:false
      },
      BankAccountId:{
        type:Sequelize.INTEGER,
        references:{
          model:'BankAccount',
          key:'id'
        }
      }
    });
    
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn("CustomerOrder","ShipToName");
    queryInterface.removeColumn("CustomerOrder","ShipToPhoneNo");
    queryInterface.removeColumn("CustomerOrder","ShipToEmail");
    queryInterface.removeColumn("CustomerOrder","ShipToAddress");
    queryInterface.removeColumn("CustomerOrder","ShipToTownshipId");
    queryInterface.dropTable("BankTransfer");
  }
};
