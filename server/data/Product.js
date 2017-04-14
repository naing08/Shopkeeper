/**
 * Created by ChitSwe on 1/8/17.
 */
import  db from '../models/index';
import cloudinary from '../cloudinary';
import {property} from 'lodash';
import PaginationHelper from  '../database/PaginationHelper';
export const type=`
    type Product{
        id:Int!
        Alias:String!
        Name:String!
        Price:Float!
        Description:String
        ProductGroup:ProductGroup
        ProductGroupId:Int
        DefaultPhoto:ProductPhoto
        Thumbnail:ProductPhoto
        Photo:[ProductPhoto]
        ProductBrand:ProductBrand
        ProductBrandId:Int
        updatedAt:DateTime!
        createdAt:DateTime!
        deletedAt:DateTime
        ProductSpec:[ProductSpecification]
    }
    type ProductPhoto{
        id:Int!
        IsThumbnail:Boolean!
        Format:String!
        FileName:String!
        createdAt:Date!
        updatedAt:Date!
        ProductId:Int!
        url:String!
    }
    type Products{
        page:Int!
        pageSize:Int!
        totalRows:Int!
        hasMore:Boolean!
        Product:[Product]
    }
    type ProductMutationResult{
        instance:Product
        errors:[error],
        specErrors:[[error]],
        photoErrors:[[error]]
    }
    type ProductSpecification{
        Name:String!
        Value:String!
        id:Int!
        ProductId:Int!
    }
    input InputProductSpec{
        Name:String!
        Value:String!
        id:Int
        ProductId:Int!
    }
    input InputProductPhoto{
        id:Int
        IsThumbnail:Boolean!
        Format:String!
        FileName:String!
        ProductId:Int!
    }
`;
export const query = `
    Product(ProductGroupId:Int,page:Int!,pageSize:Int!,search:String):Products
    ProductById(id:Int!):Product
`;
export const mutation=`
    deleteProduct(id:Int!):Product
    undoDeleteProduct(id:Int!):Product
    deleteProductSpec(id:Int!):Int
    Product(Alias:String!,Name:String!,Price:Float!,Description:String,ProductGroupId:Int,DefaultPhotoId:Int,ThumbnailId:Int,ProductBrandId:Int,id:Int,ProductSpec:[InputProductSpec]!,Photo:[InputProductPhoto]!):ProductMutationResult
`;


