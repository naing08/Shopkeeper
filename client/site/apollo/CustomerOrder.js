import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';


const CUSTOMER_ORDER_FETCH= gql`
query customerOrderFetch($page:Int,$pageSize:Int){
	CustomerOrders:CustomerOrder(page:$page,pageSize:$pageSize){
		page,
		totalRows,
		hasMore,
		pageSize,
		CustomerOrder{
			id
	      	OrderNo
	      	OrderDate
	      	ShipToName
	      	TotalQty
	      	TotalAmount
	      	createdAt
		}
	}
}
`;


const customerOrderFetchQuery = graphql(CUSTOMER_ORDER_FETCH,{
	options:({page,pageSize})=>{
		return {
			variables:{
				page,
				pageSize
			}
		};
	},
	props:({data:{loading,refetch,fetchMore,CustomerOrders}})=>{
		let {page,pageSize,hasMore} = CustomerOrders?CustomerOrders:{};
		return {
			customerOrderFetching:loading,
			refetchCustomerOrder:refetch,
			CustomerOrders,
			fetchMoreCustomerOrder:page=>{
				return fetchMore({
					variables:{
						page,
						pageSize
					},
					updateQuery:(previousResult,{fetchMoreResult})=>{
						if(!fetchMoreResult.data)
							return previousResult;
						const result =  Object.assign({},previousResult,{
                            CustomerOrders:Object.assign({},previousResult.CustomerOrders,fetchMoreResult.data.CustomerOrders,{
                                CustomerOrder:[...previousResult.CustomerOrders.CustomerOrder, ...fetchMoreResult.data.CustomerOrders.CustomerOrder]
                            })
                        });
                        return result;
					}
				});
			}
		}
	}
});

const CUSTOMER_ORDER_BY_ID_QUERY = gql`
query CustomerOrderById($id:Int!){
  Order:CustomerOrderById(id:$id){
    id
    OrderNo
    OrderDate
    ShipToName
    ShipToEmail
    ShipToPhoneNo
    ShipToTownship{
      id
      Name1
    }
    ShipToRegion{
      id
      Name1
    }
    ShipToAddress
    createdAt
    TotalQty
    TotalAmount
    OrderDetail{
      id
      Product{
        id
        Name
        DefaultPhotoUrl
      }
      Price
      Qty
      
    }
  }
}
`;

const customerOrderByIdQuery =graphql(CUSTOMER_ORDER_BY_ID_QUERY,{
	options:({orderId})=>{
		return {
			variables:{
				id:orderId
			},
			forceFetch:true
		}
	},
	props:({data:{loading,Order}})=>({loading,Order})
});

const SUBMIT_ORDER_MUTATION=gql`
	mutation createCustomerOrder($order:InputCustomerOrder){
	  CustomerOrder(order:$order){
	    instance{
	      id
	      OrderNo
	      OrderDate
	      createdAt
	      updatedAt
	      Customer{
	      	id
	      	FullName
	      }
	      TotalAmount
	      TotalQty
	      ShipToTownship{
			id
			Name1
	      }
	      ShipToRegion{
	      	id
	      	Name1
	      }
	      ShipToName
	      ShipToPhoneNo
	      ShipToEmail
	      ShipToAddress
	    }
	    errors{
	    	key
	    	message
	    }
	    detail{
	    	instance{
	    		id
	    		Qty
	    		Product{
	    			id
	    			Alias
	    			Name
	    		}
	    		Price
	    	}
	    	errors{
	    		key
	    		message
	    	}
	    }
	    bankTransfer{
	    	instance{
	    		id
		    	TransferDate
		    	Remark
		    	Attachment
		    	AttachmentUrl
	    	}
	    	errors{
	    		key
	    		message
	    	}
	    }
	  }
	}
`;

const createCustomerOrder = graphql(SUBMIT_ORDER_MUTATION,{
	props:({ownProps,mutate})=>{
		return {
			createCustomerOrder:(order)=>{
				return mutate({
					variables:{
						order
					}
				});
			}
		};
	}
});

export {createCustomerOrder,customerOrderFetchQuery,customerOrderByIdQuery};