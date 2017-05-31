import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const QUERY = gql`
	query Township($regionId:Int!){
		Township(regionId:$regionId){
			id
			Name1
			Name2
		}
	}
`;

const query = graphql(QUERY,{
	options:({regionId})=>{
		return {
			variables:{
				regionId
			}
		}
	},
	props:({data:{loading,Township}})=>{
		return {
			townShipLoading:loading,
			Township
		};
	},
	skip:({regionId})=>!regionId
});

export default query;