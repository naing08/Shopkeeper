
/**
 * Created by ChitSwe on 1/2/17.
 */
import React,{PropTypes} from 'react';
import {Toolbar,ToolbarGroup,ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import {graphql,compose} from 'react-apollo';
import CircularProgress from 'material-ui/CircularProgress';
import ContentClear from 'material-ui/svg-icons/content/clear';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionSearch from 'material-ui/svg-icons/action/search';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import Dropzone from 'react-dropzone';
import PhotoManager from '../../../../common/PhotoManager';
import {connect}  from 'react-redux';
import {red500,white} from 'material-ui/styles/colors';
import {Card, CardHeader,CardActions} from 'material-ui/Card';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ContentUndo from 'material-ui/svg-icons/content/undo';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { propType } from 'graphql-anywhere';
import Paper from 'material-ui/Paper';

import {query as fetchQuery,create as createQuery,destroy as destroyQuery,undoDestroy as undoDestroyQuery,update as updateQuery,fragments as queryFragments} from '../../apollo/ProductBrand';

const InfiniteScroll = require('../../../common/InfiniteScroller')(React);

const AppBar=({muiTheme,search,onSearchChange,onSearchModeChange,isSearchMode,loading,onCreateNew})=>{
    let toolBar = <Toolbar style={{height:'64px',backgroundColor:muiTheme.palette.primary1Color}}>
        <ToolbarGroup firstChild={true}>
            <IconButton touch={true}>
                <NavigationMenu color={white} />
            </IconButton>
            <ToolbarTitle style={{color:'#fff'}} text="Product Brand"/>
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

class EditItemCard extends React.Component{

    constructor(){
        super(...arguments);
        this.state = {loading:false,loadingMessage:'',imagePath:this.props.ProductBrand.Photo};
    }

    componentDidMount(){
        this.props.edit(Object.assign({},this.props.ProductBrand,{errors:{}}));
    }

    onImageDrop(files){
        this.props.edit({Photo:files[0].preview});
        this.handleImageUpload(files[0]);
    }
    handleImageUpload(file) {
        this.setState({loading:true,loadingMessage:'Uploading photo ...'});
        PhotoManager.ProductBrand.upload(file)
            .then(({secure_url,format,public_id})=>{
                this.props.edit({Photo:public_id,PhotoFormat:format});
                this.setState({loading:false,loadingMessage:'',imagePath:secure_url});
                this.mutate(false);
            }).catch((error)=>{
                this.setState({loading:false,loadingMessage:'', errorText:error});
            });
    }



    mutate(closeAfter=true){
        let {Alias,Name,id,Photo,PhotoFormat}=this.props.ProductBrandEdit;
        this.setState({loading:true,loadingMessage:'Saving data...',errorText:''});
        this.props.mutate({variables:{Alias,Name,id,Photo,PhotoFormat}})
            .then(({data:{productBrandMutate:{instance,errors}}})=>{
                if(errors && errors.length>0){
                    const errs = {};
                    errors.every((error)=>{
                        if(error.key)
                            errs[error.key] = error.message;
                        else
                            this.props.edit({errorText:error.message});
                        return true;
                    });
                    this.setState({loading:false});
                    this.props.edit({errors:errs});
                }else{
                    this.setState({loading:false,loadingMessage:''});
                    if(closeAfter)
                        this.props.onCancelEdit();
                }
            });
    }

    render(){
        let {onCancelEdit} = this.props;
        let {Alias,Name,errorText,errors} = this.props.ProductBrandEdit;
        let {loading,loadingMessage,imagePath} = this.state;
        return (
            <div className="col-xs-12 row center-xs" style={{padding:"20px 0"}}>
                <div className="layout col-xs-12 col-sm-8 col-md-6 col-md-6 paper-5">
                    <Toolbar style={{height:'64px',backgroundColor:'#fff',borderBottom:'1px solid #e3e3e3'}}>
                        <ToolbarGroup firstChild={true}>
                            <IconButton touch={true} onClick={onCancelEdit}>
                                <ContentClear />
                            </IconButton>
                            <ToolbarTitle text={ Name}/>
                        </ToolbarGroup>
                        <ToolbarGroup lastChild={true}>
                            <IconButton touch={true} onClick={this.mutate.bind(this)}>
                                <NavigationCheck />
                            </IconButton>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="row" style={{backgroundColor:'#fff'}}>
                        <Dropzone
                            multiple={false}
                            accept="image/*"
                            onDrop={this.onImageDrop.bind(this)}>
                            <div>Drop an image or click to select a file to upload.</div>
                            <img style={{width:'150px',height:'150px'}} src={imagePath}/>
                        </Dropzone>
                        <div style={{padding:'20px 0',flexGrow:1}}>
                            <TextField hintText="Alias" ref="Alias" floatingLabelText="Alias" errorText={errors.Alias} value={Alias} onChange={(e)=>{this.props.edit({Alias:e.target.value});}}/>
                            <br/>
                            <TextField hintText="Name" ref="Name" floatingLabelText="Name" value={Name} errorText={errors.Name} onChange={(e)=>{this.props.edit({Name:e.target.value});}}/>
                        </div>
                    </div>
                    <div className="row" style={{height:'64px', paddingTop:'12px',paddingLeft:'12px'}}>
                        {loading ? <CircularProgress/> : null} {loading ? <div style={{padding:'10px'}}>{loadingMessage}</div> : null} <div style={{padding:'10px',color:'red'}}>{loading? '': errorText}</div>
                    </div>
                </div>
            </div>
        );
    }
}



const EditItemCardWithData =compose(
    updateQuery,
    connect(
        (state)=>{
            return {ProductBrandEdit:state.ProductBrand.edit}
        },
        (dispatch)=>(
            {
                edit:(edit)=>{
                    dispatch({
                        type:'PRODUCT_BRAND_EDIT',
                        edit
                    });
                }
            }
        )
    )
)(EditItemCard);

class ItemCard extends React.Component{
    constructor(){
        super(...arguments);
        this.state={isEditMode:false,loading:false};
    }
    destroy(){
        this.setState({loading:true});
        this.props.destroy(this.props.ProductBrand.id)
            .then(()=>this.setState({loading:false}))
            .catch((error)=>this.setState({loading:false}));
    }
    undoDestroy(){
        this.setState({loading:true});
        this.props.undoDestroy(this.props.ProductBrand.id)
            .then(()=>this.setState({loading:false}))
            .catch((error)=>this.setState({loading:false}));
    }
    render(){
        const ProductBrand = this.props.ProductBrand;
        const deletedAt = ProductBrand.deletedAt? new  Date(ProductBrand.deletedAt): null;
        const loader = this.state.loading?<CircularProgress size={30} thickness={3} style={{verticalAlign:'middle'}}/>:null;
        const cardAction = ProductBrand.deletedAt?
            <CardActions>
                <div style={{display:'inline-block'}} ><ActionDelete style={{verticalAlign:'middle'}} color={red500}/> <span >{deletedAt.timeAgo()}</span></div>
                <FlatButton label={loader? loader : 'Undo'} icon={<ContentUndo/>} onClick={this.undoDestroy.bind(this)}/>
            </CardActions>
            :
            <CardActions>
                <FlatButton  secondary={true} icon={<EditorModeEdit/>} onClick={()=>{this.setState({isEditMode:true});}} label="Edit" />
                <FlatButton  primary={true} icon={<ContentClear/>} onClick={this.destroy.bind(this)} label={loader? loader : 'Delete'}/>
            </CardActions>;
        let {Alias,Name,Photo} = ProductBrand;
        const view = this.state.isEditMode?<EditItemCardWithData onCancelEdit={()=>{this.setState({isEditMode:false});}} ProductBrand={ProductBrand}/>:
            (<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 grid-item" >
                <Card>
                    <CardHeader title={Alias} subtitle={Name} avatar={Photo}/>
                    {cardAction}
                </Card>
            </div>);
        return view;
    }
}



const ItemCardWithData= compose(
    destroyQuery,
    undoDestroyQuery
)(ItemCard);

class CreateItemCard extends React.Component{

    constructor(){
        super(...arguments);
        this.state = {loading:false,loadingMessage:'',imagePath:''};
    }

    componentDidMount(){
        this.props.edit({errors:{},Alias:'',id:null,Name:'',Photo:'',PhotoFormat:''});
    }

    onImageDrop(files){
        this.setState({
            imagePath: files[0].preview
        });

        this.handleImageUpload(files[0]);
    }
    handleImageUpload(file) {
        this.setState({loading:true,loadingMessage:'Uploading photo ...'});
        PhotoManager.ProductBrand.upload(file)
            .then(({secure_url,format,public_id})=>{
                this.props.edit({Photo:public_id,PhotoFormat:format});
                this.setState({loading:false,loadingMessage:'',imagePath:secure_url});
                this.mutate(false);
            }).catch((error)=>{
            this.setState({loading:false,loadingMessage:'', errorText:error});
        });
    }



    mutate(){
        let {Alias,Name,id,Photo,PhotoFormat}=this.props.ProductBrandEdit;
        this.setState({loading:true,loadingMessage:'Saving data...',errorText:''});
        this.props.submit({Alias,Name,Photo,PhotoFormat})
            .then(({data:{productBrandMutate:{instance,errors}}})=>{
                if(errors && errors.length>0){
                    const errs = {};
                    errors.every((error)=>{
                        if(error.key)
                            errs[error.key] = error.message;
                        else
                            this.props.edit({errorText:error.message});
                        return true;
                    });
                    this.setState({loading:false});
                    this.props.edit({errors:errs});
                }else{
                    this.setState({loading:false,loadingMessage:''});
                    this.props.onComplete();
                }
            });
    }

    render(){
        let {onComplete} = this.props;
        let {Alias,Name,errorText,errors} = this.props.ProductBrandEdit;
        let {loading,loadingMessage,imagePath} = this.state;
        return (
            <div className="col-xs-12 row center-xs" style={{padding:"20px 0"}}>
                <div className="layout col-xs-12 col-sm-8 col-md-6 col-md-6 paper-5">
                    <Toolbar style={{height:'64px',backgroundColor:'#fff',borderBottom:'1px solid #e3e3e3'}}>
                        <ToolbarGroup firstChild={true}>
                            <IconButton touch={true} onClick={onComplete}>
                                <ContentClear />
                            </IconButton>
                            <ToolbarTitle text="Create Product Brand"/>
                        </ToolbarGroup>
                        <ToolbarGroup lastChild={true}>
                            <IconButton touch={true} onClick={this.mutate.bind(this)}>
                                <NavigationCheck />
                            </IconButton>
                        </ToolbarGroup>
                    </Toolbar>
                    <div className="row" style={{backgroundColor:'#fff'}}>
                        <Dropzone
                            multiple={false}
                            accept="image/*"
                            onDrop={this.onImageDrop.bind(this)}>
                            <div>Drop an image or click to select a file to upload.</div>
                            <img style={{width:'150px',height:'150px'}} src={imagePath}/>
                        </Dropzone>
                        <div style={{padding:'20px 0',flexGrow:1}}>
                            <TextField hintText="Alias" ref="Alias" floatingLabelText="Alias" errorText={errors.Alias} value={Alias} onChange={(e)=>{this.props.edit({Alias:e.target.value});}}/>
                            <br/>
                            <TextField hintText="Name" ref="Name" floatingLabelText="Name" value={Name} errorText={errors.Name} onChange={(e)=>{this.props.edit({Name:e.target.value});}}/>
                        </div>
                    </div>
                    <div className="row" style={{height:'64px', paddingTop:'12px',paddingLeft:'12px'}}>
                        {loading ? <CircularProgress/> : null} {loading ? <div style={{padding:'10px'}}>{loadingMessage}</div> : null} <div style={{padding:'10px',color:'red'}}>{loading? '': errorText}</div>
                    </div>
                </div>
            </div>
        );
    }
}


const CreateItemCardWithData = compose(
    createQuery,
    connect(
        (state)=>{
            return {ProductBrandEdit:state.ProductBrand.edit}
        },
        (dispatch)=>(
            {
                edit:(edit)=>{
                    dispatch({
                        type:'PRODUCT_BRAND_EDIT',
                        edit
                    });
                }
            }
        )
    )
)(CreateItemCard);

class Grid extends React.Component{
    render(){
        let {list,loading,loadMore,hasMore,page,createItemCard} = this.props;
        return (
            <InfiniteScroll className="fullheight scrollable row grid" loadMore={loadMore} page={page} hasMore={hasMore} loader={<div className="col-xs-12 row center-xs"><CircularProgress/></div>}>
                {createItemCard}
                {list?list.map((b,i)=>(<ItemCardWithData key={b.id} ProductBrand={b}/>)):null}
            </InfiniteScroll>
        );
    }
}


class ProductBrandBrowser extends React.Component{
    constructor(){
        super(...arguments);
        this.state={
            isSearchMode:false,
            search:'',
            createNew:false
        };
    }

    onSearchChange(search){
        this.setState({search:search});
        this.props.refetch({search,page:1,pageSize:this.props.pageSize});
    }

    render(){
        let {ProductBrand,loading,loadMore,page,refetch,pageSize,hasMore} = this.props;
        const newCard = this.state.createNew? <CreateItemCardWithData onComplete={()=>{this.setState({createNew:false});}}/>: null;
        return (
            <div className="layout fullheight">
                <ThemeableAppBar onCreateNew={()=>{this.setState({createNew:true});}} loading={loading} isSearchMode={this.state.isSearchMode} search={this.state.search} onSearchChange={this.onSearchChange.bind(this)}
                                 onSearchModeChange={(searchMode)=>{this.setState({isSearchMode:searchMode});}} />
                <Grid createItemCard={newCard} list={ProductBrand} hasMore={hasMore} page={page} loadMore={loadMore}  loading={loading}/>
            </div>
        );
    }
}

ProductBrandBrowser.PropTypes={
    loading:PropTypes.bool,
    ProductBrand:PropTypes.arrayOf(propType(queryFragments.ProductBrand).isRequired),
    loadMore:PropTypes.func,
    page:PropTypes.number,
    pageSize:PropTypes.number,
    hasMore:PropTypes.bool,
    refetch:PropTypes.func
};


export default compose(
    fetchQuery
)(ProductBrandBrowser);