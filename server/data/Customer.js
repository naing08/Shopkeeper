import db from '../models/index';
import {property} from 'lodash';
import PaginationHelper from '../database/PaginationHelper';
import cloudinary from '../cloudinary';
import login from '../security/login';
export const type = `
type Customer{
	id:Int!
    FullName:String!
    UserAccountId:Int
    UserName:String
    PhoneNo:String
    Email:String
    Region:Region
    Township:Township
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
	Customer(id:Int,FullName:String!,Photo:String,PhotoFormat:String,PhoneNo:String,Email:String,TownshipId:Int!,Address:String):CustomerMutationResult
	RegisterCustomer(FullName:String!,PhoneNo:String!,Email:String,TownshipId:Int!,UserName:String!,Password:String,Photo:String,PhotoFormat:String,Remember:Boolean!):UserSession
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
	      Region:(customer)=>(customer.getTownship().then(township=>(township.getRegion()))),
	      Township:(customer)=>(customer.getTownship()),
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
		Customer(_,{id,FullName,Photo,PhotoFormat,PhoneNo,Email,TownshipId,Address}){
			Email = Email? Email:null;
			return db.sequelize.transaction(t=>{
	          return db.Customer.findOrCreate({where:{id},defaults:{FullName,Photo,PhotoFormat,PhoneNo,Email,TownshipId,Address},transaction:t})
	          .spread((instance,created)=>{
	              if(created)
	                return cloudinary.moderateImage(Photo).then(()=>({instance}));
	              else
	                return instance.update({FullName,Photo,PhotoFormat,PhoneNo,Email,TownshipId,Address},{transaction:t,fields:['FullName','Photo','PhotoFormat','PhoneNo','Email','TownshipId','Address']})
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
		},
		RegisterCustomer(_,{UserName,Password,FullName,PhoneNo,Email,TownshipId,Address,Photo,PhotoFormat,Remember}){
			return db.sequelize.transaction(t=>{
				return db.Customer.create({FullName,PhoneNo,Email,TownshipId,Photo,PhotoFormat,Address},{transaction:t,fields:['FullName','PhoneNo','Email','TownshipId','Photo','PhotoFormat','Address']})
				.then(instance=>{
					return instance.createUserAccount({UserName,Password},{fields:['UserName','Password'],transaction:t});
				})
			}).then(()=>{
						return login(UserName,Password,Remember).then(result=>{
							if(Photo)
								return cloudinary.moderateImage(Photo).then(()=>result);
							else
								return result;
						});
					});
		}
	}
};