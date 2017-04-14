'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION PathToProductGroup(groupId INT)
      RETURNS TABLE (
          id INT,
          Alias VARCHAR(50),
          Name VARCHAR(100),
          Photo VARCHAR(255),
          PhotoFormat VARCHAR(10),
          createdAt TIMESTAMP WITH TIME ZONE,
          updatedAt TIMESTAMP WITH TIME ZONE,
          deletedAt TIMESTAMP WITH TIME ZONE,
          ParentGroupId INT
      )
      AS
      $BODY$
      BEGIN
      RETURN QUERY
      WITH RECURSIVE Parents AS (
          SELECT * FROM "ProductGroup" WHERE "ProductGroup"."id"= groupId	UNION ALL
      SELECT "ProductGroup".* FROM "ProductGroup" JOIN Parents ON Parents."ParentGroupId"="ProductGroup"."id"
      )

      SELECT * FROM Parents;
      END;$BODY$
      LANGUAGE plpgsql`);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS PathToProductGroup(groupId INT);`);
  }
};
