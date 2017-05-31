const models = require('../../models/index');

const seeder={
	up:(queryInterface,Sequelize)=>{
		return queryInterface.sequelize.transaction(t=>{
			let promises=[
			models.Region.create({Name1:'Yangon'},{fields:['Name1'],transaction:t}).then(region=>{
				return Promise.all([
					region.createTownship({Name1:'Dagon'},{fields:['Name1'],transaction:t}),
					region.createTownship({Name1:'Latha'},{fields:['Name1'],transaction:t}),
					region.createTownship({Name1:'Tamwe'},{fields:['Name1'],transaction:t})
				]);
			}),
			models.Region.create({Name1:'Mandalay'},{fields:['Name1'],transaction:t}).then(region=>{
				return Promise.all([
					region.createTownship({Name1:'Kyauksee'},{fields:['Name1'],transaction:t}),
					region.createTownship({Name1:'Myittha'},{fields:['Name1'],transaction:t}),
					region.createTownship({Name1:'Myingyan'},{fields:['Name1'],transaction:t})
					]);
			}),
			models.Region.create({Name1:'Sagain'},{fields:['Name1'],transaction:t}).then(region=>{
				return Promise.all([
					region.createTownship({Name1:'Sagain'},{fields:['Name1'],transaction:t}),
					region.createTownship({Name1:'Monywa'},{fields:['Name1'],transaction:t}),
					region.createTownship({Name1:'Shwebo'},{fields:['Name1'],transaction:t})
					]);
			})
			];
			return Promise.all(promises);
		});

	},
	down:(queryInterface,Sequelize)=>{
		models.Township.destroy({where:true});
		models.Region.destroy({where:true});
	}
};
module.exports=seeder;