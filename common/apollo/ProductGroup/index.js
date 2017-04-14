/**
 * Created by ChitSwe on 1/27/17.
 */
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
  ProductGroup(parentGroupId:$parentGroupId,returnEmpty:false){
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





const SAVE_QUERY = gql`
    mutation updateProductGroup($Alias:String!,$Name:String!,$Photo:String,$PhotoFormat:String,$id:Int,$ParentGroupId:Int){
        productGroupMutate:ProductGroup(Alias:$Alias,Name:$Name,Photo:$Photo,PhotoFormat:$PhotoFormat,id:$id,ParentGroupId:$ParentGroupId){
            instance{
                id
                Alias
                Name
                Photo
                PhotoFormat
                deletedAt
                ParentGroupId
            }
            errors{
                key
                message
            }
        }
    }
`;

const insertQuery = graphql(SAVE_QUERY,{
    props({ownProps:{parentGroupId},mutate}){
        return {
            saveMutation:(args)=>{
                args.updateQueries={
                    productGroupQuery:(prev,{mutationResult})=>{
                        let mutatedInstance = mutationResult.data.productGroupMutate.instance;
                        if(!mutatedInstance)
                            return prev;
                        let parentIdOfMutated = mutatedInstance.ParentGroupId;
                        let  index = null;
                        prev.ProductGroup.every((g,i)=>{
                            if(g.id && parentIdOfMutated && g.id==parentIdOfMutated){
                                index = i;
                                return false;
                            }else
                                return true;
                        });
                        return index != null ? immutableUpdate (prev,{
                            ProductGroup:{
                                $set:[mutatedInstance]
                            }
                        }):immutableUpdate(prev,{
                            ProductGroup:{
                                $unshift:[mutatedInstance]
                            }
                        });
                    }
                };
                return mutate(args);
            }
        };
    }
});

const updateQuery = graphql(SAVE_QUERY,{
    props({ownProps,mutate}){
        return {
            updateMutation:(args)=>{
                return mutate(args);
            }
        };
    }
});

const DELETE_QUERY = gql`
    mutation deleteProductGroup($id:Int!){
        deleteProductGroup(id:$id)
    }
`;

const destroyQuery = graphql(DELETE_QUERY,{
    props({ownProps,mutate}){
        return{
            destroy(id){
                const args = {
                    variables:{id},
                    updateQueries:{
                        ProductBrand:(prev,{mutationResult})=>{
                            return prev;
                        },
                        productGroupQuery:(prev,{mutationResult})=>{
                            let  index = null;
                            prev.ProductGroup.every((g,i)=>{
                                if(g.id==mutationResult.data.deleteProductGroup){
                                    index = i;
                                    return false;
                                }else
                                    return true;
                            });

                            return index != null? immutableUpdate(prev,{
                                ProductGroup:{
                                    $splice:[[index,1]]
                                }
                            }):prev;
                        }
                    }
                };
                return mutate(args);
            }
        }
    }
});


const PATH_QUERY = gql`
query Query($groupId:Int!){
  PathToProductGroup(groupId:$groupId){
    id
    Alias
  }
}
`;
const pathToProductGroup = graphql(PATH_QUERY,{
    skip({groupId}){
        return !groupId;
    },
    options({groupId}){
        return {
            variables:{
                groupId
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
export {fragments,insertQuery,updateQuery,query,destroyQuery,pathToProductGroup};
export default query;

