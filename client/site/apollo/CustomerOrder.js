import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';

const SUBMIT_ORDER_MUTATION=gql`
	mutation createOrder($order:InputCustomerOrder){
		CustomerOrder(order:$order){
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
	}
`;