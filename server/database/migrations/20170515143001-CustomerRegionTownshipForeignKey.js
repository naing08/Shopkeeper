'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Customer','Region');
    queryInterface.removeColumn('Customer','Township');
    queryInterface.addColumn('Customer', 'TownshipId',{
      type:Sequelize.INTEGER,
      references:{
        model:'Township',
        key:'id'
      }
    });
  },

  down: function (queryInterface, Sequelize) {
      queryInterface.removeColumn('Customer','TownshipId');
      queryInterface.addColumn('Customer', 'Region',{
        type:Sequelize.STRING(50)
      });
      queryInterface.addColumn('Customer', 'Township',{
        type:Sequelize.STRING(50)
      });
  }
};
