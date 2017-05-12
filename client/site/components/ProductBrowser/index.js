import React from 'react';
import ProductGroupGrid from './ProductGroupGrid';
import ProductGrid  from './ProductGrid';
import {pathToProductGroup} from '../../apollo/ProductGroup';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import {compose} from 'react-apollo';
import ActionHome from 'material-ui/svg-icons/action/home';
import FlatButton from 'material-ui/FlatButton';
import {withRouter} from 'react-router';
import AppBar from './AppBar';

class Browser extends React.Component{
	componentDidUpdate(prevProps){
		let {PathToProductGroup} = this.props;
		let {prePathToProductGroup} = prevProps;
		let title = "Products";
		if(PathToProductGroup !== prePathToProductGroup)
			title = this.populateTitle();
		window.setTitle(title);
	}
	populateTitle(){
		let {PathToProductGroup} = this.props;
		return  PathToProductGroup &&  PathToProductGroup.length>0 ? PathToProductGroup[0].Name: "Products";
	}
	
	render(){
		let {parentGroupId,PathToProductGroup,router} = this.props;
		const groupPathBtnStyle = {
	        margin:0,
	        height:'100%',
	        direction:'ltr'
	    };
		return (
				<div className="fullheight layout">
					<AppBar title={this.populateTitle()}/>
					<div className="row" style={{flexWrap:'nowrap','flexShrink':0}}>
						<FlatButton style={groupPathBtnStyle} onClick={()=>{router.push('/');}} icon={<ActionHome />} secondary={true}/>
						<div style={{ whiteSpace: 'nowrap',overflowX:'hidden',direction:'rtl',height:'100%',alignItems:'flex-start'} }>
							
		                    {
		                        PathToProductGroup ? PathToProductGroup.map(({Alias,id},i)=>(<FlatButton key={id} style={groupPathBtnStyle}  onClick={()=>{router.push(`/ProductBrowser/${id}`)}} labelStyle={{color:"#000"}} label={Alias} icon={<NavigationChevronRight/>} secondary={true}/>)):null
		                    }
		                    
		                </div>
					</div>
					<div className="fullheight scrollable">
						<ProductGroupGrid parentGroupId={parentGroupId}/>
						<ProductGrid parentGroupId={parentGroupId}/>
					</div>
				</div>
			);
	}
}

const TheBrowser = compose(
		withRouter,
		pathToProductGroup
	)(Browser);

export default ({params})=>{
	let {id} = params? params:{};
	id = isNaN(id)? null: id;
	return (<TheBrowser parentGroupId={id}/>);
};