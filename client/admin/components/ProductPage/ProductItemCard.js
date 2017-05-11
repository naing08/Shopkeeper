/**
 * Created by ChitSwe on 1/22/17.
 */
import React,{PropTypes} from "react";
import {red500} from 'material-ui/styles/colors';
import {Card,CardActions} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {removeRelatedProduct} from '../../apollo/Product';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import ContentClear from 'material-ui/svg-icons/content/clear';

class ProductItemCard extends React.Component{
    constructor(){
        super(...arguments);
    }
    destroy(){
        let {removeRelatedProduct,removeRelatedProductInStore,index,id,ProductId,relatedProductEdit} = this.props;
        relatedProductEdit(index,{loading:true});
        removeRelatedProduct(ProductId,id).then(
                ()=>{
                    removeRelatedProductInStore(index);
                }
            ).catch(error=>{
                relatedProductEdit({loading:false});
            });
    }
    render(){
        let {Alias,Name,Thumbnail,DefaultPhotoUrl,id,deletedAt,loading} = this.props;
        deletedAt = deletedAt? new  Date(deletedAt): null;
        const loader = loading?<CircularProgress size={30} thickness={3} style={{verticalAlign:'middle'}}/>:null;
        const cardAction = deletedAt?
            <CardActions>
                <div style={{display:'inline-block'}} ><ActionDelete style={{verticalAlign:'middle'}} color={red500}/> <span >{deletedAt.timeAgo()}</span></div>
                <FlatButton label={loader? loader : 'Undo'} icon={<ContentUndo/>} onClick={this.undoDestroy.bind(this)}/>
            </CardActions>
            :
            <CardActions>
                <FlatButton  primary={true} icon={<ContentClear/>} onClick={this.destroy.bind(this)} label={loader? loader: 'Remove'}/>
            </CardActions>;

        return (<div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 grid-item" >
                    <div className="row" style={{flexWrap:'nowrap'}}>
                        <img style={{width:"100px",height:'100px',flexShrink:'0'    }} src={DefaultPhotoUrl} />
                        <div style={{padding:'10px'}}>
                            <div><span>{Name}</span></div>
                            <div><span>{Alias}</span></div>
                        </div>
                    </div>
                    {cardAction}
                </div>);
    }
}




export default compose(
    removeRelatedProduct,
    connect(
        state=>({}),
        dispatch=>({
            removeRelatedProductInStore:index=>{
                dispatch({
                    type:'PRODUCT_RELATED_PRODUCT_REMOVE',
                    index
                });
            },
            relatedProductEdit:(index,edit)=>{
                dispatch({
                    type:'PRODUCT_RELATED_PRODUCT_EDIT',
                    index,
                    edit
                });
            }
        })
        )
)(ProductItemCard);