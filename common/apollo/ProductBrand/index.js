/**
 * Created by ChitSwe on 1/25/17.
 */
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';
const fragments ={
    ProductBrand:gql`
    fragment ProductBrandItem on ProductBrand{
      id
      Alias
      Name
      Photo
      deletedAt
    }
    `
};

const QUERY = gql`
query ProductBrand($page:Int!,$pageSize:Int!,$search:String){
            ProductBrands:ProductBrand(page:$page,pageSize:$pageSize,search:$search){
                page
                pageSize
                hasMore
                ProductBrand{
                    ...ProductBrandItem
                }
            }
        }
        ${
        fragments.ProductBrand
    }
`;

const query = graphql(QUERY,{
    options(props){
        return {
            variables:{
                page:1,
                pageSize:40,
                search:''
            },
            reducer:(prev,action,variables)=>{
                let result = prev;
                switch (action.type){
                    case 'APOLLO_MUTATION_RESULT':
                        if(action.operationName==='createProductBrand'){
                            const newBrand = action.result.data.productBrandMutate.instance;
                            if(!newBrand)
                                result =  prev;
                            else
                                result= immutableUpdate(prev,{
                                    ProductBrands:{
                                        ProductBrand:{
                                            $unshift:[newBrand]
                                        }
                                    }
                                });
                        }else
                            result =  prev;
                        break;
                    default:
                        result =  prev;
                }
                return result;
            }
        };
    },
    props({data:{loading,ProductBrands,fetchMore,refetch}}){

        return Object.assign({
            loading,
            loadMore(page,search){
                return fetchMore({
                    variables:{
                        page,
                        pageSize,
                        search
                    },
                    updateQuery:(previousResult,{fetchMoreResult})=>{
                        if(!fetchMoreResult.data){
                            return previousResult;
                        }
                        const result =  Object.assign({},previousResult,{
                            ProductBrands:Object.assign({},previousResult.ProductBrands,fetchMoreResult.data.ProductBrands,{
                                ProductBrand:[...previousResult.ProductBrands.ProductBrand, ...fetchMoreResult.data.ProductBrands.ProductBrand]
                            })
                        });
                        return result;
                    }
                })
            },
            refetch
        },ProductBrands);
    }
});



const CREATE_QUERY = gql`
    mutation createProductBrand($Alias:String!,$Name:String!,$Photo:String,$PhotoFormat:String){
        productBrandMutate:ProductBrand(Alias:$Alias,Name:$Name,Photo:$Photo,PhotoFormat:$PhotoFormat){
            instance{
                id
                Alias
                Name
                Photo
                PhotoFormat
                deletedAt
            }
            errors{
                key
                message
            }
        }
    }
`;

const create = graphql(CREATE_QUERY,{
    props({ownProps,mutate}){
        return {
            submit(variables){
                const args = {
                    variables
                };
                return mutate(args);
            }
        };
    }
});

const UPDATE_QUERY = gql`
    mutation saveProductBrand($Alias:String!,$Name:String!,$Photo:String,$PhotoFormat:String,$id:Int!){
        productBrandMutate:ProductBrand(Alias:$Alias,Name:$Name,Photo:$Photo,PhotoFormat:$PhotoFormat,id:$id){
            instance{
                id
                Alias
                Name
                Photo
                PhotoFormat
                deletedAt
            }
            errors{
                key
                message
            }
        }
    }
`;

const update = graphql(UPDATE_QUERY);


const DESTROY_QUERY = gql`
    mutation deleteProductBrand($id:Int!){
        deleteProductBrand(id:$id){
            id
            deletedAt
        }
    }
`;

const destroy=graphql(DESTROY_QUERY,{
    props({ownProps,mutate}){
        return{
            destroy(id){
                return mutate({variables:{id}});
            }
        }
    }
});

const UNDO_DESTROY_QUERY  = gql`
    mutation undoDeleteProductBrand($id:Int!){
        undoDeleteProductBrand(id:$id){
            id
            deletedAt
        }
    }
`;



const undoDestroy = graphql(UNDO_DESTROY_QUERY,{
    props({ownProps,mutate}){
        return {
            undoDestroy(id){
                return mutate({variables:{id}});
            }
        };
    }
});

const PRODUCT_BRAND_LIST_QUERY = gql`
    query productBrandList($search:String){
        productBrandList:ProductBrand(page:1,pageSize:10,search:$search){
            ProductBrand{
                id
                Alias
                Name
                Photo
            }
        }
    }
`;

const productBrandListQuery = graphql(PRODUCT_BRAND_LIST_QUERY,{
    props({ownProps,data:{refetch,loading,productBrandList}}){
        return {
            searchProduct:(search)=>{
                return refetch({search});
            },
            brandListLoading:loading,
            productBrandList
        };
    }
});



export {query,create,undoDestroy,destroy,update,fragments,productBrandListQuery};
export default query;