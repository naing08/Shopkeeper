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
        DefaultPhotoUrl:String
        Overview:String
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
        errors:[error]
    }
    type SpecMutationResult{
        instance:ProductSpecification
        errors:[error]
    }
    type ProductSpecification{
        Name:String!
        Value:String!
        id:Int!
        ProductId:Int!
    }

    input InputProduct{
        Alias:String!
        Name:String!
        Price:Float!
        Description:String
        ProductGroupId:Int
        Overview:String
        ProductBrandId:Int
        DefaultPhoto:InputProductPhoto
    }
    input InputProductSpec{
        Name:String!
        Value:String!
    }
    input InputProductPhoto{
        Format:String!
        FileName:String!
    }
`;
export const query = `
    Product(ProductGroupId:Int,page:Int,pageSize:Int!,search:String,paranoid:Boolean):Products
    ProductById(id:Int!):Product
`;
export const mutation=`
    deleteProduct(id:Int!):Product
    undoDeleteProduct(id:Int!):Product
    deleteProductSpec(id:Int!):Int
    createProduct(product:InputProduct):ProductMutationResult
    updateProduct(id:Int!,product:InputProduct):ProductMutationResult
    saveProductSpec(id:Int!,spec:[InputProductSpec]):[SpecMutationResult]
    saveProductPhoto(id:Int!,photo:InputProductPhoto):ProductPhoto
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
            Overview:property('Overview'),
            DefaultPhotoUrl:product=>{
                return product.getDefaultPhoto().then(photo=>photo? cloudinary.url(photo.FileName):'');
            },
            ProductGroup(product){
                return product.getProductGroup();
            },
            DefaultPhoto(product){
                return product.getDefaultPhoto();
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
        Product(_,{ProductGroupId,page,pageSize,search,paranoid}){
            page = page? page: 1;
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
            return PaginationHelper.getResult({db,baseQuery:db.Product,page,pageSize,where,listKey:'Product',paranoid:paranoid});
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
        createProduct(_,{product}){
            let {DefaultPhoto} = product;
            return db.sequelize.transaction(t=>{
                return db.Product.create(product,{fields:['Alias','Name','Price','Description','ProductGroupId','DefaultPhotoId','Overview','ProductBrandId'],transaction:t})
                .then(product=>{
                    if(DefaultPhoto){
                        return product.createProductPhoto(DefaultPhoto,{fields:['Format','FileName'],transaction:t})
                            .then(photo=>{
                                return product.setDefaultPhoto(photo,{transaction:t}).then(()=>{
                                    return {instance:product};
                                });
                            })
                    }else
                        return {instance:product};
                })
                .catch(error=>{
                    if(error.errors)
                            return new Promise((resolve)=>{resolve({instance:null,errors:error.errors.map(e=>({key:e.path,message:e.message}))});});
                        else
                            throw error;
                });
            });
        },
        updateProduct(_,{id,product}){
            return db.sequelize.transaction(t=>{
                return db.Product.findById(id,{transaction:t})
                    .then(findResult=>{
                        return findResult.update(product,{fields:['Alias','Name','Price','Description','ProductGroupId','DefaultPhotoId','Overview','ProductBrandId'],transaction:t})
                            .then(product=>({instance:product}))
                            .catch(error=>{
                                if(error.errors)
                                        return new Promise((resolve)=>{resolve({instance:null,errors:error.errors.map(e=>({key:e.path,message:e.message}))});});
                                    else
                                        throw error;
                            });
                    });
            });
        },
        saveProductSpec(_,{id,spec}){
            return db.sequelize.transaction(t=>{
                return db.ProductSpecification.destroy({where:{ProductId:id},transaction:t})
                    .then(()=>{
                        return db.Product.findById(id,{transaction:t})
                            .then(product=>{
                                let promises = spec.map(s=>product.createProductSpecification({...s,ProductId:id},{fields:['Value','Name','ProductId'],transaction:t})
                                        .then(spec=>({instance:spec}))
                                        .catch(error=>{
                                            if(error.errors)
                                                return new Promise((resolve)=>{resolve({instance:null,errors:error.errors.map(e=>({key:e.path,message:e.message}))});});
                                            else
                                                return error;
                                        })
                                    );
                                return Promise.all(promises);
                            });
                    });
            });
        },
        saveProductPhoto(_,{id,photo}){
            return db.sequelize.transaction(t=>{
                return db.ProductPhoto.create({...photo,ProductId:id},{fields:['Format','FileName','ProductId'],transaction:t});
            });
        },
        
    }
};