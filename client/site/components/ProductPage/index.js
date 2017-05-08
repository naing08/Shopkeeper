import React from 'react';
import {Card, CardHeader,CardMedia,CardText,CardTitle} from 'material-ui/Card';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import {compose} from 'react-apollo';
import {productByIdQuery} from '../../apollo/Product';
import AppBar from './AppBar';
import Fab from './Fab';
import FloatingActionButton from 'material-ui/FloatingActionButton';

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
		let {DefaultPhoto,Alias,Name,Description,Photo,ProductSpec,id} = ProductById? ProductById:{};
		

		return (
			<div className="layout fullheight">
				<AppBar title={Name}/>
				<div className="fullheight scrollable">
					<div style={{padding:'5px'}}>
						<Card>
							<CardMedia style={{position:'relative'}} overlay={<CardTitle title={Name} subtitle={Alias}>
								<FloatingActionButton style={{position:'absolute',right:'20px',bottom:'-15px'}} mini={true} secondary={true}>
									<ActionFavoriteBorder/>
								</FloatingActionButton>
							</CardTitle>}>
								<img src={DefaultPhoto? DefaultPhoto.url:null}/>
							</CardMedia>
							
							<CardText className="">
								{Description}
							</CardText>
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