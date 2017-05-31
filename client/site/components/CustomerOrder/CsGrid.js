import React from 'react';
import Waypoint from 'react-waypoint';
import GridCard from './GridCard';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import RemoveCircleOutline from 'material-ui/svg-icons/content/remove-circle-outline';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import muiThemeable from 'material-ui/styles/muiThemeable';
class CsGrid extends React.Component{
	constructor(){
		super(...arguments);
		this.state = {
			isCardExpended:false
		}
	}
	render(){
		let {primaryKey,changeToCardAt,cardLabelWidth,columns,data,loading,fetchMore,hasMore,page,muiTheme} = this.props;
		let {isCardExpended} = this.state;
		data= data? data: [];
		cardLabelWidth = cardLabelWidth? cardLabelWidth: '150px';
		let expandCollapseBtnClassName="btn-expand-collapse";
		let headers = columns.map(({caption,width,canGrow,key,captionAlign,hideAt})=>{
							hideAt = hideAt? hideAt:'';
							let style = {};
							if(width)
								style.width = width;
							if(canGrow)
								style.flexGrow=canGrow;
							if(captionAlign)
								style.textAlign=captionAlign;
							style.color="rgba(0, 0, 0, 0.54)";
							style.flexShrink=0;
							expandCollapseBtnClassName = `${expandCollapseBtnClassName}   ${hideAt? hideAt + '-inline-block':''} `
							return (
								<div 
									key={key} 
									className={`cs-column ${hideAt? hideAt + '-hide':''}`}
									style={style}
									>{caption}
								</div>
								);
						});
		return (
			<div className="cs-grid">
				<div className={`cs-header ${changeToCardAt? changeToCardAt + '-hide': ''}`}>
					<div className='cs-row-selector cs-column'>
						<Checkbox style={{width:'20px',marginRight:'10px',display:'block'}}/>
						<IconButton onClick={()=>{this.setState({isCardExpended:true});}} style={{display:'none',padding:0,height:0,width:'32px',marginRight:'10px'}} className={`btn-expand  ${expandCollapseBtnClassName} ${isCardExpended? 'display-none':''}`}>
							<AddCircleOutline color={muiTheme.palette.accent1Color}/>
						</IconButton>
						<IconButton onClick={()=>{this.setState({isCardExpended:false});}} style={{display:'none',padding:0,height:0,width:'32px',marginRight:'10px'}} className={`btn-collapse  ${expandCollapseBtnClassName} ${!isCardExpended? 'display-none':''}`}>
							<RemoveCircleOutline color={muiTheme.palette.primary1Color}/>
						</IconButton>
					</div>
					{
						headers
					}
				</div>
				<div className="cs-body" >
					{
						data.map(item=>(<GridCard isCardExpended={isCardExpended} key={item[primaryKey]} changeToCardAt={changeToCardAt} cardLabelWidth={cardLabelWidth} columns={columns} primaryKey={primaryKey} item={item}/>))
					}
					<Waypoint onEnter={()=>{if(!loading && hasMore) fetchMore(page+1)}} bottomOffset="-100px"/>
				</div>
			</div>
			);
	}
}

export default muiThemeable()(CsGrid);