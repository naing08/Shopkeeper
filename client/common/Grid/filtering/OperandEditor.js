import React,{PropTypes} from 'react';
import ops from './FilterOperators';
import FilterOperator from './FilterOperator';
import DataTypes from './DataTypes';
import DatePicker from '../../editor/DatePicker';
import DateRangePicker from '../../editor/DateRangePicker';
import NumberRangeEditor from '../../editor/NumberRangeEditor';
import TextEditor from '../../editor/TextEditor';
import NumberEditor from '../../editor/NumberEditor';
import TextListEditor from '../../editor/TextListEditor';
import NumberListEditor from '../../editor/NumberListEditor';

class OperandEditor extends React.Component{
	constructor(){
		super(...arguments);
		
		this.state={dateRange:null,numberRange:null,text:'',date:null,number:null,textList:[],numberList:[]};
	}
	getRangeEditor(){
		let editor = null;
		let value = null;
		if(!(this.props.value instanceof Date) && typeof this.props.value ==='object')
			value = this.props.value;
		if(this.props.operator == ops.Between || this.props.operator == ops.NotBetween){
			if(this.props.dataType == DataTypes.TypeDate){				
				editor  = <DateRangePicker wrapperStyle={this.props.style} name="dateRange" value={value} onChange={x=>{ this.props.onChange(x);}}/>;
			}else if(this.props.dataType == DataTypes.TypeNumber){
				editor = <NumberRangeEditor wrapperStyle={this.props.style}  name="numberRange" value={value} onChange={x=>{this.props.onChange(x);}}/>;
			}
		}
		return editor;
	}
	getSimpleEditor(){
		let editor = null;
		let value=null;
		if(this.props.value instanceof Date)
			value = this.props.value;
		else if(typeof this.props.value !='object' && !Array.isArray(this.props.value))
			value = this.props.value;
		if(this.props.operator==ops.Equal ||
			this.props.operator==ops.NotEqual||
			this.props.operator==ops.GreaterThan||
			this.props.operator == ops.GreaterThanOrEqual||
			this.props.operator == ops.LessThan||
			this.props.operator == ops.LessThanOrEqual||
			this.props.operator==ops.Contain||
			this.props.operator==ops.StartWith||
			this.props.operator == ops.EndWith||
			this.props.operator==ops.NotContains||
			this.props.operator==ops.NotStartWith||
			this.props.operator==ops.NotEndWith){
			if(this.props.dataType==DataTypes.TypeString){
				value = value == null ? '' : value;
				editor=<TextEditor style={this.props.style} name="textEditor" value={value} onChange={x=>{this.props.onChange(x);}}/>;
			}else if(this.props.dataType==DataTypes.TypeDate){
				editor = <DatePicker textFieldStyle={this.props.style} name="datePicker" value={value} onChange={(e,v)=>{this.props.onChange(v);}}/>;
			}else if(this.props.dataType==DataTypes.TypeNumber){
				editor= <NumberEditor style={this.props.style} name="numberEditor" value={value} onChange={x=>{this.props.onChange(x);}}/>;
			}
		}
		return editor;
	}
	getListEditor(){
		let editor = null;
		let value = null;
		if(Array.isArray(this.props.value))
			value = this.props.value
		if(this.props.operator == ops.In ||
			this.props.operator == ops.NotIn){
			if(this.props.dataType == DataTypes.TypeNumber){
				editor = <NumberListEditor wrapperStyle={this.props.style} name="numberListEditor" value = {value} onChange={x=>{this.props.onChange(x);}}/>;
			}else if(this.props.dataType == DataTypes.TypeString){
				editor = <TextListEditor wrapperStyle={this.props.style} name="textListEditor" value = {value} onChange={x=>{this.props.onChange(x);}}/>;
			}
		}
		return editor;
	}
	render(){
		let editor = this.getSimpleEditor();
		editor  = editor == null? this.getRangeEditor():editor;
		editor = editor == null ? this.getListEditor() :editor;		
		return editor;
	}
}
OperandEditor.PropTypes={
	operator:PropTypes.instanceOf(FilterOperator),
	dataType:PropTypes.oneOf([
			DataTypes.TypeDate,
			DataTypes.TypeString,
			DataTypes.TypeNumber,
			DataTypes.TypeBoolean
		]),
	onChange:PropTypes.func,
	value:PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool,
			PropTypes.number,
			PropTypes.arrayOf(PropTypes.number),
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.shape({
				from:PropTypes.oneOfType([
						PropTypes.number,
						PropTypes.instanceOf(Date)
					]),
				to:PropTypes.oneOfType([
						PropTypes.number,
						PropTypes.instanceOf(Date)
					])
			})
		])
};

export default OperandEditor;