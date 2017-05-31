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
   Price
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
    options:({id})=>({
        variables:{id},
        forceFetch:true
    })
});

export default query;
export  {productByIdQuery};