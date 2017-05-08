import React from 'react';
import {Card,CardHeader,CardMedia,CardActions} from 'material-ui/Card';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {productByIdQuery} from '../../apollo/Product';
import Badge from 'material-ui/Badge';
import ContentClear from 'material-ui/svg-icons/content/clear';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import FlatButton from 'material-ui/FlatButton';
import EditQtyPopup from './EditQtyPopup';
class CartItem extends React.Component{
	constructor(){
		super(...arguments);
		this.state={anchorEl:null,isOpenEditQtyPopup:false};
	}
	render(){
		let {ProductById,loadingProductById,index,removeItem,showSnackbar} = this.props;
		let {DefaultPhoto,Alias,Name,Price} = ProductById?ProductById:this.props;
		let {Qty} = this.props;

		return (
		<div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 grid-item" >
			<Card>

				<CardHeader title={Name} subtitle={Alias} avatar={<Badge badgeContent={Qty} secondary={true} badgeStyle={{top:0,left:0,width:"40px",height:"40px",fontSize:"12pt"}} style={{padding:"24px 25px 0px 12px"}}/>}/>
				<CardMedia overlay={<CardHeader title={Price}/>}>
					<img  src={DefaultPhoto? DefaultPhoto.url:null} />
				</CardMedia>
				<CardActions>
				    <FlatButton  label="Edit Qty" onClick={(e)=>{e.preventDefault();this.setState({anchorEl:e.currentTarget,isOpenEditQtyPopup:true});}} icon={<EditorModeEdit />}/>
				    <FlatButton  label="Remove"  onClick={e=>{removeItem(index);showSnackbar("Item has been removed from cart.");}} icon={ <ContentClear />}/>
				</CardActions>
			</Card>
			<EditQtyPopup open ={this.state.isOpenEditQtyPopup} closeMe={()=>{this.setState({isOpenEditQtyPopup:false})}} index={index} anchorEl={this.state.anchorEl}/>
		</div>);
	}
}

export default compose(		
		connect(
			state=>({}),
			dispatch=>({
				removeItem:index=>{
					dispatch({type:'PRODUCT_CART_REMOVE_ITEM',index});
				},
				showSnackbar:(message)=>{
					dispatch({type:'SITE_SNACKBAR_OPEN',message})
				}
			})
			),
		productByIdQuery
	)(CartItem);

