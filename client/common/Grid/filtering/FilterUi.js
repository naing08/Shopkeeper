import React,{PropTypes} from 'react';
import DataTypes from './DataTypes';
import FilterOperator from './FilterOperator';
import OperatorSelector from './OperatorSelector';
class FilterUi extends React.Component{
	onOperatorChanged(operator){

	}
	render(){
		
		return (
			<div>
				<OperatorSelector dataType={this.props.dataType} value={this.props.selectedOperator} onChange={this.onOperatorChanged.bind(this)}/>
			</div>
			);
	}
}
FilterUi.PropTypes = {
	dataType:PropTypes.oneOf([DataTypes.TypeDate,DataTypes.TypeString,DataTypes.TypeNumber,DataTypes.TypeBoolean]),
	selectedOperator:PropTypes.instanceOf(FilterOperator),
	selectedValue:PropTypes.object
}