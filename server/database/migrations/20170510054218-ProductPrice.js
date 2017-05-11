
const models = require('../../models/index');
module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('PriceBook',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE,
      Name:{
        type: Sequelize.STRING(50),
        allowNull:false
      }
    });
    queryInterface.createTable('ProductPrice',{
      id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE,
      ProductId:{
        type:Sequelize.INTEGER,
        references:{
          model:'Product',
          key:'id',
          onUpdate:'CASCADE',
          onDelete:'CASCADE'
        }
      },
      PriceBookId:{
        type:Sequelize.INTEGER,
        references:{
          model:'PriceBook',
          key:'id',
          onUpdate:'CASCADE',
          onDelete:'CASCADE'
        }
      },
      Price:Sequelize.DECIMAL(14,2)
    });

    return models.PriceBook.create({Name:'Default'}).then(pricebook=>{
      return queryInterface.sequelize.query(`INSERT INTO "ProductPrice"("createdAt","updatedAt","ProductId","PriceBookId","Price") SELECT CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,"id" , ${pricebook.id} AS PriceBookId,"Price"  FROM "Product"`);
    });

  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('ProductPrice');
    queryInterface.dropTable('PriceBook');
  }
};
