/**
 * Created by ChitSwe on 3/6/17.
 */
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';

const fragments={
    User:`
    fragment UserItem on User{
    	id
    	FullName
        UserName
    	deletedAt
        ThumbnailUrl
        UserAccountId
    }
`   ,
    UserById:`
        fragment UserById on User{
            id
            FullName
            UserName
            deletedAt
            createdAt
            updatedAt
            Photo
            PhotoUrl
            ThumbnailUrl
        }
    `
};

const USER_QUERY = gql`
query userQuery($page:Int!,$pageSize:Int!,$search:String){
    Users:User(page:$page,pageSize:$pageSize,search:$search){
        page
        pageSize
        hasMore
        totalRows
        User{
            ...UserItem
        }
    }
}
${fragments.User}
`;

const fetchQuery = graphql(USER_QUERY,{
    options({page,search}){
        return {
            variables:{
                page:page? page: 1,
                pageSize:50,
                search
            }
        };
    },
    props({ownProps:{search},data:{loading,Users,fetchMore,refetch}}){
        let {page,hasMore,pageSize,User}=Users? Users: {};
        return {
            loading,
            page,
            pageSize,
            hasMore,
            User,
            loadMore(page){
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
                            Users:Object.assign({},previousResult.Users,fetchMoreResult.data.Users,{
                                User:[...previousResult.Users.User, ...fetchMoreResult.data.Users.User]
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

const USER_BY_ID_QUERY  = gql`
query userById($id:Int!){
    UserById(id:$id){
        ...UserById
    }
}
${fragments.UserById}
`;

const userByIdQuery=graphql(USER_BY_ID_QUERY,{
    props({ownProps,data:{refetch,loading,UserById}}){
        return {
            findUserById:refetch,
            loadingUserById:loading,
            UserById
        };
    },
    options:({UserEdit:{id}})=>({
        variables:{id},
        forceFetch:true
    })
});

const CREATE_USER = gql`
    mutation userMutate($FullName:String!,$Photo:String,$PhotoFormat:String){
        userMutate:User(FullName:$FullName,Photo:$Photo,PhotoFormat:$PhotoFormat){
            errors{
                key
                message
            }
            instance{
                ...UserById
            }
        }
    }
    ${fragments.UserById}
`;

const createUserMutation = graphql(CREATE_USER,{
    props({ownProps,mutate}){
        return {
            createUser:(arg)=>{
                arg.updateQueries={
                    userQuery:(prev,{mutationResult})=>{
                        let mutatedInstance = mutationResult.data? mutationResult.data.userMutate.instance:null;
                        if(!mutatedInstance)
                            return prev;
                        let {id,FullName,UserName,deletedAt,ThumbnailUrl} = mutatedInstance;
                        let newUser = {id,FullName,UserName,deletedAt,ThumbnailUrl};
                        return immutableUpdate(prev,{
                            Users:{
                                User:{
                                    $unshift:[newUser]
                                }
                            }
                        });
                    }
                };
                return mutate(arg);
            }
        }
    }
});
const UPDATE_USER = gql`
mutation userMutate($id:Int!,$FullName:String!,$Photo:String,$PhotoFormat:String){
    userMutate:User(id:$id,FullName:$FullName,Photo:$Photo,PhotoFormat:$PhotoFormat){
        errors{
            key
            message
        }
        instance{
            ...UserById
        }
    }
}
${fragments.UserById}
`;

const updateUserMutation = graphql(UPDATE_USER,{
    props({ownProps,mutate}){
        return  {
            updateUser:(arg)=>{
                arg.updateQueries={
                    userQuery:(prev,{mutationResult})=>{
                        let mutatedInstance = mutationResult.data? mutationResult.data.userMutate.instance:null;
                        if(!mutatedInstance)
                            return prev;
                        let  index = null;
                        prev.Users.User.every((p,i)=>{
                            if(p.id === mutatedInstance.id){
                                index = i;
                                return false;
                            }else
                                return true;
                        });
                        let {id,FullName,UserName,deletedAt,ThumbnailUrl} = mutatedInstance;
                        let newUser = {id,FullName,UserName,deletedAt,ThumbnailUrl};
                        return index != null ? immutableUpdate(prev,{
                            Users:{
                                User:{
                                    [index]:{
                                        $set:newUser
                                    }
                                }
                            }
                        }):prev;
                    }
                };
                return mutate(arg);
            }
        };
    }
});

export {fragments,fetchQuery,userByIdQuery,updateUserMutation,createUserMutation};