'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('Customer','Photo',{
      type:Sequelize.STRING(255)
    });
    queryInterface.addColumn('Customer','PhotoFormat',{
      type:Sequelize.STRING(10)
    });
    queryInterface.addColumn('Customer','PhoneNo',{
      type:Sequelize.STRING(20)
    });
    queryInterface.addColumn('Customer','Email',{
      type:Sequelize.STRING(50)
    });
    queryInterface.addColumn('Customer', 'Region',{
      type:Sequelize.STRING(50)
    });
    queryInterface.addColumn('Customer', 'Township',{
      type:Sequelize.STRING(50)
    });
    queryInterface.addColumn('Customer','Address',{
      type:Sequelize.STRING('500')
    });
    queryInterface.addColumn('Customer', 'IsConfirmedPhoneNo',{
      type:Sequelize.BOOLEAN,
      allowNull:false,
      defaultValue:false
    });
    queryInterface.addColumn('Customer','IsConfirmedEmail',{
      type:Sequelize.BOOLEAN,
      allowNull:false,
      defaultValue:false
    });
    queryInterface.addColumn('Customer','IsModerated',{
      type:Sequelize.BOOLEAN,
      allowNull:false,
      defaultValue:false
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.removeColumn('Customer','Photo');
    queryInterface.removeColumn('Customer','PhotoFormat');
    queryInterface.removeColumn('Customer','PhoneNo');
    queryInterface.removeColumn('Customer','Email');
    queryInterface.removeColumn('Customer','Region');
    queryInterface.removeColumn('Customer', 'Township');
    queryInterface.removeColumn('Customer', 'Address');
    queryInterface.removeColumn('Customer', 'IsConfirmedEmail');
    queryInterface.removeColumn('Customer', 'IsConfirmedPhoneNo');
    queryInterface.removeColumn('Customer', 'IsModerated');
  }
};