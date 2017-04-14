/**
 * Created by ChitSwe on 3/2/17.
 */
const models = require ('../../models/index');
module.exports={
    up:(queryInterface,Sequelize)=>{

        return queryInterface.sequelize.transaction(t=>{
            return models.UserAccount.create({
                UserName:'Administrator'
            },{
                fields:['UserName'],
                transaction:t
            }).then(userAccount=>{
                return userAccount.createUser({
                    FullName: 'Administrator',
                },{fields:['FullName'],transaction:t});
            });
        });

    },
    down:(queryInterface,Sequelize)=>{
        return models.UserAccount.destroy({truncate:true,cascade:true});
    }
};