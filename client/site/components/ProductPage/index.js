import React from 'react';
import {Card, CardHeader,CardMedia,CardText,CardTitle} from 'material-ui/Card';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import {compose} from 'react-apollo';
import {productByIdQuery} from '../../apollo/Product';
import AppBar from './AppBar';
import Fab from './Fab';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Accounting from 'accounting';
import Carousel from './Carousel';
import ProductCard from '../ProductBrowser/ProductCard';
class ProductPage extends React.Component{
	
	componentDidMount(){
		let {ProductById,cartItems,id} = this.props;
		let title = ProductById? ProductById.Name:"Product";
		window.setTitle(title);
	}
	
	
	componentDidUpdate(prevProps){
		let prev = prevProps.ProductById? prevProps.ProductById:null;
		let {ProductById} = this.props;
		let title = "Product";
		if(prev!==ProductById ){
			let {Name} = ProductById? ProductById:{};
			title = Name;
		}
		window.setTitle(title);
	}
	render(){
		let {ProductById} =  this.props;
		let {DefaultPhoto,Alias,Name,Description,Photo,ProductSpec,id,Price,RelatedProducts} = ProductById? ProductById:{};
		

		return (
			<div className="layout fullheight">
				<AppBar title={Name}/>
				<div className="fullheight scrollable">
					<div style={{padding:'5px'}}>
						<Card >
							<div className="row">
								<Carousel Photo={Photo}	className="col-md-6 col-xs-12"/>
								<div className="col-md-6 col-xs-12">
									<CardTitle title={Name} subtitle={Alias}>
										<div className="row">
											<span className="text-price" style={{flex:1}}>{Accounting.formatMoney(Price)}</span>
											<FloatingActionButton  mini={true} secondary={true}>
												<ActionFavoriteBorder/>
											</FloatingActionButton>
										</div>
									</CardTitle>

									<CardText className="">
										{Description}
									</CardText>
								</div>
							</div>
						</Card>
					</div>
					<div style={{padding:'5px'}}>
						<Card>
							<CardTitle title="Specifications"/>
							<CardText>
								<ul>
									{ProductSpec? ProductSpec.map(p=>(<li key={p.id}>{`${p.Name} ${p.Value}`}</li>)):null}
								</ul>
							</CardText>
						</Card>
					</div>
					<div style={{padding:'5px'}}>
						<Card>
							<CardTitle title="Related Products"/>
							<CardText>
								<div className="row">
									{RelatedProducts? RelatedProducts.map(p=>(<ProductCard key={p.id} Product={p}/>)):null}
								</div>
							</CardText>
						</Card>
					</div>
					<Fab id={id} ProductById={ProductById}/>
				</div>
			</div>
			);
	}
}

const ThePage = compose(
		productByIdQuery
	)(ProductPage);

export default ({params})=>{
	let {id} = params? params:{};
	return (<ThePage id={id}/>);
}