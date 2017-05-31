import React from 'react';
import {Card, CardHeader} from 'material-ui/Card';
import {compose} from 'react-apollo';
import {withRouter} from 'react-router';
class ProductGroupCard extends React.Component{
	browseTo(){
		let {router,ProductGroup} = this.props;
		let {id} = ProductGroup;
		router.push(`/ProductBrowser/${id}`);
	}
	render(){
		let {ProductGroup} = this.props;
		let {Alias,Name,Photo} = ProductGroup;
		return (
				<div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 grid-item" >
					<a href='#' onClick={e=>{e.preventDefault();this.browseTo();}}>
						<Card>
							<CardHeader title={Name} subtitle={Alias} avatar={<img src={Photo} style={{width:"100px",height:'100px',flexShrink:'0'	}}/>}></CardHeader>
						</Card>
					</a>
				</div>
			);
	}
}

export default compose(
		withRouter
	)(ProductGroupCard);