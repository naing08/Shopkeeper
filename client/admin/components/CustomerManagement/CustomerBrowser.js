import React,{PropTypes} from 'react';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import {graphql,compose} from 'react-apollo';
import CircularProgress from 'material-ui/CircularProgress';
import {white} from 'material-ui/styles/colors';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {propType} from 'graphql-anywhere';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionSearch from 'material-ui/svg-icons/action/search';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {connect} from 'react-redux';
import Paper from 'material-ui/Paper';
import ItemCard from './ItemCard';
import {fetchQuery} from '../../apollo/Customer';
import CreateCustomerDialog from './CreateCustomerDialog';
const InfiniteScroll = require('../../../common/InfiniteScroller')(React);
class Grid extends React.Component{
    render(){
        let {list,loading,loadMore,hasMore,page} = this.props;
        return (
            <InfiniteScroll className="fullheight scrollable row grid" loadMore={loadMore} page={page} hasMore={hasMore} loader={<div className="col-xs-12 row center-xs"><CircularProgress/></div>}>
                {list?list.map((c,i)=>(<ItemCard key={c.id} Customer={c}/>)):null}
            </InfiniteScroll>
        );
    }
}


const AppBar=({muiTheme,search,onSearchChange,onSearchModeChange,isSearchMode,loading,onCreateNew,toggleDrawer})=>{
    let toolBar = <Toolbar style={{height:'64px',backgroundColor:muiTheme.palette.primary1Color}}>
        <ToolbarGroup firstChild={true}>
            <IconButton touch={true} onTouchTap={toggleDrawer}>
                <NavigationMenu color={white} />
            </IconButton>
            <ToolbarTitle style={{color:'#fff'}} text="Manage Customer"/>
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
            <IconButton touch={true} onClick={onCreateNew}>
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

const ThemeableAppBar =compose(
        connect(
            state=>({}),
            dispatch=>({
                toggleDrawer:()=>{
                    dispatch({type:'ADMIN_SITE_NAV_DRAWER_TOGGLE'});
                }
            })
        ),
        muiThemeable()
    )(AppBar);

class CustomerBrowser extends React.Component{
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
        let {Customer,loading,loadMore,page,refetch,pageSize,hasMore,openDialog} = this.props;
        return (
            <div className="layout fullheight">
                <ThemeableAppBar  loading={loading} isSearchMode={this.state.isSearchMode} search={this.state.search} onSearchChange={this.onSearchChange.bind(this)}
                                onCreateNew={()=>{openDialog();}}
                                 onSearchModeChange={(searchMode)=>{this.setState({isSearchMode:searchMode});}} />
                <Grid  list={Customer} hasMore={hasMore} page={page} loadMore={loadMore}  loading={loading}/>
                <CreateCustomerDialog/>
            </div>
        );
    }
}

export default compose(
        connect(
                null,
                (dispatch)=>({
                    openDialog:()=>{dispatch({type:'CUSTOMER_CREATE_DIALOG_OPEN'});}
                })
            ),
		fetchQuery
	)(CustomerBrowser);