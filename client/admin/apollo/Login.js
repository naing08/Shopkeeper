import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {default as immutableUpdate} from 'react-addons-update';

const LOGIN_MUTATION = gql`mutation Login($UserName:String!,$Password:String!,$Remember:Boolean!){
	Login(username:$UserName,password:$Password,remember:$Remember){
		success
		message
		access_token
		user_id
		user_name
		account_type
	}
}

`;

const loginMutation = graphql(LOGIN_MUTATION,{
	props:({ownProps,mutate})=>{
		return {
			login:({UserName,Password,Remember})=>{
				return mutate({variables:{UserName,Password,Remember}});
			}
		}
	}
});

export {loginMutation}