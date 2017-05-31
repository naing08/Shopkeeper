import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';


const fragments = {
    CustomerById:`
        fragment CustomerById on Customer{
            id
            FullName
            UserName
            deletedAt
            createdAt
            updatedAt
            Photo
            PhotoUrl
            ThumbnailUrl
            PhoneNo
            Email
            Region{
                id
                Name1
            }
            Township{
                id
                Name1
            }
            Address
            IsConfirmedPhoneNo
            IsConfirmedEmail
            IsModerated
            UserAccountId
        }
    `
};

const CUSTOMER_BY_ID_QUERY  = gql`
    query customerById($id:Int!){
        CustomerById(id:$id){
            ...CustomerById
        }
    }
    ${fragments.CustomerById}
    `;


const customerByIdQuery=graphql(CUSTOMER_BY_ID_QUERY,{
    props({ownProps,data:{refetch,loading,CustomerById}}){
        return {
            findCustomerById:refetch,
            loadingCustomerById:loading,
            CustomerById
        };
    },
    options:({customerId})=>({
        variables:{id:customerId}
    }),
    skip:({customerId})=>!customerId
}); 

const SIGNUP_CUSTOMER_MUTATION  = gql`
    mutation RegisterCustomer($FullName:String!,$PhoneNo:String!,$Email:String,$TownshipId:Int!,$UserName:String!,$Password:String,$Photo:String,$PhotoFormat:String,$Remember:Boolean!){
        RegisterCustomer(FullName:$FullName,PhoneNo:$PhoneNo,Email:$Email,TownshipId:$TownshipId,UserName:$UserName,Password:$Password,Photo:$Photo,PhotoFormat:$PhotoFormat,Remember:$Remember){
            success
            access_token
            user_id
            user_name
            account_type
            profile_pic
            full_name
            entity_id
        }
    }
`;

const signUpCustomerMutation = graphql(SIGNUP_CUSTOMER_MUTATION,{
    props({ownProps,mutate}){
        return {
            registerCustomer:(variables)=>{
                return mutate({
                    variables
                });
            }
        };
    }
});



export {customerByIdQuery,signUpCustomerMutation};