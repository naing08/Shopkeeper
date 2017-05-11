import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {deleteProductSpecification} from '../../apollo/Product';
class ProductSpecItemEditor extends React.Component{

	removeProductSpec(){
		let {id,remove,deleteProductSpecification,index} = this.props;
		if(id){
			deleteProductSpecification(id).then(()=>{
				remove(index);
			});
		}else
			remove(index);
	}

	render(){
		let {Name,Value,errors,edit,index,remove} = this.props;
		return (
				<div className="row center-xs middle-xs around-xs">
					<TextField style={{width:'300px'}} value={Name} hintText="Spec Name" floatingLabelText="Spec Name" name="Name" errorText={errors.Name} onChange={e=>{edit({Name:e.target.value},index);}}/>
					<TextField style={{width:'300px'}} value={Value} hintText = "Spec Value" floatingLabelText="Spec Value" name="Value" errorText={errors.Value} onChange={e=>{edit({Value:e.target.value},index);}}/>
					<IconButton tooltip="Remove" onTouchTap={this.removeProductSpec.bind(this)}>
						<ContentClear/>
					</IconButton>
				</div>
			);
	}
}

export default compose(
		connect(
				state=>({}),
				dispatch=>({
					edit:(edit,index)=>{
						dispatch({type:'PRODUCT_SPEC_EDIT',edit,index});
					},
					remove:(index)=>{
						dispatch({type:'PRODUCT_SPEC_DESTROY',index});
					}
				})
			),
		deleteProductSpecification
	)(ProductSpecItemEditor);