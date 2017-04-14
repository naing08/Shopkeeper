/**
 * Created by ChitSwe on 1/2/17.
 */
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import db from '../models/index';
import { property, constant } from 'lodash';
import PaginationHelper from '../database/PaginationHelper';
import cloudinary from '../cloudinary';
const Resolver={
    DateTime:new GraphQLScalarType({
        name: 'DateTime',
        description: 'Date time custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.toJSON(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
    Date:new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return (new Date(value)).dateOnly(); // value from the client
        },
        serialize(value) {
            return value.toDateOnlyJSON(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
    ProductBrand:{
        id:property('id'),
        Alias:property('Alias'),
        Name:property('Name'),
        Photo(brand){
            return brand.Photo? cloudinary.url(brand.Photo):`/img/letter/letter_${brand.Alias[0]}.png`;
        },
        PhotoFormat:property('PhotoFormat'),
        createdAt:property('createdAt'),
        updatedAt:property('updatedAt'),
        deletedAt:property('deletedAt')
    },
    Query:{
        ProductBrand(_,{page,pageSize,search}){
            search = search? `%${search}%`:'%';
            let where = search === '%' ? null: {$or:{Alias:{$like:search},Name:{$like:search}}};

            return PaginationHelper.getResult({db,baseQuery:db.ProductBrand,page,pageSize,where,listKey:'ProductBrand',paranoid:false});
        }
    },
    Mutation:{
        ProductBrand(_,{Alias,Name,Photo,PhotoFormat,id}){
            return db.sequelize.transaction((t)=>{
                return db.ProductBrand.findOrCreate({where: {id: id}, defaults: {Alias, Name,Photo,PhotoFormat},transaction:t})
                    .spread((instance, created) => {
                        if(created)
                            return {instance};
                        else{
                            if(instance.Photo !==Photo)
                                cloudinary.delete(instance.Photo).catch();
                            return instance.update({Alias,Name,Photo,PhotoFormat},{transaction:t,fields:['Alias','Name','Photo','PhotoFormat']}).then((instance)=>({instance}));
                        }
                });
            }).catch((error)=>{
                return new Promise((resolve)=>{resolve({instance:null,errors:error.errors.map(e=>({key:e.path,message:e.message}))});})
            });

        },

        deleteProductBrand(_,{id}){
          return db.sequelize.transaction((t)=>{
              return db.ProductBrand.destroy({where:{id:id}})
                  .then((rowsDeleted)=>{
                        if(rowsDeleted>0)
                            return db.ProductBrand.findById(id,{paranoid:false,transaction:t});
                        else
                            return null;
                  })
          });
        },

        undoDeleteProductBrand(_,{id}){
            return db.sequelize.transaction((t)=>{
                return db.ProductBrand.update({deletedAt:null},{paranoid:false,where:{id:id},returning:true,fields:['deletedAt']})
                    .spread((rowsUpdated,instanceRows)=>{
                        if(rowsUpdated>0)
                            return instanceRows[0];
                        else
                            return null;
                    });
            });
        }

    }
};

export default  Resolver;