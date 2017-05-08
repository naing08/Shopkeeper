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
   Price
  }
`
};

const PRODUCT_QUERY = gql`
query productQuery($page:Int,$pageSize:Int!,$search:String,$parentGroupId:Int){
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
    props({ownProps:{parentGroupId,search},data:{loading,Products,fetchMore,refetch}}){
        let {page,hasMore,pageSize,Product} = Products?Products: {};
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
            url
        }
        Thumbnail{
            url
        }
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
    options:({id})=>({
        variables:{id},
        forceFetch:true
    })
});

export default query;
export  {productByIdQuery};