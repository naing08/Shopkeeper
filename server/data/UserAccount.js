import db from '../models/index';
import {property} from 'lodash';

export const type=`
    type UserAccount{
        id:Int!
        UserName:String!
        createdAt:DateTime!
        updatedAt:DateTime!
        deletedAt:DateTime
    }

    type UserAccountMutationResult{
        UserAccount:UserAccount!
        User:User  
        Customer:Customer      
    }
`;

export const query=``;

export const mutation=`
reactivateUserAccount(id:Int!):UserAccountMutationResult
deactivateUserAccount(id:Int!):UserAccountMutationResult
saveUserAccount(id:Int,UserName:String!,EntityId:Int!,EntityType:String!):UserAccountMutationResult
savePassword(id:Int,UserName:String!,EntityId:Int!,EntityType:String!,Password:String,OldPassword:String):UserAccountMutationResult
`;

function setUserAccountOnEntity({UserAccountInstance,EntityId,EntityType},transaction){
    switch(EntityType){
        case 'USER':
            return db.User.findById(EntityId,{transaction})
            .then(user=>{
                return user.update({UserAccountId:UserAccountInstance.id},{fields:['UserAccountId'],transaction})
                .then(user=>{
                    return {
                            UserAccount:UserAccountInstance,
                            User:user
                        };
                });
            });
            break;
        case 'CUSTOMER':
            return db.Customer.findById(EntityId,{transaction})
            .then(customer=>{
                return customer.update({UserAccountId:UserAccountInstance.id},{fields:['UserAccountId'],transaction})
                .then(customer=>{
                    return {
                        UserAccount:UserAccountInstance,
                        Customer:customer
                    };
                });
            });
            break;
        default:
            return Promise.reject('Entity type is invalid.'); 
    }
}

export const resolver={
    type:{},
    query:{},
    mutation:{
        reactivateUserAccount(_,{id}){
            return db.sequelize.transaction((t)=>{
                    return db.UserAccount.update({deletedAt:null},{paranoid:false,where:{id:id},returning:true,fields:['deletedAt']})
                        .spread((rowsUpdated,instanceRows)=>{
                            if(rowsUpdated>0){
                                let userAccount =  instanceRows[0];
                                return userAccount.getUser({transaction:t}).then((user)=>{
                                    return userAccount.getCustomer({transaction:t}).then(customer=>(
                                        {
                                            UserAccount:userAccount,
                                            User:user,
                                            Customer:customer
                                        }
                                        ));
                                });
                            }
                            else
                                return null;
                        });
                });
        },
        deactivateUserAccount(_,{id}){
            return db.sequelize.transaction(t=>{
                return db.UserAccount.destroy({where:{id},transaction:t})
                .then((rowsDeleted)=>{
                    if(rowsDeleted>0)
                        return db.UserAccount.findById(id,{paranoid:false,transaction:t})
                            .then(userAccount=>{
                                return userAccount.getUser({transaction:t}).then((user)=>{
                                    return userAccount.getCustomer({transaction:t}).then(customer=>(
                                        {
                                            UserAccount:userAccount,
                                            User:user,
                                            Customer:customer
                                        }
                                        ));
                                });
                            });
                    else
                        return null;

                });
            });
        },
        saveUserAccount(_,{id,UserName,EntityId,EntityType}){
            return db.sequelize.transaction(t=>{
                return db.UserAccount.findOrCreate({where:{id},defaults:{UserName},transaction:t})
                .spread((instance,created)=>{
                    let promise = null;
                    if(created){
                        promise = new Promise((res,rej)=>{res(instance);});
                    }else{
                        promise = instance.update({UserName},{fields:['UserName'],transaction:t});
                    }
                    return promise.then((instance)=>{
                        return setUserAccountOnEntity({UserAccountInstance:instance,EntityId,EntityType},t);
                    });
                });
            });
        },
        savePassword(_,{id,UserName,EntityId,EntityType,Password,OldPassword}){
            console.log('saving password');
            return db.sequelize.transaction(t=>{
                return db.UserAccount.findOrCreate({where:{id},defaults:{UserName,Password},transaction:t})
                .spread((instance,created)=>{
                    let promise = null;
                    if(created){
                        promise = new Promise((res,rej)=>{res(instance);});
                    }else{
                        promise = instance.update({UserName,Password},{fields:['UserName','Password'],transaction:t});
                    }
                    return promise.then((instance)=>{
                        return setUserAccountOnEntity({UserAccountInstance:instance,EntityId,EntityType},t);
                    });
                });
            }).catch((error)=>{
                if(error.errors)
                    return new Promise((resolve)=>{resolve({instance:null,errors:error.errors.map(e=>({key:e.path,message:e.message}))});});
                else
                    return error;
            });
        }
    }
}
