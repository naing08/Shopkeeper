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
   DefaultPhotoUrl
   deletedAt
  }
`
};

const PRODUCT_QUERY = gql`
query productQuery($page:Int!,$pageSize:Int!,$search:String,$parentGroupId:Int){
    Products:Product(page:$page,pageSize:$pageSize,search:$search,ProductGroupId:$parentGroupId,paranoid:true){
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
    props({ownProps:{parentGroupId,search,pageSize},data:{loading,Products},fetchMore,refetch}){
        let {page,hasMore,Product}= Products? Products: {};
        return {
            parentGroupId,
            loading,
            page:page? page: 1,
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


const SEARCH_PRODUCT_BY_KEYWORD_QUERY = gql`
query searchProductByKeyWord($keyWord:String,$limit:Int!){
    searchResult:searchProductByKeyWord(keyWord:$keyWord,limit:$limit){
        ...ProductItem
    }
}
${fragments.Product}
`;

const searchProductByKeyWord = graphql(SEARCH_PRODUCT_BY_KEYWORD_QUERY,{
    props({ownProps,data:{refetch,loading,searchResult}}){
        return {
            searchProductByKeyWord:(keyWord,limit)=>{
                return refetch({keyWord,limit});
            },
            searchingProductByKeyWord:loading,
            productSearchResult:searchResult
        };
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
            url
            id
            FileName
            Format
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
            Format
            FileName
            ProductId
            url
        }
        ProductPrice{
            id
            PriceBookName
            Price
        }
        RelatedProducts{
            ...ProductItem
        }
    }
}
${fragments.Product}
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
    mutation updateProduct($id:Int!,$product:InputProduct){
        updateProduct(id:$id,product:$product){
            instance{
                id
                Alias
                Name
                Price
                Description
                Overview
                DefaultPhotoUrl
                ProductBrandId
                ProductBrand{
                    Alias
                    Name
                }
            }
            errors{
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
    mutation createProduct($product:InputProduct){
        createProduct(product:$product){
            instance{
                id
                Alias
                Name
                Price
                Description
                DefaultPhotoUrl
                Overview
                ProductBrandId
                ProductBrand{
                    Alias
                    Name
                }
            }
            errors{
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
                        let mutatedInstance = mutationResult.data? mutationResult.data.createProduct.instance: null;
                        if(!mutatedInstance)
                            return prev;

                        let newProduct = {
                            id:mutatedInstance.id,
                            Alias:mutatedInstance.Alias,
                            Name:mutatedInstance.Name,
                            DefaultPhotoUrl:mutatedInstance.DefaultPhotoUrl,
                            deletedAt:mutatedInstance.deletedAt
                        };
                        prev = Object.assign({},{Products:{Product:[]}},prev);
                        let newResult =immutableUpdate(prev,{
                            Products:{
                                Product:{
                                    $unshift:[newProduct]
                                }
                            }
                        });
                        return newResult;
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
            deleteProductSpecification(id){
                return mutate({
                    variables:{id}
                });
            }
        };
    }
});
const SAVE_PRODUCT_SPEC_MUTATION = gql`
    mutation saveProductSpec($id:Int!,$spec:[InputProductSpec]){
        saveProductSpec(id:$id,spec:$spec){
            instance{
                id
                Name
                Value
            }
            errors{
                key
                message
            }
        }
    }
`;

const saveProductSpecifications = graphql(SAVE_PRODUCT_SPEC_MUTATION,{
    props({ownProps,mutate}){
        return {
            saveProductSpecifications(id,spec){
                return mutate({
                    variables:{id,spec}
                });
            }
        };
    }
});

const SAVE_PRODUCT_PHOTO_MUTATION = gql`
    mutation saveProductPhoto($id:Int!,$photo:InputProductPhoto){
        savedPhoto:saveProductPhoto(id:$id,photo:$photo){
            id
            Format
            FileName
            url
        }
    }
`;
const saveProductPhoto = graphql(SAVE_PRODUCT_PHOTO_MUTATION,{
    props({ownProps,mutate}){
        return {
            saveProductPhoto(id,photo){
                return mutate({
                    variables:{id,photo}
                });
            }
        };
    }
});


const SAVE_PRODUCT_PRICE_MUTATION = gql`
    mutation saveProductPrice($id:Int!,$Price:[InputProductPrice]){
        saveProductPrice(id:$id,Price:$Price){
            Price
            id
        }
    }
`;
const saveProductPrice = graphql(SAVE_PRODUCT_PRICE_MUTATION,{
    props({ownProps,mutate}){
        return {
            saveProductPrice(id,Price){
                return mutate({
                    variables:{id,Price}
                });
            }
        };
    }
});

const SET_PRODUCT_DEFAULT_PHOTO_MUTATION= gql`
    mutation setProductDefaultPhoto($id:Int!,$PhotoId:Int!){
        setProductDefaultPhoto(id:$id,PhotoId:$PhotoId){
            id
            DefaultPhoto{
                id
                url
                FileName
                Format
            }
        }
    }
`;

const setProductDefaultPhoto = graphql(SET_PRODUCT_DEFAULT_PHOTO_MUTATION,{
    props({ownProps,mutate}){
        return {
            setProductDefaultPhoto(id,PhotoId){
                return mutate({
                    variables:{id,PhotoId}
                });
            }
        };
    }
});

const DELETE_PRODUCT_PHOTO_MUTATION= gql`
    mutation deleteProductPhoto($id:Int!,$PhotoId:Int!){
        deleteProductPhoto(id:$id,PhotoId:$PhotoId){
            id
            DefaultPhoto{
                id
                url
                FileName
                Format
            }
        }
    }
`;

const deleteProductPhoto = graphql(DELETE_PRODUCT_PHOTO_MUTATION,{
    props({ownProps,mutate}){
        return {
            deleteProductPhoto(id,PhotoId){
                return mutate({
                    variables:{id,PhotoId}
                });
            }
        };
    }
});

const CREATE_NEW_PRICE_BOOK_MUTATION= gql`
    mutation createNewPriceBook($id:Int!, $PriceBookName:String!){
        createNewPriceBook(id:$id,PriceBookName:$PriceBookName){
            id
            PriceBookId
            PriceBookName
            Price
        }
    }
`;

const createNewPriceBook = graphql(CREATE_NEW_PRICE_BOOK_MUTATION,{
    props({ownProps,mutate}){
        return {
            createNewPriceBook(id,PriceBookName){
                return  mutate({
                    variables:{id,PriceBookName}
                });
            }
        };
    }
});

const ADD_RELATED_PRODUCT_MUTATION = gql `
mutation addRelatedProduct($id:Int!,$relatedId:Int!){
  RelatedProductId:addRelatedProduct(id:$id,relatedId:$relatedId)
}
`;

const addRelatedProduct = graphql(ADD_RELATED_PRODUCT_MUTATION,{
    props({ownProps,mutate}){
        return{
            addRelatedProduct(id,relatedId){
                return mutate({
                    variables:{id,relatedId}
                    });
            }
        }
    }
});

const REMOVE_RELATED_PRODUCT_MUTATION = gql`
    mutation removeRelatedProduct($id:Int!,$relatedId:Int!){
        removeRelatedProduct(id:$id,relatedId:$relatedId)
    }
`;

const removeRelatedProduct=graphql(REMOVE_RELATED_PRODUCT_MUTATION,{
    props({ownProps,mutate}){
        return {
            removeRelatedProduct(id,relatedId){
                return mutate({
                    variables:{id,relatedId}
                });
            }
        };
    }
});

export {undoDestroyQuery,destroyQuery,fragments,query,updateProductQuery,createProductQuery,productByIdQuery,deleteProductSpecification,saveProductSpecifications,saveProductPhoto,setProductDefaultPhoto,deleteProductPhoto,saveProductPrice,createNewPriceBook,searchProductByKeyWord,addRelatedProduct,removeRelatedProduct};
export default query;

