import db from '../models/index';
import {property} from 'lodash';
import PaginationHelper from '../database/PaginationHelper';
import cloudinary from '../cloudinary';

export const type = `
type Customer{
	id:Int!
    FullName:String!
    UserAccountId:Int
    UserName:String
    PhoneNo:String
    Email:String
    Region:String
    Township:String
    Address:String
    IsConfirmedPhoneNo:Boolean
    IsConfirmedEmail:Boolean
    IsModerated:Boolean
    updatedAt:DateTime!
    createdAt:DateTime!
    deletedAt:DateTime
    Photo:String
    PhotoFormat:String
    PhotoUrl:String
    ThumbnailUrl:String
}

type Customers{
	page:Int!
    pageSize:Int!
    totalRows:Int!
    hasMore:Boolean!
    Customer:[Customer]
}

type CustomerMutationResult{
	instance:Customer
	errors:[error]
}
`;

export const query = `
	Customer(page:Int!,pageSize:Int!,search:String):Customers
	CustomerById(id:Int!):Customer
`;

export const mutation=`
	Customer(id:Int,FullName:String!,Photo:String,PhotoFormat:String,PhoneNo:String,Email:String,Region:String,Township:String,Address:String):CustomerMutationResult
`;

export const resolver = {
	type:{
		Customer:{
		  id:property("id"),
	      FullName:property('FullName'),
	      UserAccountId:property('UserAccountId'),
	      UserName:(user)=>(user.getUserAccount().then(account=>(account? account.UserName:null))),
	      updatedAt:property('updatedAt'),
	      createdAt:property('createdAt'),
	      deletedAt:(user)=>(user.getUserAccount().then(account=>(account? account.deletedAt:null))),
	      Photo:property('Photo'),
	      PhotoUrl:(user)=>(user.Photo? cloudinary.url(user.Photo): null),
	      ThumbnailUrl:(user)=>(user.Photo? cloudinary.url(user.Photo): `/img/letter/letter_${user.FullName[0]}.png`),
	      PhotoFormat:property('PhotoFormat'),
	      PhoneNo:property('PhoneNo'),
	      Email:property('Email'),
	      Region:property('Region'),
	      Township:property('Township'),
	      Address:property('Address'),
	      IsConfirmedEmail:property('IsConfirmedEmail'),
	      IsConfirmedPhoneNo:property('IsConfirmedPhoneNo'),
	      IsModerated:property('IsModerated')
		}
	},
	query:{
		Customer(_,{page,pageSize,search},context){
			search = search? `%${search}%`: '%';
          const where = {
              $or:search ==='%'?true:{
                '$UserAccount.UserName$':{
                    $like:search
                },
                  FullName:{
                    $like:search
                  }
              }
          };
          return PaginationHelper.getResult({db,baseQuery:db.Customer,page,pageSize,where,listKey:'Customer',paranoid:true,include:[{model:db.UserAccount,as:'UserAccount',attributes:[],paranoid:true}]});
		},
		CustomerById(_,{id}){
			return db.Customer.findById(id);
		}
	},
	mutation:{
		Customer(_,{id,FullName,Photo,PhotoFormat,PhoneNo,Email,Region,Township,Address}){
			Email = Email? Email:null;
			return db.sequelize.transaction(t=>{
	          return db.Customer.findOrCreate({where:{id},defaults:{FullName,Photo,PhotoFormat,PhoneNo,Email,Region,Township,Address},transaction:t})
	          .spread((instance,created)=>{
	              if(created)
	                return cloudinary.moderateImage(Photo).then(()=>({instance}));
	              else
	                return instance.update({FullName,Photo,PhotoFormat,PhoneNo,Email,Region,Township,Address},{transaction:t,fields:['FullName','Photo','PhotoFormat','PhoneNo','Email','Region','Township','Address']})
	                    .then((instance)=>{
	                      return cloudinary.moderateImage(Photo).then(()=>({instance}));
	                    });
	          })
	        }).catch((error)=>{
	        	if(error.errors)
                	return new Promise((resolve)=>{resolve({instance:null,errors:error.errors.map(e=>({key:e.path,message:e.message}))});});
                else
                	return error;
            });
		}
	}
};