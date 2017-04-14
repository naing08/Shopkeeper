/**
 * Created by ChitSwe on 3/6/17.
 */
import db from '../models/index';
import {property} from 'lodash';
import PaginationHelper from '../database/PaginationHelper';
import cloudinary from '../cloudinary';

export const type=`
type User{
    id:Int!
    FullName:String!
    UserAccountId:Int
    UserName:String
    updatedAt:DateTime!
    createdAt:DateTime!
    deletedAt:DateTime
    Photo:String
    PhotoFormat:String
    PhotoUrl:String
    ThumbnailUrl:String
}
type Users{
    page:Int!
    pageSize:Int!
    totalRows:Int!
    hasMore:Boolean!
    User:[User]
}
type UserMutationResult{
  instance:User
  errors:[error]
}
`;

export const query  =`
    User(page:Int!,pageSize:Int!,search:String):Users
    UserById(id:Int!):User
`;

export const mutation = `
  User(id:Int,FullName:String!,Photo:String,PhotoFormat:String):UserMutationResult
`;

export const resolver = {
  type:{
    User:{
      id:property('id'),
      FullName:property('FullName'),
      UserAccountId:property('UserAccountId'),
      UserName:(user)=>(user.getUserAccount().then(account=>(account? account.UserName:null))),
      updatedAt:property('updatedAt'),
      createdAt:property('createdAt'),
      deletedAt:(user)=>(user.getUserAccount().then(account=>(account? account.deletedAt:null))),
      Photo:property('Photo'),
      PhotoUrl:(user)=>(user.Photo? cloudinary.url(user.Photo): null),
      ThumbnailUrl:(user)=>(user.Photo? cloudinary.url(user.Photo): `/img/letter/letter_${user.FullName[0]}.png`),
      PhotoFormat:property('PhotoFormat')
    }
  }  ,
    query: {
      User(_,{page,pageSize,search}){
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
          return PaginationHelper.getResult({db,baseQuery:db.User,page,pageSize,where,listKey:'User',paranoid:true,include:[{model:db.UserAccount,as:'UserAccount',attributes:[],paranoid:true}]});
      },
      UserById(_,{id}){
        return db.User.findById(id);
      }
    },
    mutation:{
      User(_,{id,FullName,Photo,PhotoFormat}){
        return db.sequelize.transaction(t=>{
          return db.User.findOrCreate({where:{id},defaults:{FullName,Photo,PhotoFormat},transaction:t})
          .spread((instance,created)=>{
              if(created)
                return cloudinary.moderateImage(Photo).then(()=>({instance}));
              else if(instance.UserName ==='Admin')
                return {instance};
              else
                return instance.update({FullName,Photo,PhotoFormat},{transaction:t,fields:['FullName','Photo','PhotoFormat']})
                    .then((instance)=>{
                      return cloudinary.moderateImage(Photo).then(()=>({instance}));
                    });
          })
        }).catch((error)=>{
                return new Promise((resolve)=>{resolve({instance:null,errors:error.errors.map(e=>({key:e.path,message:e.message}))});});
            });
      }
      
    }
};