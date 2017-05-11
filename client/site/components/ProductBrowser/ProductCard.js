import React from 'react';
import {Card} from 'material-ui/Card';
import {withRouter} from 'react-router';
class ProductCard extends React.Component{
	render(){
		let {Product,router} = this.props;
		let {Alias,Name,DefaultPhoto,Price,id} = Product;
		return (
				<div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 grid-item" >
					<a href="#" onClick={(e)=>{e.preventDefault();router.push(`/Product/${id}`)}} style={{textDecoration:"none"}}>
						<Card>
							<div className="row" style={{flexWrap:'nowrap'}}>
								<img style={{width:"100px",height:'100px',flexShrink:'0'	}} src={DefaultPhoto? DefaultPhoto.url:null} />
								<div style={{padding:'10px'}}>
									<div><span>{Name}</span></div>
									<div><span>{Alias}</span></div>
									<div><span>{Price}</span></div>
								</div>
							</div>
						</Card>
					</a>
				</div>
			);
	}
}

export default withRouter(ProductCard);