export const resolver={
    type:{
        Product:{
            id:property('id'),
            Alias:property('Alias'),
            Name:property('Name'),
            Price:property('Price'),
            Description:property('Description'),
            ProductGroupId:property('ProductGroupId'),
            ProductGroup(product){
                return product.getProductGroup();
            },
            DefaultPhoto(product){
                return product.getDefaultPhoto();
            },
            Thumbnail(product){
                return product.getThumbnail();
            },
            Photo(product){
                return product.getProductPhotos();
            },
            ProductBrand(product){
                return product.getProductBrand();
            },
            updatedAt:property('updatedAt'),
            createdAt:property('createdAt'),
            deletedAt:property('deletedAt'),
            ProductSpec(product){
                return product.getProductSpecifications();
            }

        },
        ProductPhoto:{
            id:property("id"),
            IsThumbnail:property("IsThumbnail"),
            Format:property("Format"),
            FileName:property("FileName"),
            createdAt:property("createdAt"),
            updatedAt:property("updatedAt"),
            ProductId:property("ProductId"),
            url(photo){
                 return photo.IsThumbnail? cloudinary.thumb(photo.FileName):cloudinary.url(photo.FileName);
            }
        },
        ProductSpecification:{
            id:property("id"),
            Name:property("Name"),
            Value:property("Value"),
            ProductId:property("ProductId")
        }
    },
    query:{
        Product(_,{ProductGroupId,page,pageSize,search}){
            search = search? `%${search}%`: '%';
            const where = {
                $and:{
                    ProductGroupId:{
                        $eq:ProductGroupId? ProductGroupId: null
                    },
                    $or: search ==='%' ? true: {
                        Alias:{
                            $like:search
                        },
                        Name:{
                            $like:search
                        }
                    }
                }
            };
            return PaginationHelper.getResult({db,baseQuery:db.Product,page,pageSize,where,listKey:'Product',paranoid:true});
        },
        ProductById(_,{id}){
            return db.Product.findById(id);
        }
    },
    mutation:{
        deleteProduct(_,{id}){
            return db.sequelize.transaction((t)=>{
                return db.Product.destroy({where:{id:id},transaction:t})
                    .then((rowsDeleted)=>{
                        if(rowsDeleted>0)
                            return db.Product.findById(id,{paranoid:true,transaction:t}).
                                then((result)=>{
                                    return result;
                                });
                        else
                            return null;
                    });
            });
        },
        undoDeleteProduct(_,{id}){
            return db.sequelize.transaction((t)=>{
                return db.Product.update({deletedAt:null},{paranoid:false,where:{id:id},returning:true,fields:['deletedAt']})
                    .spread((rowsUpdated,instanceRows)=>{
                        if(rowsUpdated>0)
                            return instanceRows[0];
                        else
                            return null;
                    });
            });
        },
        deleteProductSpec(_,{id}){
          return db.sequelize.transaction((t)=>{
              return db.ProductSpecification.destroy({where:{id},transaction:t});
          });
        },
        Product(_,{id,Alias,Name,Price,Description,ProductGroupId,DefaultPhotoId,ThumbnailId,ProductBrandId,ProductSpec,Photo}){
            return db.sequelize.transaction((t)=>{
                return db.Product.findOrCreate({where:{id},defaults:{Alias,Name,Price,Description,ProductGroupId,DefaultPhotoId,ThumbnailId,ProductBrandId},transaction:t})
                    .spread((instance,created)=>{
                        let promise= null;
                        if(created)
                            promise = new Promise((res,rej)=>{res({instance});});
                        else
                            promise= instance.update({Alias,Name,Price,Description,ProductGroupId,DefaultPhotoId,ThumbnailId,ProductBrandId},{transaction:t,fields:['Alias','Name','Price','Description','ProductGroupId','DefaultPhotoId','ThumbnailId','ProductBrandId']})
                                .then(
                                    ()=>db.Product.findById(instance.id,{transaction:t})
                                        .then((product)=>({instance:product}))
                                );
                        return promise.then(({instance})=>{
                            const promises = [];
                            ProductSpec.every(({id,Name,Value},index)=>{
                                promises.push(
                                    db.ProductSpecification.findOrCreate({where:{id},defaults:{Name,Value,ProductId:instance.id},transaction:t})
                                        .spread((specInstance,specCreated)=>{
                                            if(!specCreated)
                                                return specInstance.update({Name,Value,ProductId:instance.id},{transaction:t,fields:["Name","Value","ProductId"]}).then(()=>([]));
                                            else
                                                return [];
                                        }).catch((error)=>{
                                        return new Promise ((res)=>{res(error.errors.map(e=>({key:e.path,message:e.message})));});
                                    })
                                );
                                return true;
                            });
                            const photoPromises = [];
                            Photo.forEach(({id,IsThumbnail,FileName,Format,ProductId},index)=>{
                                photoPromises.push(
                                    db.ProductPhoto.findOrCreate({where:{id},defaults:{IsThumbnail,FileName,Format,ProductId},transaction:t})
                                        .spread((photoInstance,isPhotoCreated)=>{
                                            let promise = null;
                                            if(!isPhotoCreated)
                                                promise= photoInstance.update({IsThumbnail,FileName,Format,ProductId},{transaction:t,fields:["IsThumbnail","FileName","Format","ProductId"]}).then(()=>([]));//empty array for no errors
                                            else
                                                promise = new Promise((response)=>{response([]);});
                                            if(!instance.DefaultPhotoId) {//set default photo
                                                promise = promise.then((result) => {
                                                    return instance.update({DefaultPhotoId:photoInstance.id},{transaction:t,fields:["DefaultPhotoId"]})
                                                        .then((defaultPhotoUpdated)=>{
                                                            instance = defaultPhotoUpdated;
                                                            return result;
                                                        });
                                                });
                                            }
                                            return promise.then((result)=>{
                                                return cloudinary.moderateImage(FileName).then((moderateResult)=>{
                                                    return result;
                                                });
                                            });
                                        }).catch((error)=>{
                                        return new Promise ((res)=>{res(error.errors.map(e=>({key:e.path,message:e.message})));});
                                    })
                                );
                            });
                            return Promise.all([
                                Promise.all(promises),
                                Promise.all(photoPromises)
                            ]).then((results)=>{
                                let specResult = results[0];
                                let photoResult = results[1];
                                let hasSpecError = !specResult.every((e)=>{
                                    return e.length ===0;
                                });
                                let hasPhotoError = !photoResult.every((e)=>{
                                    return e.length===0;
                                });
                                let result =  {instance:hasSpecError || hasPhotoError? null: instance,specErrors:specResult,photoErrors:photoResult};

                                return result;
                            });
                        });
                    }).catch((error)=>{
                        if(error.errors)
                            return new Promise((resolve)=>{resolve({instance:null,errors:error.errors.map(e=>({key:e.path,message:e.message}))});});
                        else
                            return error;
                    });
            });
        }
    }
};