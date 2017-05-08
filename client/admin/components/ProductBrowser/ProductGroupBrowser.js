/**
 * Created by ChitSwe on 1/22/17.
 */
import React,{PropTypes} from "react";
import {Link,withRouter} from 'react-router';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {default as GroupItemCard} from './ProductGroupItemCard';
import {query,fragments} from '../../apollo/ProductGroup';

class GroupBrowser extends React.Component{
    render (){
        let {ProductGroup,className,style,parentGroupId} = this.props;
        return (
            <div className='scrollable grid' style={style}>
                {
                    ProductGroup.map((p,i)=>(<GroupItemCard {...p} ParentGroupId={parentGroupId} key = {p.id}/>))
                }
            </div>
        );
    }
}

const GROUP_QUERY = gql`
query productGroupQuery($parentGroupId:Int){
  ProductGroup(parentGroupId:$parentGroupId,returnEmpty:false){
    ...ProductGroupItem
  }
}
${fragments.ProductGroup}
`;

const GroupBrowserWithData = query(GroupBrowser);

export default GroupBrowserWithData;