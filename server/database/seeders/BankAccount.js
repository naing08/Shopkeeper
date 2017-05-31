const models = require ('../../models/index');
module.exports={
    up:(queryInterface,Sequelize)=>{
        return queryInterface.sequelize.transaction(t=>{
			let promise=[
				models.BankAccount.create({Name:'KBZ Bank',AccountNo:'1234568977'},{fields:['Name','AccountNo'],transaction:t}),
				models.BankAccount.create({Name:'AYA Bank',AccountNo:'6541277554'},{fields:['Name','AccountNo'],transaction:t}),
				models.BankAccount.create({Name:'CB Bank',AccountNo:'5745555796'},{fields:['Name','AccountNo'],transaction:t})
			];
			return Promise.all(promise);
		});
    },
    down:(queryInterface,Sequelize)=>{
        return models.BankAccount.destroy({truncate:true,cascade:true});
    }
};
