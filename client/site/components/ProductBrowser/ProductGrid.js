import React from 'react';
import productQuery from '../../apollo/Product';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import ProductCard from './ProductCard';
import FlatButton from 'material-ui/FlatButton';

class ProductGrid extends React.Component{
	render(){
		let {loading,loadMore,page,hasMore,Product} = this.props;
		return (
				<div>
					{Product && Product.length>0? <h3>Product</h3>:null}
					<div className="row">
						{
							Product? Product.map(p=>(<ProductCard key={p.id} Product={p}/>)):null
						}
					</div>
					<div style={{justifyContent:'center',alignItems:'center'}} className="row">
						{hasMore? <FlatButton style={{margin:'0 auto'}} label="More" onClick={()=>{loadMore(page+1);}}/>:null}
					</div>
				</div>
			);
	}
}



const TheComponent= compose(
		connect(
			state=>({search:state.ProductBrowser.search}),
			dispatch=>({})
			),
		productQuery
	)(ProductGrid);

export default (props)=>{
	return (<TheComponent {...props} page={1}/>);
}