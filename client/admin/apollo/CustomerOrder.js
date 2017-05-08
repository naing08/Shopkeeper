import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';

const fragments = {
	CustomerOrder:`
		fragment CustomerOrderItem on CustomerOrder{
			id
			OrderDate
			OrderNo
			createdAt
			updatedAt
			TotalQty
			TotalAmount
		}
	`,
	CustomerOrderById:`
		fragment CustomerOrderByIdItem on CustomerOrder{
			id
			OrderDate
			OrderNo
			createdAt
			updatedAt
			Customer{
				id
				FullName
				PhotoUrl
			}
			TotalAmount
			TotalQty
			OrderDetail{
				id
				Qty
				Price
				Product{
					id
					Name
					Alias
					DefaultPhoto{
						url
					}
				}
			}
		}
	`
};

const CUSTOMER_ORDER_QUERY = gql`
	query customerOrder($customerId:Int!,$page:Int!,$pageSize:Int!){
		CustomerOrders:CustomerOrder(customerId:$customerId,page:$page,pageSize:$pageSize){
			page
			pageSize
			hasMore
			totalRows
			CustomerOrder{
				...CustomerOrderItem
			}
		}
	}
	${fragments.CustomerOrder}
`;

const orderByCustomerIdQuery = graphql(CUSTOMER_ORDER_QUERY,{
	options:({customerId,page,pageSize})=>{
		return {
			variables:{
				customerId,
				page,
				pageSize
			}
		};
	},
	props:({ownProps:{customerId},data:{loading,refetch,fetchMore,CustomerOrders}})=>{
		let {page,hasMore,pageSize} = CustomerOrders?CustomerOrders: {};
		return {
			loading,
			refetchOrdersByCustomerId:refetch,
			CustomerOrders,
			fetchMoreOrdersByCustomerId:(page)=>{
				return fetchMore({
					variables:{
						page,
						pageSize,
						customerId
					},
					updateQuery:(previousResult,{fetchMoreResult})=>{
						if(!fetchMoreResult.data){
                            return previousResult;
                        }
                        const result =  Object.assign({},previousResult,{
                            CustomerOrders:Object.assign({},previousResult.CustomerOrders,fetchMoreResult.data.CustomerOrders,{
                                CustomerOrder:[...previousResult.CustomerOrders.CustomerOrder, ...fetchMoreResult.data.CustomerOrders.CustomerOrder]
                            })
                        });
                        return result;
					}
				});
			},
		}
	}
});

const CUSTOMER_BY_ID_QUERY  = gql`
query customerOrderById($id:Int!){
    CustomerOrderById(id:$id){
        ...CustomerOrderByIdItem
    }
}
${fragments.CustomerOrderById}
`;

const customerOrderByIdQuery=graphql(CUSTOMER_BY_ID_QUERY,{
    props({ownProps,data:{refetch,loading,CustomerOrderById}}){
        return {
            findCustomerOrderById:refetch,
            loadingCustomerOrderById:loading,
            CustomerOrderById
        };
    },
    options:({id})=>({
        variables:{id},
        forceFetch:true
    })
});

export default orderByCustomerIdQuery;
export {customerOrderByIdQuery};