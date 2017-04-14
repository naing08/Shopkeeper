/**
 * Created by ChitSwe on 1/21/17.
 */
import React from 'react';
import AutoComplete from './components/private/AutoComplete';
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
        let {data:{loading,ProductBrands:{ProductBrand}}} =this.props;
        const dataSourceConfig = {
            text: 'Alias',
            value: 'id',
            secondaryText:'Name',
            avator:'Photo'
        };
        return (
            <div>
                <AutoComplete
                    hintText="Product Brand"
                    searchText={this.state.searchText}
                    onUpdateInput={this.handleUpdateInput.bind(this)}
                    onNewRequest={this.handleNewRequest.bind(this)}
                    dataSource={ProductBrand}
                    dataSourceConfig={dataSourceConfig}
                    filter={AutoComplete.noFilter}
                    openOnFocus={true}
                    loading={loading}
                />
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