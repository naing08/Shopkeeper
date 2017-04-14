/**
 * Created by ChitSwe on 1/24/17.
 */
import React,{PropTypes} from 'react';
import ProductSpecItem from './ProductSpecItem';
import {productSpecInitialData} from '../../../common/apollo/reducer/Product'
import {connect} from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
class ProductSpecGrid extends React.Component{
    render(){
        let {ProductSpecs,ProductId,specErrors} = this.props;
        specErrors = specErrors? specErrors:[];
        return (
            <div className=" row grid" style={{position:'relative'}}>
                {
                    ProductSpecs.map((item,index)=>(
                        <ProductSpecItem {...item} key={index} index={index} errors={typeof specErrors[index] === 'undefined'?[]:specErrors[index]} />
                    ))
                }
                <FloatingActionButton  mini={false} onClick={()=>{this.props.create(ProductId)}} style={{position:'absolute',bottom:10,right:10}}>
                    <ContentAdd/>
                </FloatingActionButton>
            </div>
        );
    }
}

ProductSpecGrid.propTypes = {
    ProductSpecs:PropTypes.arrayOf(
        PropTypes.shape({
            Name:PropTypes.string,
            Value:PropTypes.string,
            id:PropTypes.number,
            error:PropTypes.arrayOf(PropTypes.shape({
                key:PropTypes.string,
                message:PropTypes.string
            }))
        })
    )
};

export default
connect(
    ()=>({}),
    (dispatch)=>({
        create:(ProductId)=>{
            dispatch({
                type:'PRODUCT_SPEC_EDIT',
                edit:Object.assign(productSpecInitialData,{ProductId})
            });
        }
    })
)
(ProductSpecGrid);