import React from 'react';
import Accounting from 'accounting';
class DetailCard extends React.Component{
	render(){
		let {orderDetail} = this.props;
		let {Product,Price,Qty} = orderDetail? orderDetail:{};
		let {Name,DefaultPhotoUrl} = Product? Product:{};

		return (
				<div className="row detail-item" >
					<img style={{width:'75px',height:'75px'}}  src={DefaultPhotoUrl} />
					<div className="col-xs row detail-product">
						<div className='col-xs-12 detail-product-name'>
							{Name}
						</div>
						<div className="row between-xs around-sm col-xs-12  detail-product-numbers">
							<div className="detail-product-price" >
								{Accounting.formatMoney(Price)}
							</div>
							<div className="detail-product-qty">
								{Qty}
							</div>
							<div className="detail-product-subtotal">
								{Accounting.formatMoney(Qty * Price)}
							</div>
						</div>
					</div>
				</div>
			);
	}
}

export default DetailCard;