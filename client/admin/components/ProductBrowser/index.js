/**
 * Created by ChitSwe on 1/11/17.
 */

import React,{PropTypes} from "react";
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import ActionSearch from 'material-ui/svg-icons/action/search';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import ActionHome from 'material-ui/svg-icons/action/home';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import {white} from 'material-ui/styles/colors';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {graphql} from 'react-apollo';
import CircularProgress from 'material-ui/CircularProgress';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FlatButton from 'material-ui/FlatButton';
import NewFolder from 'material-ui/svg-icons/file/create-new-folder';
import ProductGroupBrowser from './ProductGroupBrowser';
import ProductGrid from './ProductGrid';
import EditProductGroupDialog from './EditProductGroupDialog';
import {pathToProductGroup} from '../../apollo/ProductGroup';
import CreateProductDialog from './CreateProductDialog';
import {initialData} from '../../reducer/Product';
import {withRouter} from 'react-router';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';


const AppBar=({router,muiTheme,search,onSearchChange,onSearchModeChange,groupId,isSearchMode,loading,PathToProductGroup,onCreateNew,onCreateNewGroup,toggleDrawer})=>{
    const groupPathBtnStyle = {
        margin:0,
        height:'100%',
        direction:'ltr'
    };
    let toolBar = <Toolbar style={{height:'64px',backgroundColor:muiTheme.palette.primary1Color}}>
        <ToolbarGroup firstChild={true}>
            <IconButton touch={true} onClick={toggleDrawer}>
                <NavigationMenu color={white} />
            </IconButton>
            <ToolbarTitle style={{color:'#fff'}} text="Product List"/>
            <IconButton touch={true} onClick={()=>{router.push('/admin/Product');}}>
                <ActionHome color={white}/>
            </IconButton>

        </ToolbarGroup>
            <ToolbarGroup style={{left: '230px', right: '100px',  height: '64px',position:'absolute'}}>
                <div style={{ whiteSpace: 'nowrap',overflowX:'hidden',direction: 'rtl',height:'100%'}}>
                    {
                        !(loading && PathToProductGroup && PathToProductGroup.length === 1)&& groupId && PathToProductGroup? PathToProductGroup.map(({Alias,id},i)=>(<FlatButton key={id} style={groupPathBtnStyle}  onClick={()=>{router.push(`/admin/Product/${id}`)}} labelStyle={{color:white}} label={Alias} icon={<NavigationChevronRight/>} secondary={true}/>)):null
                    }
                </div>
            </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
            <IconButton touch={true} onClick={()=>{onCreateNewGroup();}}>
                <NewFolder color={white}/>
            </IconButton>
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
        <Paper zDepth={3} style={{zIndex:1}}>
            {isSearchMode? searchBar:toolBar}
        </Paper>
    );
};


const AppBarWithData = pathToProductGroup(withRouter(AppBar));

const ThemeableAppBar = compose(
        connect(
            state=>({}),
            dispatch=>({
                toggleDrawer:()=>{
                    dispatch({type:'ADMIN_SITE_NAV_DRAWER_TOGGLE'});
                }
            })
        ),
        muiThemeable()
    )(AppBarWithData);

class ProductBrowser extends React.Component{
    constructor(){
        super(...arguments);
        this.state = {
            isSearchMode:false,
            search:'',
            createNewGroup:false,
            createNew:false
        };
    }
    onSearchChange(search){
        this.setState({search:search});
    }
 
    createNewProduct(){
        let {params:{id},editProduct} = this.props;
        editProduct(initialData);
        editProduct({ProductGroupId:id});
        this.setState({createNew:true});
    }


    render(){
        let {params:{id},editProduct} = this.props;
        const gProps = {
            parentGroupId:id
        };
        const pProps = {
            parentGroupId:id,
            search: this.state.search,
            page:1
        };
        return (
            <div className="layout fullheight">
                {this.state.createNewGroup?<EditProductGroupDialog isEditMode = {false} isOpen={this.state.createNewGroup} onCancelEdit={()=>{this.setState({createNewGroup:false});}} dialogCaption="New Product Group." ParentGroupId={id}/>:false}
                <ThemeableAppBar groupId={id} onCreateNew={()=>{this.setState({createNew:true})}} onCreateNewGroup={()=>{this.setState({createNewGroup:true});}}  isSearchMode={this.state.isSearchMode} search={this.state.search} onSearchChange={this.onSearchChange.bind(this)}
                                 onSearchModeChange={(searchMode)=>{this.setState({isSearchMode:searchMode});}} />
                <div className="fullheight" style={{display:'flex',flexDirection:'row'}}>
                    <ProductGroupBrowser {...gProps} className="fullheight scrollable" style={{width:'300px' ,overflowX:'hidden',flexShrink:0}}/>
                    <ProductGrid {...pProps} className="fullheight" style={{width:'100%'}}/>
                </div>
                <CreateProductDialog open={this.state.createNew} onRequestClose={()=>{editProduct(initialData);this.setState({createNew:false});}}/>
            </div>
        );
    }
}

export default compose(
    connect(
        (state)=>({}),
        (dispatch)=>({
            editProduct:(edit)=>{
                dispatch({
                    type:'PRODUCT_EDIT',
                    edit
                });
            }
        })
    )
)(ProductBrowser);
