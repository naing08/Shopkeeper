import React, { PropTypes } from 'react';
import OperatorSelector from './OperatorSelector';
import OperandEditor from './OperandEditor';
import FilterOperator from './FilterOperator';
import DataTypes from './DataTypes';

class GridColumnFilter extends React.Component {
    constructor() {
        super(...arguments);
    }
    onOperatorChange(operator) {
        this.props.onChange({ operator: operator, operand: this.props.value?this.props.value.operand:null });
    }
    onOperandValueChange(value){
    	this.props.onChange({operator:this.props.value?this.props.value.operator:null,operand:value});
    }
    render() {
    	let styles = {
    		wrapper:{
    			display:'flex',
    			flexWrap:'wrap'
    		},
    		selector:{
				width:'100%'
    		},
    		editor:{
    			width:'100%'
    		}
    	};
        return (<div style={styles.wrapper}>
			<OperatorSelector style={styles.selector} value={this.props.value?this.props.value.operator:null} dataType={this.props.dataType} onChange={this.onOperatorChange.bind(this)}/>
			<OperandEditor value={this.props.value?this.props.value.operand:null}  operator={this.props.value?this.props.value.operator:null}  dataType={this.props.dataType} onChange={this.onOperandValueChange.bind(this)}/>
		</div>);
    }
}

GridColumnFilter.PropTypes = {
    value: PropTypes.shape({
        operator: PropTypes.instanceOf(FilterOperator),
        operand:PropTypes.object
    }),
    dataType: DataTypes.PropTypes
}

export default GridColumnFilter;
