import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ActionSearch from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';
import {white} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import muiThemeable from 'material-ui/styles/muiThemeable';
import IconButton from 'material-ui/IconButton';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import React from 'react';
const AppBar=({muiTheme,search,onSearchChange,onSearchModeChange,isSearchMode,title,toggleDrawer})=>{
	let toolBar = <Toolbar style={{height:'64px',backgroundColor:muiTheme.palette.primary1Color}}>
			        <ToolbarGroup firstChild={true}>
			            <IconButton touch={true} onClick={toggleDrawer}>
			                <NavigationMenu color={white} />
			            </IconButton>
			            <ToolbarTitle style={{color:'#fff'}} text={title}/>
			           
			        </ToolbarGroup>
			        
			        <ToolbarGroup lastChild={true}>
			            <IconButton touch={true} onClick={()=>{onSearchModeChange(true);}}>
			                <ActionSearch color={white} />
			            </IconButton>
			        </ToolbarGroup>
			    </Toolbar>;
			    let searchBar = <Toolbar style={{height:'64px'}}>
			        <ToolbarGroup style={{width:'100%'}} firstChild={true}>
			            <IconButton touch={true} onClick={()=>{onSearchModeChange(false)}}>
			                <NavigationArrowBack/>
			            </IconButton>
			            <TextField id="searchbox" hintText="Enter search" onChange={(e)=>{onSearchChange(e.target.value)}} value={search} style={{width:'100%'}}/>
			        </ToolbarGroup>
			    </Toolbar>;
			    return (
			        <Paper zDepth={3} style={{zIndex:1}}>
			            {isSearchMode? searchBar:toolBar}
			        </Paper>
			    );
			};

	export default  compose(
		connect(
			state=>{
				let {search,isSearchMode} = state.ProductBrowser;
				return {search,isSearchMode};
			},
			dispatch=>({
				onSearchModeChange:mode=>{
					if(mode)
						dispatch({type:'PRODUCT_BROWSER_SHOW_SEARCH'});
					else
						dispatch({type:'PRODUCT_BROWSER_HIDE_SEARCH'});
				},
				onSearchChange:search=>{
					dispatch({type:'PRODUCT_BROWSER_SEARCH',search});
				},
				toggleDrawer:()=>{
					dispatch({type:'SITE_NAV_DRAWER_TOGGLE'});
				}
			})
			),
			muiThemeable()
		)(AppBar);
	