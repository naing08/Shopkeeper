import React from 'react';
import ProductGeneralInfoEditor from './ProductGeneralInfoEditor';
import {initialData} from  '../../reducer/Product';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
class CreateProductPage extends React.Component{
	render(){
		return (<ProductGeneralInfoEditor/>);
	}
}

export default compose(
    connect(
        (state)=>({}),
        (dispatch)=>({
            edit:(edit)=>{
                dispatch({
                    type:'PRODUCT_EDIT',
                    edit
                });
            }
        })
    )
)(CreateProductPage);