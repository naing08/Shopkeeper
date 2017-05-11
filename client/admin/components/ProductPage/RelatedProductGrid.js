import React,{PropTypes} from "react";
import {Link,withRouter} from 'react-router';
import ProductItemCard from './ProductItemCard';
import {Card,CardHeader,CardActions,CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {searchProductByKeyWord,addRelatedProduct} from '../../apollo/Product';
import AutoComplete from '../../../common/AutoComplete';
class RelatedProductGrid extends React.Component{
    constructor(){
        super(...arguments);
        this.state={
            productId:null,
            productSearchText:'',
            selectedProduct:null
        };
    }

    queryDataForAutoComplete(searchText){
        let {searchProductByKeyWord,limit} = this.props;
        this.setState({productSearchText:searchText,selectedProduct:null});
        searchProductByKeyWord(`%${searchText}%`,limit);
    }
    addRelatedProduct(){
        let {addRelatedProductInStore,addRelatedProduct,ProductId}  = this.props;
        let {selectedProduct,productId} = this.state;
        if(selectedProduct){
            addRelatedProduct(ProductId,productId).then(
                result=>{
                        let {data} = result;
                        let {RelatedProductId} = data? data: {};
                        if(RelatedProductId){
                            addRelatedProductInStore(selectedProduct);
                        }
                    }
                )
        }
    }

    render (){
        let {Product,style,searchProductByKeyWord,productSearchResult,searchingProductByKeyWord,ProductId} =this.props;
        productSearchResult = productSearchResult? productSearchResult: [];
        let {productSearchText,productId} = this.state;
        const dataSourceConfig = {
            text: 'Alias',
            value: 'id',
            secondaryText:'Name',
            avator:'DefaultPhotoUrl'
        };
        return (
            <Card style = {style}>
                <CardHeader title="Related Products"/>
                    <CardText>
                        <div className="row"  >
                            {
                                Product?
                                    Product.map((p,i)=>(
                                        <ProductItemCard {...p} Product={p} key={p.id} index={i} ProductId={ProductId}/>
                                    )):
                                    null
                            }
                        </div>
                    </CardText>
                <CardActions>
                    <AutoComplete
                        hintText="Search products"
                        floatingLabelText="Search products"
                        searchText={productSearchText}
                        onUpdateInput={this.queryDataForAutoComplete.bind(this)}
                        onNewRequest={(item)=>{this.setState({productId:item?item.id:null,productSearchText:item? item.Alias:'',selectedProduct:item});}}
                        dataSource={productSearchResult}
                        dataSourceConfig={dataSourceConfig}
                        filter={AutoComplete.noFilter}
                        openOnFocus={true}
                        loading={searchingProductByKeyWord}
                        id="relatedProductSearchBox"
                        name="relatedProductSearchBox"
                        targetOrigin={{vertical:'bottom',horizontal:'left'}}
                        anchorOrigin={{vertical:'top',horizontal:'left'}}
                        popoverProps={{style:{height:'300px',width:'300px'}}}
                        menuStyle={{width:'100%'}}
                    />
                    <FlatButton label="Add" onClick={this.addRelatedProduct.bind(this)} primary={true}/>
                </CardActions>
            </Card>
        );
    }
}

const TheComponent =  compose(
        connect(
            state=>({Product:state.Product.relatedProducts}),
            dispatch=>({
                addRelatedProductInStore:relatedProduct=>{
                    dispatch({type:'PRODUCT_RELATED_PRODUCT_ADD',relatedProduct})
                }
            })
            ),
        searchProductByKeyWord,
        addRelatedProduct
    )(RelatedProductGrid);

export default (props)=>{
    return (<TheComponent limit={10} keyWord="" {...props}/>);
}