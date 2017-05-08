import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {fragments as userFragments} from './User';
import {fragments as customerFragments} from './Customer';
import {default as immutableUpdate} from 'react-addons-update';

const fragments ={
	UserAccount:`
		fragment UserAccountItem on UserAccount{
			id
			UserName
			createdAt
			updatedAt
			deletedAt
		}
	`
}

const REACTIVATE_MUTATION = gql`
	mutation reactivateUserAccount($id:Int!){
		reactivated:reactivateUserAccount(id:$id){
			UserAccount{
				...UserAccountItem
			}
			User{
				...UserItem
			}
			Customer{
				...CustomerItem
			}
		}
	}
	${fragments.UserAccount}
	${userFragments.User}
	${customerFragments.Customer}
`;

function updateCustomerQuery(prev,userAccountMutationResult){
	if(!userAccountMutationResult)
		return prev;
	let {UserAccount,Customer} = userAccountMutationResult;
	if(!Customer)
		return prev;
	let {UserName,deletedAt} = UserAccount;
	let UserAccountId = UserAccount.id;
	let {id} = Customer;
    let  index = null;
    prev.Customers.Customer.every((c,i)=>{
        if(c.id === id){
            index = i;
            return false;
        }else
            return true;
    });
    UserName = deletedAt? '': UserName;
    return index != null ? immutableUpdate (prev,{
        Customers:{
            Customer:{
                [index]:{
                    $set:Object.assign({},prev.Customers.Customer[index],{UserName,deletedAt,UserAccountId})
                }
            }
        }
    }):prev;
}

function updateUserQuery(prev,userAccountMutationResult){
	if(!userAccountMutationResult)
		return prev;
	let {UserAccount,User} = userAccountMutationResult;
	if(!User)
		return prev;
	let {UserName,deletedAt} = UserAccount;
	let UserAccountId = UserAccount.id;
	let {id} = User;
    let  index = null;
    prev.Users.User.every((u,i)=>{
        if(u.id === id){
            index = i;
            return false;
        }else
            return true;
    });
    UserName = deletedAt? '': UserName;
    return index != null ? immutableUpdate (prev,{
        Users:{
            User:{
                [index]:{
                    $set:Object.assign({},prev.Users.User[index],{UserName,deletedAt,UserAccountId})
                }
            }
        }
    }):prev;
}
const reactivateUserAccountMutation = graphql(REACTIVATE_MUTATION,{
	props({ownProps,mutate}){
		return {
			reactivateUserAccount(id){
				return mutate({
					variables:{id},
					updateQueries:{
						userQuery:(prev,{mutationResult})=>{
							return updateUserQuery(prev,mutationResult.data.reactivated);
						},
						customerQuery:(prev,{mutationResult})=>{
							return updateCustomerQuery(prev,mutationResult.data.reactivated);
						}
					}
				});
			}
		};
	}
});

const DEACTIVE_USER_ACCOUNT = gql`
	mutation deactiveUserAccount($id:Int!){
		deactivated:deactivateUserAccount(id:$id){
			UserAccount{
				...UserAccountItem
			}
			User{
				...UserItem
			}
			Customer{
				...CustomerItem
			}
		}
	}
	${fragments.UserAccount}
	${userFragments.User}
	${customerFragments.Customer}
`;

const deactivateUserAccountMutation=graphql(DEACTIVE_USER_ACCOUNT,{
	props({ownProps,mutate}){
		return {
			deactivateUserAccount(id){
				return mutate({
					variables:{id},
					updateQueries:{
						userQuery:(prev,{mutationResult})=>{
							return updateUserQuery(prev,mutationResult.data.deactivated);
						},
						customerQuery:(prev,{mutationResult})=>{
							return updateCustomerQuery(prev,mutationResult.data.deactivated);
						}
					}
				})
			}
		};
	}
});

const SAVE_USER_ACCOUNT = gql`
	mutation saveUserAccount($id:Int,$UserName:String!,$EntityId:Int!,$EntityType:String!){
		saveUserAccount(id:$id,UserName:$UserName,EntityId:$EntityId,EntityType:$EntityType){
			UserAccount{
				...UserAccountItem
			}
			User{
				...UserItem
			}
			Customer{
				...CustomerItem
			}
		}
	}
	${fragments.UserAccount}
	${userFragments.User}
	${customerFragments.Customer}
`;

const saveUserAccountMutation=graphql(SAVE_USER_ACCOUNT,{
	props({ownProps,mutate}){
		return {
			saveUserAccount({id,UserName,EntityId,EntityType}){
				return mutate({
					variables:{id,UserName,EntityId,EntityType},
					updateQueries:{
						userQuery:(prev,{mutationResult})=>{
							return updateUserQuery(prev,mutationResult.data.saveUserAccount);
						},
						customerQuery:(prev,{mutationResult})=>{
							return updateCustomerQuery(prev,mutationResult.data.saveUserAccount);
						}
					}
				});
			}
		};
	}
});

const SAVE_PASSWORD_QUERY = gql`
	mutation savePassword($id:Int,$UserName:String!,$EntityId:Int!,$EntityType:String!,$Password:String,$OldPassword:String){
		savePassword(id:$id,UserName:$UserName,EntityId:$EntityId,EntityType:$EntityType,Password:$Password,OldPassword:$OldPassword){
			UserAccount{
				...UserAccountItem
			}
			User{
				...UserItem
			}
			Customer{
				...CustomerItem
			}
		}
	}
	${fragments.UserAccount}
	${userFragments.User}
	${customerFragments.Customer}
`;

const savePasswordMutation=graphql(SAVE_PASSWORD_QUERY,{
	props({ownProps,mutate}){
		return {
			savePassword({id,UserName,EntityId,EntityType,Password,OldPassword}){
				return mutate({
					variables:{id,UserName,Password,OldPassword,EntityId,EntityType},
					updateQueries:{
						userQuery:(prev,{mutationResult})=>{
							return updateUserQuery(prev,mutationResult.data.savePassword);
						},
						customerQuery:(prev,{mutationResult})=>{
							return updateCustomerQuery(prev,mutationResult.data.savePassword);
						}
					}
				});
			}
		};
	}
});

export {reactivateUserAccountMutation,deactivateUserAccountMutation,saveUserAccountMutation,savePasswordMutation};