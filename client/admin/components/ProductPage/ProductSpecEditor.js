import React from 'react';
import {Card,CardHeader,CardText,CardActions} from 'material-ui/Card';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ProductSpecItemEditor from './ProductSpecItemEditor';
import FlatButton from 'material-ui/FlatButton';
import {saveProductSpecifications} from '../../apollo/Product';
import LoadingIndicator from '../../../common/LoadingIndicator';
class ProductSpecEditor extends React.Component{
	constructor(){
		super(...arguments);
		this.state={
			busy:false,
			busyMessage:'',
			errorText:''
		};
	}
 	mutate(){
 		let {items,ProductId,saveProductSpecifications,setProductSpec}=this.props;
 		items = items.map(({Value,Name})=>({Value,Name}));
 		this.setState({busy:true,busyMessage:'Saving product specifications.',errorText:''});
 		saveProductSpecifications(ProductId,items)
 		.then((result)=>{
 			let {data} = result? result : {};
 			let {saveProductSpec} = data? data : {};
 			this.setState({busy:false,busyMessage:'',errorText:''});
 			if(saveProductSpec){
	 			items = saveProductSpec.map(({instance:{id,Name,Value},errors})=>({id,Name,Value,errors:errors? errors: {}}));
	 			setProductSpec(items);
 			}


 		}).catch(error=>{
 			this.setState({busy:false,busyMessage:'',errorText:error.message});
 		})

 	}
	render(){
		let {items,style,createNew} = this.props;
		let {busy,busyMessage,errorText} = this.state;
		return (
				<div style={style}>
					<Card>
						<CardHeader title="Specifications"/>
						<CardText>
							{
								items? items.map((item,index)=>{

									let {Name,Value,id,errors} = item;
									return (<ProductSpecItemEditor index={index} key={index} Name={Name} id={id} Value={Value} errors={errors}/>);
								}): null
							}
						</CardText>
						<LoadingIndicator loading={busy} loadingMessage={busyMessage} errorText={errorText}/>
						<CardActions>
							<FlatButton label="Save" onClick={this.mutate.bind(this)} primary={true}/>
							<FlatButton label ="Add" onClick={createNew} primary={true}/>
						</CardActions>
					</Card>
				</div>
			);
	}
}

export default compose(
		saveProductSpecifications,
		connect(
				state=>({items:state.Product.spec}),
				dispatch=>({
					createNew:()=>{
						dispatch({type:'PRODUCT_SPEC_ADD'});
					},
					setProductSpec:(items)=>{
						dispatch({type:'PRODUCT_SPEC_SET',spec:items});
					},
					showSnackbar:(message)=>{
		                dispatch({
		                    type:'ADMIN_SITE_SNACKBAR_OPEN',
		                    message
		                })
		            }
				})
			)
	)(ProductSpecEditor);