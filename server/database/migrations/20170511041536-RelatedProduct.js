'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable("RelatedProduct",{
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
      ProductId:{
        type:Sequelize.INTEGER,
          references:{
          model:'Product',
          key:'id'
        }
      },
      RelatedProductId:{
        type:Sequelize.INTEGER,
        references:{
          model:'Product',
          key:'id'
        }
      }
    })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable("RelatedProduct");
  }
};
