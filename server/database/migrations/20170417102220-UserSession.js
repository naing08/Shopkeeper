'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('UserSession',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
       createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      UserAccountId:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      SessionKey:{
        type:Sequelize.STRING(100),
        allowNull:false
      },
      ExpiredIn:{
        type:Sequelize.INTEGER
      },
      Counter:{
        type:Sequelize.INTEGER,
        allowNull:false,
        defaultValue:0
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable("UserSession");
  }
};
