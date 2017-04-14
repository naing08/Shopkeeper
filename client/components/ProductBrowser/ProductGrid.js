/**
 * Created by ChitSwe on 1/22/17.
 */

import React,{PropTypes} from "react";
import {Link,withRouter} from 'react-router';
import {graphql} from 'react-apollo';
import CircularProgress from 'material-ui/CircularProgress';
import ProductItemCard from './ProductItemCard';
const InfiniteScroll = require('../../common/InfiniteScroller')(React);
import query from '../../../common/apollo/Product/index';
class ProductGrid extends React.Component{


    render (){
        let {loading,loadMore,page,hasMore,Product,className,style} =this.props;

        return (
            <InfiniteScroll className={`scrollable row grid ${className}`}  style = {style} loadMore={loadMore} page={page} hasMore={hasMore} loader={<div className="col-xs-12 row center-xs"><CircularProgress/></div>}>
                {
                    Product?
                        Product.map((p,i)=>(
                            <ProductItemCard {...p} Product={p} key={p.id}/>
                        )):
                        null
                }
            </InfiniteScroll>
        );
    }
}
export default query(ProductGrid);