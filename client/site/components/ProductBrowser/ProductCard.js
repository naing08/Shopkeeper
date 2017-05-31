import React from 'react';
import {Card} from 'material-ui/Card';
import {withRouter} from 'react-router';
import Accounting from 'accounting';
class ProductCard extends React.Component{
	render(){
		let {Product,router} = this.props;
		let {Alias,Name,DefaultPhotoUrl,Price,id} = Product;
		return (
				<div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 grid-item" >
					<a href="#" onClick={(e)=>{e.preventDefault();router.push(`/Product/${id}`)}} style={{textDecoration:"none"}}>
						<Card>
							<div className="row" style={{flexWrap:'nowrap',padding:'16px'}}>
								<img style={{width:"100px",height:'100px',flexShrink:'0'	}} src={DefaultPhotoUrl} />
								<div style={{padding:'0 16px'}}>
									<div><span className="text-title">{Name}</span></div>
									<div><span className="text-subtitle">{Alias}</span></div>
									<div><span className="text-price">{Accounting.formatMoney(Price)}</span></div>
								</div>
							</div>
						</Card>
					</a>
				</div>
			);
	}
}

export default withRouter(ProductCard);