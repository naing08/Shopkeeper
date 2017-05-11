import React from 'react';
import {Card,CardHeader,CardText,CardActions} from 'material-ui/Card';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ProductPriceItemEditor from './ProductPriceItemEditor';
import FlatButton from 'material-ui/FlatButton';
import {saveProductPrice,createNewPriceBook} from '../../apollo/Product';
import LoadingIndicator from '../../../common/LoadingIndicator';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

class ProductPriceEditor extends React.Component{
	constructor(){
		super(...arguments);
		this.state={
			busy:false,
			busyMessage:'',
			errorText:'',
			isOpenNewPriceBookDialog:false,
			priceBookName:'',
			priceBookErrorText:'Price book name is required'
		};
	}
 	mutate(){
 		let {items,ProductId,saveProductPrice}=this.props;
 		items = items.map(({Price,id})=>({Price,id}));
 		this.setState({busy:true,busyMessage:'Saving product price.',errorText:''});
 		saveProductPrice(ProductId,items)
 		.then((result)=>{
 			this.setState({busy:false,busyMessage:'',errorText:''});
 		}).catch(error=>{
 			this.setState({busy:false,busyMessage:'',errorText:error.message});
 		})

 	}
 	createNewPriceBook(){
 		let {createNewPriceBook,ProductId,addNew} = this.props;
 		let {priceBookName,priceBookErrorText} = this.state;
 		if(!priceBookErrorText){
 			createNewPriceBook(ProductId,priceBookName).then(result=>{
 				let {data} = result? result: {};
 				let productPrice = data.createNewPriceBook;
 				if(productPrice)
 					addNew(productPrice);
 				this.setState({isOpenNewPriceBookDialog:false,priceBookName:'',priceBookErrorText:'Price book name is required.'});
 			});
 		}
 	}
	render(){
		let {items,style} = this.props;
		let {busy,busyMessage,errorText,isOpenNewPriceBookDialog,priceBookName,priceBookErrorText} = this.state;
		return (
				<div style={style}>
					<Card>
						<CardHeader title="Price List"/>
						<CardText>
							<div className="row">
								{
									items? items.map((item,index)=>{

										let {PriceBookName,Price,id,errors} = item;
										return (<ProductPriceItemEditor index={index} key={index} PriceBookName={PriceBookName} id={id} Price={Price} errors={errors}/>);
									}): null
								}
							</div>
						</CardText>
						<LoadingIndicator loading={busy} loadingMessage={busyMessage} errorText={errorText}/>
						<CardActions>
							<FlatButton label="Save" onClick={this.mutate.bind(this)} primary={true}/>
							<FlatButton label ="New Price Book" onClick={e=>{this.setState({isOpenNewPriceBookDialog:true});}}  primary={true}/>
						</CardActions>
					</Card>
					<Dialog
						contentStyle={{width:'304px'}}
						title="New Price Book"
						open={isOpenNewPriceBookDialog}
						actions={[
								<FlatButton label="OK" onClick={this.createNewPriceBook.bind(this)} primary={true} />,
								<FlatButton label="Cancel" onClick={e=>{this.setState({isOpenNewPriceBookDialog:false});}} primary={true} />
							]}
					>
						<TextField id="PriceBookName" floatingLabelText="Price Book Name" hintText="Price Book Name" name="PriceBookName" ref="PriceBookName" value={priceBookName} errorText={priceBookErrorText} 
							onChange={e=>{
									let value = e.target.value;
									if(value)
										this.setState({priceBookName:value,priceBookErrorText:''});
									else
										this.setState({priceBookName:value,priceBookErrorText:'Price book name is required.'});
								}
							}
						/>
					</Dialog>
				</div>
			);
	}
}

export default compose(
		saveProductPrice,
		createNewPriceBook,
		connect(
				state=>({items:state.Product.price}),
				dispatch=>({
					addNew:(productPrice)=>{
						dispatch({type:'PRODUCT_PRICE_ADD',productPrice});
					},
					showSnackbar:(message)=>{
		                dispatch({
		                    type:'ADMIN_SITE_SNACKBAR_OPEN',
		                    message
		                })
		            }
				})
			)
	)(ProductPriceEditor);