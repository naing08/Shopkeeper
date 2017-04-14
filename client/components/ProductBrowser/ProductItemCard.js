/**
 * Created by ChitSwe on 1/22/17.
 */
import React,{PropTypes} from "react";
import {Link,withRouter} from 'react-router';
import {red500} from 'material-ui/styles/colors';
import {Card, CardHeader,CardActions,CardMedia} from 'material-ui/Card';
import {graphql} from 'react-apollo';
import CircularProgress from 'material-ui/CircularProgress';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ContentUndo from 'material-ui/svg-icons/content/undo';
import ProductEditItemCard from './ProductEditItemCard';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import {destroyQuery,undoDestroyQuery} from '../../../common/apollo/Product/index';
import {compose} from 'react-apollo';

class ProductItemCard extends React.Component{
    constructor(){
        super(...arguments);
        this.state={loading:false};
    }
    destroy(){
        this.setState({loading:true});
        this.props.destroy(this.props.id)
            .then(()=>this.setState({loading:false}))
            .catch((error)=>this.setState({loading:false}));
    }
    undoDestroy(){
        this.setState({loading:true});
        this.props.undoDestroy(this.props.id)
            .then(()=>this.setState({loading:false}))
            .catch((error)=>this.setState({loading:false}));
    }
    render(){
        let {Alias,Name,Thumbnail,DefaultPhoto,id,deletedAt,Product} = this.props;

        let ThumbnailUrl = Thumbnail? Thumbnail.url:'';
        let DefaultPhotoUrl = DefaultPhoto? DefaultPhoto.url:'';
        deletedAt = deletedAt? new  Date(deletedAt): null;
        const loader = this.state.loading?<CircularProgress size={30} thickness={3} style={{verticalAlign:'middle'}}/>:null;
        const cardAction = deletedAt?
            <CardActions>
                <div style={{display:'inline-block'}} ><ActionDelete style={{verticalAlign:'middle'}} color={red500}/> <span >{deletedAt.timeAgo()}</span></div>
                <FlatButton label={loader? loader : 'Undo'} icon={<ContentUndo/>} onClick={this.undoDestroy.bind(this)}/>
            </CardActions>
            :
            <CardActions>
                <FlatButton  secondary={true} icon={<EditorModeEdit/>} onClick={()=>{this.setState({isEditMode:true});}} label="Edit" />
                <FlatButton  primary={true} icon={<ContentClear/>} onClick={this.destroy.bind(this)} label={loader? loader : 'Delete'}/>
            </CardActions>;

        const view = this.state.isEditMode?<ProductEditItemCard  onCancelEdit={()=>{this.setState({isEditMode:false});}} Product={Product}/>:
            (<div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 grid-item" >
                <Card>
                    <CardHeader title={Alias} subtitle={Name} avatar={ThumbnailUrl}/>
                    <CardMedia
                    >
                        <img src={DefaultPhotoUrl} />
                    </CardMedia>
                    {cardAction}
                </Card>
            </div>);
        return view;
    }
}




export default compose(
    destroyQuery,
    undoDestroyQuery
)(ProductItemCard);