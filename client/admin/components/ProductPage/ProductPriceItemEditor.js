import React from 'react';
import CurrencyEditor from '../../../common/CurrencyEditor';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';

class ProductPriceItemEditor extends React.Component{
	render(){
		let {id,PriceBookName,Price,errors,index,editPrice} = this.props;
		return (
				<div style={{padding:'10px'}}>
					<CurrencyEditor hintText={PriceBookName} value={Price} floatingLabelText={PriceBookName} name={PriceBookName} id={PriceBookName} errorText={errors.Price} onChange={price=>{editPrice(index,{Price:price});}} />
				</div>
			);
	}
}

export default compose(
		connect(
			state=>({}),
			dispatch=>({
				editPrice:(index,edit)=>{
					dispatch({
						type:'PRODUCT_PRICE_EDIT',
						edit,
						index
					});
				}
			})
			)
	)(ProductPriceItemEditor);