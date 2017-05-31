import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

const QUERY = gql`
	query Region{
		Region{
			id
			Name1
			Name2
		}
	}
`;

const query = graphql(QUERY,{
	props:({data:{loading,Region}})=>{
		return {
			regionLoading:loading,
			Region
		};
	}
});

export default query;