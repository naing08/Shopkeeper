/**
 * Created by ChitSwe on 1/8/17.
 */
import db from '../models/index';
import {property} from 'lodash';
import cloudinary from '../cloudinary';

export const type=`
    type ProductGroup{
        id:Int!
        Alias:String!
        Name:String!
        Photo:String!
        PhotoFormat:String
        ParentGroupId:Int
        createdAt:DateTime!
        updatedAt:DateTime!
        deletedAt:DateTime
    }
    type ProductGroupMutationResult{
        instance:ProductGroup
        errors:[error]
    }
`;
export const query=`
    ProductGroup(parentGroupId:Int,returnEmpty:Boolean!):[ProductGroup]
    PathToProductGroup(groupId:Int!):[ProductGroup]
`;
export const  mutation=`
    ProductGroup(Alias:String!,Name:String!,Photo:String,PhotoFormat:String,id:Int,ParentGroupId:Int):ProductGroupMutationResult
    deleteProductGroup(id:Int!):Int
`;

export const resolver={
    type:{
        ProductGroup:{
            id:property('id'),
            Alias:property('Alias'),
            Name:property('Name'),
            Photo(group){
                return group.Photo? cloudinary.url(group.Photo):`/img/letter/letter_${group.Alias[0]}.png`;
            },
            PhotoFormat:property('PhotoFormat'),
            ParentGroupId:property('ParentGroupId'),
            createdAt:property('createdAt'),
            deletedAt:property('deletedAt'),
            updatedAt:property('updatedAt')
        }
    },
    query:{
        ProductGroup(_,{parentGroupId,returnEmpty}){
            const where =  parentGroupId? {ParentGroupId:parentGroupId} : {ParentGroupId:{$eq:null}};

            return db.ProductGroup.findAll({where}).then((result)=>{
                if(returnEmpty)
                    return result;
                else{
                    if(result && result.length>0)
                        return result;
                    else{
                        return db.ProductGroup.findById(parentGroupId).then((result)=>{
                            if(result)
                                return db.ProductGroup.findAll({where:{ParentGroupId:result.ParentGroupId}});
                            else
                                return [];
                        });
                    }
                }
            })
        },
        PathToProductGroup(_,{groupId,returnEmpty}){
            return db.sequelize.query('SELECT id,Alias AS "Alias", Name As "Name", photo As "Photo", photoFormat As "PhotoFormat", createdAt As "createdAt", updatedAt AS "updatedAt", deletedAt AS "deletedAt", parentGroupId AS "ParentGroupId"  FROM PathToProductGroup(?)',{model:db.ProductGroup,replacements:[groupId]});

        }
    },
    mutation:{
        ProductGroup(_,{Alias,Name,Photo,PhotoFormat,id,ParentGroupId}){
            Photo = PhotoFormat? Photo: '';
            return db.sequelize.transaction((t)=>{
                return db.ProductGroup.findOrCreate({where: {id: id}, defaults: {Alias, Name,Photo,PhotoFormat,ParentGroupId},transaction:t})
                    .spread((instance, created) => {
                        if(created)
                            return {instance};
                        else{
                            if(instance.Photo !==Photo)
                                cloudinary.delete(instance.Photo).catch();
                            return instance.update({Alias,Name,Photo,PhotoFormat},{transaction:t,fields:['Alias','Name','Photo','PhotoFormat','ParentGroupId']}).then((instance)=>({instance}));
                        }
                    });
            }).catch((error)=>{
                if(error.errors)
                    return new Promise((resolve)=>{resolve({instance:null,errors:error.errors.map(e=>({key:e.path,message:e.message}))});});
                else
                    return error;
            });

        },
        deleteProductGroup(_,{id}){
            return db.sequelize.transaction((t)=>{
                return db.ProductGroup.update({ParentGroupId:null},{where:{ParentGroupId:id},fields:['ParentGroupId'],transaction:t})
                    .then(()=>{
                        return db.ProductGroup.destroy({where:{id},force:true,transaction:t}).then(rowsCount=>(rowsCount >0? id: null));
                    })
            });
        }
    }
};