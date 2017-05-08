import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';


const fragments = {
    ProductGroup:gql`
    fragment ProductGroupItem on ProductGroup{
        id
        Alias
        Name
        Photo
    }
`
};

const GROUP_QUERY = gql`
query productGroupQuery($parentGroupId:Int){
  ProductGroup(parentGroupId:$parentGroupId,returnEmpty:true){
    ...ProductGroupItem
  }
}
${fragments.ProductGroup}
`;


const query = graphql(GROUP_QUERY,{
    options({parentGroupId}){
        return {
            variables:{
                parentGroupId
            }
        };
    },
    props({ownProps,data:{loading,ProductGroup,refetch}}){
        return {
            loading,
            ProductGroup,
            refetch
        };
    }
});

const PATH_QUERY = gql`
query Query($groupId:Int!){
  PathToProductGroup(groupId:$groupId){
    id
    Alias
    Name
  }
}
`;
const pathToProductGroup = graphql(PATH_QUERY,{
    skip({parentGroupId}){
        return !parentGroupId;
    },
    options({parentGroupId}){
        return {
            variables:{
                groupId:parentGroupId
            }
        }
    },
    props({ownProps,data:{loading,PathToProductGroup,refetch}}){
        return {
            loading,
            PathToProductGroup,
            refetch
        };
    }
});

export default query;
export {pathToProductGroup};