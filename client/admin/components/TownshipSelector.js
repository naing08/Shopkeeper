import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {compose} from 'react-apollo';
import townshipQuery from '../apollo/Township';

class TownshipSelector extends React.Component{
	render(){
		let {Township,townshipLoading,onChange,value,selectFieldProps} = this.props;
		Township=Township? Township:[];
		return (<SelectField 
					value={value} 
					onChange={
						(e,index,value)=>{
							onChange(value,Township[index].Name1);
						}
					}
					{...selectFieldProps}
				>
					{
						Township? Township.map(({id,Name1,Name2},index)=>(<MenuItem value={id} primaryText={Name1} key={index}/>)):null
					}
				</SelectField>);
	}
}
export default compose(
		townshipQuery
	)(TownshipSelector);
