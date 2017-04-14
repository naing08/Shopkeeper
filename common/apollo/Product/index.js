/**
 * Created by ChitSwe on 1/28/17.
 */
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';

const fragments={
    Product:`
  fragment ProductItem on Product{
   id,
   Alias
   Name
   Thumbnail{
    url
   }
   DefaultPhoto{
    url
   }
   deletedAt
  }
`
};

const PRODUCT_QUERY = gql`
query productQuery($page:Int!,$pageSize:Int!,$search:String,$parentGroupId:Int){
    Products:Product(page:$page,pageSize:$pageSize,search:$search,ProductGroupId:$parentGroupId){
        page
        pageSize
        hasMore
        totalRows
        Product{
            ...ProductItem
        }
    }
}
${fragments.Product}
`;
const query = graphql(PRODUCT_QUERY,{
    options({parentGroupId,page,search}){
        return {
            variables:{
                parentGroupId,
                page,
                pageSize:50,
                search
            }
        };
    },
    props({ownProps:{parentGroupId,search},data:{loading,Products:{page,hasMore,pageSize,Product},fetchMore,refetch}}){
        return {
            parentGroupId,
            loading,
            page,
            pageSize,
            hasMore,
            Product,
            loadMore(page){
                return fetchMore({
                    variables:{
                        page,
                        pageSize,
                        parentGroupId,
                        search
                    },
                    updateQuery:(previousResult,{fetchMoreResult})=>{
                        if(!fetchMoreResult.data){
                            return previousResult;
                        }
                        const result =  Object.assign({},previousResult,{
                            Products:Object.assign({},previousResult.Products,fetchMoreResult.data.Products,{
                                Product:[...previousResult.Products.Product, ...fetchMoreResult.data.Products.Product]
                            })
                        });
                        return result;
                    }
                });
            },
            refetch
        }
    }
});


const DELETE_PRODUCT_QUERY = gql`
    mutation deleteProduct($id:Int!){
        deleteProduct(id:$id){
            id
            deletedAt
        }
    }
`;

function updateDeleted(prev,{id,deletedAt}){
    if(!deletedAt)
        return prev;
    let  index = null;
    prev.Products.Product.every((p,i)=>{
        if(p.id === id){
            index = i;
            return false;
        }else
            return true;
    });
    return index != null ? immutableUpdate (prev,{
        Products:{
            Product:{
                [index]:{
                    deletedAt:{
                        $set:deletedAt
                    }
                }
            }
        }
    }):prev;
}

const destroyQuery = graphql(DELETE_PRODUCT_QUERY,{
    props({ownProps,mutate}){
        return{
            destroy(id){
                return mutate({
                    variables:{id},
                    updateQueries:{
                        productQuery:(prev,{mutationResult})=>{
                            return updateDeleted(prev,mutationResult.data.deleteProduct)
                        }
                    }
                });
            }
        }
    }
});

const UNDO_DELETE_PRODUCT_QUERY  = gql`
    mutation undoDeleteProduct($id:Int!){
        undoDeleteProduct(id:$id){
            id
            deletedAt
        }
    }
`;


const undoDestroyQuery = graphql(UNDO_DELETE_PRODUCT_QUERY,{
    props({ownProps,mutate}){
        return {
            undoDestroy(id){
                return mutate({
                    variables:{id},
                    updateQueries:{
                        productQuery:(prev,{mutationResult})=>{
                            return updateDeleted(prev,mutationResult.data.undoDeleteProduct);
                        }
                    }
                });
            }
        };
    }
});


const PRODUCT_BY_ID_QUERY  = gql`
query productByIdQuery($id:Int!){
    ProductById(id:$id){
        id
        Alias
        Name
        Price
        Description
        DefaultPhoto{
            id
        }
        Thumbnail{
            id
        }
        ProductBrandId
        ProductGroupId
        ProductBrand{
            Alias
            Name
        }
        ProductSpec{
            id
            Name
            Value    
            ProductId
        }
        Photo{
            id
            IsThumbnail
            Format
            FileName
            ProductId
            url
        }
        
    }
}
`;

const productByIdQuery=graphql(PRODUCT_BY_ID_QUERY,{
    props({ownProps,data:{refetch,loading,ProductById}}){
        return {
            findProductById:refetch,
            loadingProductById:loading,
            ProductById
        };
    },
    options:({Product:{id}})=>({
        variables:{id},
        forceFetch:true
    })
});

