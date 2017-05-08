/**
 * Created by ChitSwe on 1/21/17.
 */
import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
class Test extends React.Component{
    constructor(){
        super(...arguments);
        this.state={
            searchText:''
        };
    }
    handleUpdateInput(searchText){
        this.setState({searchText});
        this.props.data.refetch({search:searchText});
    }
    handleNewRequest(request,index){
        console.log(request);
    }
    render(){
        
        return (
            <div>
               
            </div>
        );
    }
}

const QUERY = gql`
query queryProductBrand($search:String){
    ProductBrands:ProductBrand(page:1,pageSize:10,search:$search){
        ProductBrand{
            id
            Alias
            Name
            Photo
        }    
    }
}
`;

export default graphql(QUERY)(Test);