import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';


const fragments = {
	Customer:`
		fragment CustomerItem on Customer{
			id
			FullName
			UserName
			deletedAt
			ThumbnailUrl
			UserAccountId
            Region
            Township
		}
	`,
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
            Region
            Township
            Address
            IsConfirmedPhoneNo
            IsConfirmedEmail
            IsModerated
		}
	`
};

const CUSTOMER_QUERY = gql`
	query customerQuery($page:Int!,$pageSize:Int!,$search:String){
	    Customers:Customer(page:$page,pageSize:$pageSize,search:$search){
	        page
	        pageSize
	        hasMore
	        totalRows
	        Customer{
	            ...CustomerItem
	        }
	    }
	}
	${fragments.Customer}
`;

const fetchQuery = graphql(CUSTOMER_QUERY,{
    options({page,search}){
        return {
            variables:{
                page:page? page: 1,
                pageSize:50,
                search
            }
        };
    },
    props({ownProps:{search},data:{loading,Customers,fetchMore,refetch}}){
        return {
            loading,
            page:Customers? Customers.page:1,
            pageSize:Customers? Customers.pageSize:50,
            hasMore:Customers? Customers.hasMore:true,
            Customer:Customers? Customers.Customer:[],
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
                            Customers:Object.assign({},previousResult.Customers,fetchMoreResult.data.Customers,{
                                Customer:[...previousResult.Customers.Customer, ...fetchMoreResult.data.Customers.Customer]
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
    options:({params:{id}})=>({
        variables:{id},
        forceFetch:true
    })
}); 

const UPDATE_CUSTOMER = gql`
mutation customerMutate($id:Int,$FullName:String!,$Photo:String,$PhotoFormat:String,$PhoneNo:String,$Email:String,$Region:String,$Township:String,$Address:String){
    customerMutate:Customer(id:$id,FullName:$FullName,Photo:$Photo,PhotoFormat:$PhotoFormat,PhoneNo:$PhoneNo,Email:$Email,Region:$Region,Township:$Township,Address:$Address){
        errors{
            key
            message
        }
        instance{
            ...CustomerById
        }
    }
}
${fragments.CustomerById}
`;

const updateCustomerMutation = graphql(UPDATE_CUSTOMER,{
    props({ownProps,mutate}){
        return  {
            update:(arg)=>{
                arg.updateQueries={
                    customerQuery:(prev,{mutationResult})=>{
                        let mutatedInstance = mutationResult.data? mutationResult.data.customerMutate.instance: null;
                        if(!mutatedInstance)
                            return prev;
                        let  index = null;
                        prev.Customers.Customer.every((p,i)=>{
                            if(p.id === mutatedInstance.id){
                                index = i;
                                return false;
                            }else
                                return true;
                        });
                        let {id,FullName,UserName,deletedAt,ThumbnailUrl,Region,Township} = mutatedInstance;
                        let newCustomer = {
                            id,
                            FullName,
                            UserName,
                            deletedAt,
                            ThumbnailUrl,
                            Region,
                            Township
                        };
                        return index == null? immutableUpdate(prev,{
                            Customers:{
                                Customer:{
                                    $unshift:[newCustomer]
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

export {fragments,fetchQuery,customerByIdQuery,updateCustomerMutation};