const UPDATE_PRODUCT_QUERY = gql`
    mutation updateProduct($Alias:String!,$Name:String!,$Price:Float!,$Description:String,$ProductGroupId:Int,$DefaultPhotoId:Int,$ThumbnailId:Int,$ProductBrandId:Int,$id:Int!,$ProductSpec:[InputProductSpec]!,$Photo:[InputProductPhoto]!){
        productMutate:Product(Alias:$Alias,Name:$Name,Price:$Price,Description:$Description,ProductGroupId:$ProductGroupId,DefaultPhotoId:$DefaultPhotoId,ThumbnailId:$ThumbnailId,ProductBrandId:$ProductBrandId,id:$id,ProductSpec:$ProductSpec,Photo:$Photo){
            instance{
                id
                Alias
                Name
                Price
                Description
                DefaultPhoto{
                    id
                }
                Thumbnail{
                    id
                }
                ProductBrandId
                ProductBrand{
                    Alias
                    Name
                }
                Photo{
                    id
                    FileName
                    Format
                    IsThumbnail
                    ProductId
                    id
                    url
                }
                ProductSpec{
                    id
                    Name
                    Value
                    ProductId
                }
            }
            errors{
                key
                message
            }
            specErrors{
                key
                message
            }
            photoErrors{
                key
                message
            }
        }
    }
`;

const updateProductQuery = graphql(UPDATE_PRODUCT_QUERY,{
    props({ownProps,mutate}){
        return  {
            update:(arg)=>{
                return mutate(arg);
            }
        };
    }
});

const CREATE_PRODUCT_QUERY = gql`
    mutation createProduct($Alias:String!,$Name:String!,$Price:Float!,$Description:String,$ProductGroupId:Int,$DefaultPhotoId:Int,$ThumbnailId:Int,$ProductBrandId:Int,$id:Int,$ProductSpec:[InputProductSpec]!,$Photo:[InputProductPhoto]!){
        productMutate:Product(Alias:$Alias,Name:$Name,Price:$Price,Description:$Description,ProductGroupId:$ProductGroupId,DefaultPhotoId:$DefaultPhotoId,ThumbnailId:$ThumbnailId,ProductBrandId:$ProductBrandId,id:$id,ProductSpec:$ProductSpec,Photo:$Photo){
            instance{
                id
                Alias
                Name
                Price
                Description
                DefaultPhoto{
                    id
                }
                Thumbnail{
                    id
                }
                ProductBrandId
                ProductBrand{
                    Alias
                    Name
                }
                Photo{
                    id
                    FileName
                    Format
                    IsThumbnail
                    ProductId
                    id
                    url
                }
                ProductSpec{
                    id
                    Name
                    Value
                    ProductId
                }
            }
            errors{
                key
                message
            }
            specErrors{
                key
                message
            }
            photoErrors{
                key
                message
            }
        }
    }
`;

const createProductQuery = graphql(CREATE_PRODUCT_QUERY,{
    props({ownProps,mutate}){
        return  {
            create:(arg)=>{
                arg.updateQueries={
                    productQuery:(prev,{mutationResult})=>{
                        let mutatedInstance = mutationResult.data? mutationResult.data.productMutate.instance: null;
                        if(!mutatedInstance)
                            return prev;
                        let newProduct = {
                            id:mutatedInstance.id,
                            Alias:mutatedInstance.Alias,
                            Name:mutatedInstance.Name,
                            Thumbnail:mutatedInstance.Thumbnail,
                            DefaultPhoto:mutatedInstance.DefaultPhoto,
                            deletedAt:mutatedInstance.deletedAt
                        };
                        return immutableUpdate(prev,{
                            Products:{
                                Product:{
                                    $unshift:[newProduct]
                                }
                            }
                        });
                    }
                };
                return mutate(arg);
            }
        };
    }
});

const DELETE_PRODUCT_SPECIFICATION_QUERY = gql`
mutation deleteProductSpecification($id:Int!){
    deleteProductSpec(id:$id)
}
`;
const deleteProductSpecification = graphql (DELETE_PRODUCT_SPECIFICATION_QUERY,{
    props({ownProps,mutate}){
        return {
            destroy(id){
                return mutate({
                    variables:{id}
                });
            }
        }
    }
});


export {undoDestroyQuery,destroyQuery,fragments,query,updateProductQuery,createProductQuery,productByIdQuery,deleteProductSpecification};
export default query;

