/**
 * Created by ChitSwe on 3/4/17.
 */

import ItemCard from './ItemCard';
import React,{PropTypes} from 'react';
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import {graphql,compose} from 'react-apollo';
import CircularProgress from 'material-ui/CircularProgress';
import {white} from 'material-ui/styles/colors';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {propType} from 'graphql-anywhere';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionSearch from 'material-ui/svg-icons/action/search';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {fragments as UserFragment,fetchQuery}   from '../../apollo/User';
import {connect} from 'react-redux';
import Paper from 'material-ui/Paper';
import CreateItemCard from './CreateItemCard';
import UserAccountDialog from './UserAccountDialog';
const InfiniteScroll = require('../../../common/InfiniteScroller')(React);
class Grid extends React.Component{
    render(){
        let {list,loading,loadMore,hasMore,page,createItemCard} = this.props;
        return (
            <InfiniteScroll className="fullheight scrollable row grid" loadMore={loadMore} page={page} hasMore={hasMore} loader={<div className="col-xs-12 row center-xs"><CircularProgress/></div>}>
                {createItemCard}
                {list?list.map((u,i)=>(<ItemCard key={u.id} User={u}/>)):null}
            </InfiniteScroll>
        );
    }
}

const AppBar=({muiTheme,search,onSearchChange,onSearchModeChange,isSearchMode,loading,onCreateNew})=>{
    let toolBar = <Toolbar style={{height:'64px',backgroundColor:muiTheme.palette.primary1Color}}>
        <ToolbarGroup firstChild={true}>
            <IconButton touch={true}>
                <NavigationMenu color={white} />
            </IconButton>
            <ToolbarTitle style={{color:'#fff'}} text="Manage User"/>
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
            <IconButton touch={true} onClick={()=>{onCreateNew();}}>
                <ContentAdd color={white}/>
            </IconButton>
            <IconButton touch={true} onClick={()=>{onSearchModeChange(true);}}>
                <ActionSearch color={white} />
            </IconButton>
            {loading? <CircularProgress />:null}
        </ToolbarGroup>
    </Toolbar>;
    let searchBar = <Toolbar style={{height:'64px'}}>
        <ToolbarGroup style={{width:'100%'}} firstChild={true}>
            <IconButton touch={true} onClick={()=>{onSearchModeChange(false)}}>
                <NavigationArrowBack/>
            </IconButton>
            <TextField id="searchbox" hintText="Enter search" onChange={(e)=>{onSearchChange(e.target.value)}} value={search} style={{width:'100%'}}/>
            {loading? <CircularProgress />:null}
        </ToolbarGroup>
    </Toolbar>;
    return (
        <Paper zDepth={5}>
            {isSearchMode? searchBar:toolBar}
        </Paper>
    );
};

const ThemeableAppBar = muiThemeable()(AppBar);

class UserBrowser extends React.Component{
    constructor(){
        super(...arguments);
        this.state={
            isSearchMode:false,
            search:''
        };
    }

    onSearchChange(search){
        this.setState({search:search});
        this.props.refetch({search,page:1,pageSize:this.props.pageSize});
    }

    render(){
        let {User,loading,loadMore,page,refetch,pageSize,hasMore} = this.props;
        const newCard = this.props.createNew? <CreateItemCard />: null;
        return (
            <div className="layout fullheight">
                <ThemeableAppBar onCreateNew={()=>{this.props.showCreateItemCard();}} loading={loading} isSearchMode={this.state.isSearchMode} search={this.state.search} onSearchChange={this.onSearchChange.bind(this)}
                                 onSearchModeChange={(searchMode)=>{this.setState({isSearchMode:searchMode});}} />
                <Grid createItemCard={newCard} list={User} hasMore={hasMore} page={page} loadMore={loadMore}  loading={loading}/>
                <UserAccountDialog/>
            </div>
        );
    }
}

UserBrowser.PropTypes={
    loading:PropTypes.bool,
    User:PropTypes.arrayOf(propType(UserFragment.User).isRequired),
    loadMore:PropTypes.func,
    page:PropTypes.number,
    pageSize:PropTypes.number,
    hasMore:PropTypes.bool,
    refetch:PropTypes.func
};


export default compose(
    connect(
        state=>({createNew:state.User.creating}),
        dispatch=>({
            showCreateItemCard:()=>{
                dispatch({type:'USER_CREATE_CARD_SHOW'});
            },
            hideCreateItemCard:()=>{
                dispatch({type:'USER_CREATE_CARD_HIDE'});
            }
        })
        ),
    fetchQuery
)(UserBrowser);