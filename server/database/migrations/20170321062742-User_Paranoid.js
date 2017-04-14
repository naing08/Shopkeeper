
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('UserAccount','deletedAt',{
      type:Sequelize.DATE
    });
    queryInterface.addColumn('User','Photo',{
      type:Sequelize.STRING
    });
    queryInterface.addColumn('User','PhotoFormat',{
      type:Sequelize.STRING(10)
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.removeColumn('UserAccount','deletedAt');
    queryInterface.removeColumn('User','Photo');
    queryInterface.removeColumn('User','PhotoFormat');
  }
};
