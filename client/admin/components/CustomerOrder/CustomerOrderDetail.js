import React from 'react';
import {Card,CardHeader,CardMedia} from 'material-ui/Card'
import Badge from 'material-ui/Badge';
class CustomerOrderDetail extends React.Component{
	render(){
		let {OrderDetail} = this.props;
		let {Product,Qty,Price} = OrderDetail? OrderDetail: {};
		let {Name,Alias,DefaultPhoto} = Product? Product:{};
		return (
				<div className="grid-item col-lg-3 col-md-4 col-sm-6 col-xs-12">
					<Card>

						<CardHeader title={Name} subtitle={Alias} avatar={<Badge badgeContent={Qty} secondary={true} badgeStyle={{top:0,left:0,width:"40px",height:"40px",fontSize:"12pt"}} style={{padding:"24px 25px 0px 12px"}}/>}/>
						<CardMedia overlay={<CardHeader title={Price}/>}>
							<img  src={DefaultPhoto? DefaultPhoto.url:null} />
						</CardMedia>
					</Card>
				</div>
			);
	}
}

export default CustomerOrderDetail;