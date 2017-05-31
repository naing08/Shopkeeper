import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const QUERY = gql`
	query BankAccount{
		BankAccount(enabled:true){
			id
			Name
			AccountNo
		}
	}
`;

const query = graphql(QUERY,{
	props:({data:{loading,BankAccount}})=>{
		return {
			bankAccountLoading:loading,
			BankAccount
		};
	}
});

export default query;