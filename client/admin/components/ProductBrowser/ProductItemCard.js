/**
 * Created by ChitSwe on 1/22/17.
 */
import React,{PropTypes} from "react";
import {Link,withRouter} from 'react-router';
import {red500} from 'material-ui/styles/colors';
import {Card,CardActions} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ContentUndo from 'material-ui/svg-icons/content/undo';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import {destroyQuery,undoDestroyQuery} from '../../apollo/Product';
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
        let {Alias,Name,Thumbnail,DefaultPhotoUrl,id,deletedAt,Product,router} = this.props;
        deletedAt = deletedAt? new  Date(deletedAt): null;
        const loader = this.state.loading?<CircularProgress size={30} thickness={3} style={{verticalAlign:'middle'}}/>:null;
        const cardAction = deletedAt?
            <CardActions>
                <div style={{display:'inline-block'}} ><ActionDelete style={{verticalAlign:'middle'}} color={red500}/> <span >{deletedAt.timeAgo()}</span></div>
                <FlatButton label={loader? loader : 'Undo'} icon={<ContentUndo/>} onClick={this.undoDestroy.bind(this)}/>
            </CardActions>
            :
            <CardActions>
                <FlatButton  secondary={true} icon={<EditorModeEdit/>} onClick={()=>{router.push(`/admin/ProductDetail/${id}`)}} label="Edit" />
                <FlatButton  primary={true} icon={<ContentClear/>} onClick={this.destroy.bind(this)} label={loader? loader : 'Delete'}/>
            </CardActions>;

        return (<div className=" col-lg-3 col-md-4 col-sm-6 col-xs-12 grid-item" >
                <Card>
                    
                    <div className="row" style={{flexWrap:'nowrap'}}>
                        <img style={{width:"100px",height:'100px',flexShrink:'0'    }} src={DefaultPhotoUrl} />
                        <div style={{padding:'10px'}}>
                            <div><span>{Name}</span></div>
                            <div><span>{Alias}</span></div>
                        </div>
                    </div>
                    {cardAction}
                </Card>
            </div>);
    }
}




export default compose(
    withRouter,
    destroyQuery,
    undoDestroyQuery
)(ProductItemCard);