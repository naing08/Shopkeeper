import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {white} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import muiThemeable from 'material-ui/styles/muiThemeable';
import IconButton from 'material-ui/IconButton';
import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';

const AppBar=({muiTheme,title,toggleDrawer,router})=>{
	let toolBar = <Toolbar style={{height:'64px',backgroundColor:muiTheme.palette.primary1Color}}>
			        <ToolbarGroup firstChild={true}>
			        	<IconButton touch={true} onTouchTap={toggleDrawer}>
			                <NavigationMenu color={white} />
			            </IconButton>
			            <IconButton touch={true} onTouchTap={()=>{router.goBack();}}>
			                <NavigationArrowBack color={white} />
			            </IconButton>
			            <ToolbarTitle style={{color:'#fff'}} text={title}/>
			        </ToolbarGroup>
			        
			        <ToolbarGroup lastChild={true}>
			            
			        </ToolbarGroup>
			    </Toolbar>;
			    
			    return (
			        <Paper zDepth={3} style={{zIndex:1}}>
			            {toolBar}
			        </Paper>
			    );
			};

export default compose(
		connect(
			state=>({}),
			dispatch=>({
				toggleDrawer:()=>{
					dispatch({type:'SITE_NAV_DRAWER_TOGGLE'});
				}
			})
		),
		muiThemeable(),
		withRouter
	)(AppBar);