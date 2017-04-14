/**
 * Created by ChitSwe on 2/7/17.
 */
import React,{PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import AutoComplete from '../private/AutoComplete';
import CurrencyEditor from '../private/CurrencyEditor';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {productBrandListQuery} from '../../../common/apollo/ProductBrand';
import {initialData} from '../../../common/apollo/reducer/Product';
class ProductGeneralInfoEditor extends React.Component{




    render(){
        let {product} = this.props;
        product = product? product: Object.assign({},initialData);
        let {Name,Price,Description,Alias,errors,id,Photo,brandSearchText} = product;
        let {productBrandList,searchProduct,brandListLoading} = this.props;
        let ProductBrand = productBrandList? productBrandList.ProductBrand:[];
        const dataSourceConfig = {
            text: 'Alias',
            value: 'id',
            secondaryText:'Name',
            avator:'Photo'
        };
        return (
            <div className="row" style={{backgroundColor:'#fff',textAlign:'center'}}>
                <div style={{padding:'20px 0',flexGrow:1}}>
                    <TextField hintText="Alias" ref="Alias" floatingLabelText="Alias" errorText={errors.Alias} value={Alias} onChange={(e)=>{this.props.edit({Alias:e.target.value});}}/>
                    <br/>
                    <TextField hintText="Name" ref="Name" floatingLabelText="Name" value={Name} errorText={errors.Name} onChange={(e)=>{this.props.edit({Name:e.target.value});}}/>
                    <br/>
                    <CurrencyEditor hintText="Price" floatingLabelText="Price" name="Price" value={Price} errorText={errors.Price} onChange={x=>{this.props.edit({Price:x});}}/>
                    <br/>
                    <AutoComplete
                        hintText="Product Brand"
                        floatingLabelText="Product Brand"
                        searchText={brandSearchText}
                        onUpdateInput={(searchText)=>{this.props.edit({brandSearchText:searchText});searchProduct(searchText)}}
                        onNewRequest={(item)=>{this.props.edit({ProductBrandId:item?item.id:null,brandSearchText:item? `${item.Alias}-${item.Name}`:''});}}
                        dataSource={ProductBrand}
                        dataSourceConfig={dataSourceConfig}
                        filter={AutoComplete.noFilter}
                        openOnFocus={true}
                        loading={brandListLoading}
                    />
                </div>
                <div style={{flexGrow:1}}>
                    <TextField style={{width:'300px',textAlign:'left'}} hintText="Description" multiLine={true} rows={5} floatingLabelText="Description" errorText={errors.Description} value={Description} onChange={(e)=>{this.props.edit({Description:e.target.value});}}/>
                </div>
            </div>
        );
    }

}



export default compose(
    productBrandListQuery,
    connect(
        (state)=>({product:state.Product.edit}),
        (dispatch)=>({
            edit:(edit)=>{
                dispatch({
                    type:'PRODUCT_EDIT',
                    edit
                });
            }
        })
    )
)(ProductGeneralInfoEditor);

