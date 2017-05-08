/**
 * Created by ChitSwe on 3/4/17.
 */
import React,{PropTypes} from 'react';
import {red500} from 'material-ui/styles/colors';
import {Card, CardHeader,CardActions} from 'material-ui/Card';
import {graphql,compose} from 'react-apollo';
import CircularProgress from 'material-ui/CircularProgress';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ContentUndo from 'material-ui/svg-icons/content/undo';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import CommunicationKey from 'material-ui/svg-icons/communication/vpn-key';
import FlatButton from 'material-ui/FlatButton';
import {connect}  from 'react-redux';
import EditItemCard from './EditItemCard';
import {reactivateUserAccountMutation} from '../../apollo/UserAccount';




class ItemCard extends React.Component{
    constructor(){
        super(...arguments);
        this.state = {loading:false};
    }
    changeAccount(){
        let {openUserAccountDialog,editUserName,User} = this.props;
        let {UserAccountId,UserName,id} = User;
        editUserName({id:UserAccountId,UserName,EntityId:id,EntityType:'USER'});
        openUserAccountDialog();
    }
    undoDestroy(){
        this.setState({loading:true});
        this.props.reactivateUserAccount(this.props.User.UserAccountId)
            .then(()=>this.setState({loading:false}))
            .catch((error)=>this.setState({loading:false}));
    }
    createAccount(){    
        let {openUserAccountDialog,editUserName,User} = this.props;
        let {id} = User;
        editUserName({EntityId:id,EntityType:'USER'});
        openUserAccountDialog();
    }
    render(){
        let {User,editUserId} = this.props;
        let {id,FullName,deletedAt,ThumbnailUrl,UserName,UserAccountId} = User;
        deletedAt = deletedAt? new  Date(deletedAt): null;
        const loader = this.state.loading?<CircularProgress size={30} thickness={3} style={{verticalAlign:'middle'}}/>:null;
        let cardAction = null
        if(UserAccountId && !UserName)
            cardAction = <CardActions>
                <div style={{display:'inline-block'}} ><ActionDelete style={{verticalAlign:'middle'}} color={red500}/> <span >DEACTIVATED</span></div>
                <FlatButton label={loader? loader : 'Reactivate'} icon={<ContentUndo/>} onClick={this.undoDestroy.bind(this)}/>
            </CardActions>;
        else if(UserAccountId && UserName)
            cardAction = <CardActions>
                            <FlatButton  secondary={true} icon={<EditorModeEdit/>} onClick={()=>{this.props.edit(User)}} label="Edit" />
                            <FlatButton  primary={true} icon={<CommunicationKey/>} onClick={this.changeAccount.bind(this)} label={loader? loader : 'Change Password'}/>
                        </CardActions>;
        else
            cardAction = <CardActions>
                            <FlatButton  secondary={true} icon={<EditorModeEdit/>} onClick={()=>{this.props.edit(User)}} label="Edit" />
                            <FlatButton  primary={true} icon={<CommunicationKey/>} onClick={this.createAccount.bind(this)} label={loader? loader : 'Set Password'}/>
                        </CardActions>;
        const view = id === editUserId?<EditItemCard  />:
            (<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 grid-item" >
                <Card>
                    <CardHeader title={FullName}  avatar={ThumbnailUrl} subtitle={UserName}/>
                    {UserAccountId === 'Admin'? null:cardAction}
                </Card>
            </div>);
        return view;
    }
}



export default compose(
    connect(
        (state)=>({
            editUserId : state.User.edit.id
        }),
        (dispatch)=>({
            edit:(edit)=>{
                dispatch({type:'USER_EDIT',edit});
            },

            editUserName:(edit)=>{
                dispatch({type:'USERNAME_EDIT',edit});
            },
            editPassword:(edit)=>{
                dispatch({type:'PASSWORD_EDIT',edit});
            },
            openUserAccountDialog:()=>{
                dispatch({type:'USER_ACCOUNT_PASSWORD_DIALOG_OPEN'});
            }
        })
    ),
    reactivateUserAccountMutation
)(ItemCard);

