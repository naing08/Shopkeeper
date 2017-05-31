import React,{PropTypes} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DataTypes from './DataTypes';
import FilterOperator from './FilterOperator';
// import TypeBoolean from './TypeBoolean';
// import TypeDate from './TypeDate';
// import TypeNumber from './TypeNumber';
// import TypeString from './TypeString';


class OperatorSelector extends React.Component{
	onChange(event,index,value){
		this.props.onChange(value);
	}
	render(){
		return (
				<SelectField style={this.props.style} menuStyle={{overflow:'hidden'}} autoWidth={true} value={this.props.value} onChange={this.onChange.bind(this)}>
					{
						this.props.dataType?
						this.props.dataType.getFilterOperators().map(op=>(
							<MenuItem key={op.getName()} value={op} primaryText={op.getName()}></MenuItem>
							))
						:null
					}
				</SelectField>
			);
	}
}

OperatorSelector.PropTypes={
	dataType:PropTypes.oneOf([
			DataTypes.TypeDate,
			DataTypes.TypeString,
			DataTypes.TypeNumber,
			DataTypes.TypeBoolean
		]),
	value:PropTypes.instanceOf(FilterOperator),
	onChange:PropTypes.func,
	style:PropTypes.object
}

export default OperatorSelector;
