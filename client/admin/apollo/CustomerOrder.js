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
			ShipToName
			ShipToRegion{Name1}
			ShipToTownship{Name1}

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
	query customerOrder($customerId:Int!,$criteria:criteria!){
		CustomerOrders:CustomerOrderByCustomerId(customerId:$customerId,criteria:$criteria){
			currentPage
			pageSize
			hasMore
			totalRows
			totalPages
			CustomerOrder{
				...CustomerOrderItem
			}
		}
	}
	${fragments.CustomerOrder}
`;

const orderByCustomerIdQuery = graphql(CUSTOMER_ORDER_QUERY,{
	options:({customerId,criteria})=>{
		return {
			variables:{
				customerId,
				criteria
			}
		};
	},
	props:({ownProps:{customerId},data:{loading,refetch,fetchMore,CustomerOrders}})=>{
		let {currentPage,totalPages,hasMore,pageSize,totalRows,CustomerOrder} = CustomerOrders?CustomerOrders: {};
		return {
			loading,
			CustomerOrders:{
				CustomerOrder,
				pagination:{
					currentPage,
					totalPages,
					pageSize,
					totalRows
				}
			},
			fetchOrdersByCustomerId:({customerId,pagination,orderBy})=>{
				return refetch({
					customerId,
					criteria:{
						pagination,
						orderBy
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