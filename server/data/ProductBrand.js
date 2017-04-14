
import db from '../models/index';
import { property } from 'lodash';
import PaginationHelper from '../database/PaginationHelper';
import cloudinary from '../cloudinary';

export const type=
  `
  type ProductBrand{
        id:Int!
        Alias:String!
        Name:String!
        Photo:String
        PhotoFormat:String,
        updatedAt:DateTime!
        createdAt:DateTime!
        deletedAt:DateTime
    }
    type ProductBrands{
       page:Int!
       pageSize:Int!
       totalRows:Int!
       hasMore:Boolean!
       ProductBrand:[ProductBrand]
    }
    type ProductBrandMutationResult{
        instance:ProductBrand
        errors:[error]
    }
`;

export const query=`
    ProductBrand(page:Int!,pageSize:Int!,search:String):ProductBrands
`;

export const mutation=`
    ProductBrand(Alias:String!,Name:String!,Photo:String,PhotoFormat:String,id:Int):ProductBrandMutationResult
    deleteProductBrand(id:Int!):ProductBrand
    undoDeleteProductBrand(id:Int!):ProductBrand
`;

export const resolver ={
    type:{
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
        }
    },
    query:{
        ProductBrand(_,{page,pageSize,search}){
            search = search? `%${search}%`:'%';
            let where = search === '%' ? null: {$or:{Alias:{$like:search},Name:{$like:search}}};

            return PaginationHelper.getResult({db,baseQuery:db.ProductBrand,page,pageSize,where,listKey:'ProductBrand',paranoid:false});
        }
    },
    mutation:{
        ProductBrand(_,{Alias,Name,Photo,PhotoFormat,id}){
            Photo = PhotoFormat? Photo: '';
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
                if(error.errors)
                    return new Promise((resolve)=>{resolve({instance:null,errors:error.errors.map(e=>({key:e.path,message:e.message}))});})
                else
                    return error;
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
