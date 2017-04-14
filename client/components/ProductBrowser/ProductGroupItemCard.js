/**
 * Created by ChitSwe on 1/22/17.
 */
import React,{PropTypes} from "react";
import {Link,withRouter} from 'react-router';
import {graphql} from 'react-apollo';
import CircularProgress from 'material-ui/CircularProgress';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentClear from 'material-ui/svg-icons/content/clear';
import FlatButton from 'material-ui/FlatButton';
import {destroyQuery} from '../../../common/apollo/ProductGroup';
import {CardHeader,CardActions} from 'material-ui/Card';
import EditProductGroupDialog from './EditProductGroupDialog';

class GroupItemCard extends React.Component{
    constructor(){
        super(...arguments);
        this.state = {
            isEditMode:false,
            loading:false
        };
    }
    destroy(){
        this.setState({loading:true});
        this.props.destroy(this.props.id)
            .catch((error)=>this.setState({loading:false}));
    }
    render(){
        let {Alias,Name,Photo,id,ParentGroupId} = this.props;
        const loader = this.state.loading?<CircularProgress size={30} thickness={3} style={{verticalAlign:'middle'}}/>:null;
        return  (
            <div className="product-group-grid-item">
                {this.state.isEditMode?<EditProductGroupDialog isEditMode={true} isOpen={this.state.isEditMode} onCancelEdit={()=>{this.setState({isEditMode:false});}} Alias={Alias} Name={Name} Photo={Photo} id={id} ParentGroupId={ParentGroupId} dialogCaption="Edit Product Group"/>:false}
                <Link className={` link ${id==ParentGroupId? "active":null}`} to={`/admin/Product/${id}`} >
                    <CardHeader title={Alias} subtitle={Name} avatar={Photo}/>
                </Link>
                <CardActions>
                    <FlatButton  secondary={true} icon={<EditorModeEdit/>} onClick={()=>{this.setState({isEditMode:true});}} label="Edit" />
                    <FlatButton  primary={true} icon={<ContentClear/>} onClick={this.destroy.bind(this)} label={loader? loader : 'Delete'}/>
                </CardActions>
            </div>
        );
    }
}



export default destroyQuery(GroupItemCard);