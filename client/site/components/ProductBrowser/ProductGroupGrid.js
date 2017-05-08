import React from 'react';
import productGroupQuery from '../../apollo/ProductGroup';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import ProductGroupCard from './ProductGroupCard';

class ProductGroupGrid extends React.Component{
	render(){
		let {loading,ProductGroup,refetch} = this.props;

		return(
			<div>
				{ProductGroup && ProductGroup.length>0? <h3>Product Category</h3>:null}
				<div className="row">
					{
					    ProductGroup? ProductGroup.map(group=>(<ProductGroupCard key={group.id} ProductGroup = {group}/>)): null
					}
				</div>
			</div>
			);
	}
}

export default compose(		
		productGroupQuery
	)(ProductGroupGrid);