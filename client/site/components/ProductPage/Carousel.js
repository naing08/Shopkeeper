import React from 'react';
import {CardMedia} from 'material-ui/Card';

class Carousel extends React.Component{
	constructor(){
		super(...arguments);
		this.state={
			index:0
		};
	}
	render (){
		let {Photo,style,className} = this.props;
		let {index} = this.state;
		style = style? style:{};
		style.alignItems = 'center';
	    return (
	      <div className="layout" style={style} className={`${className}`}>
	      	<CardMedia>
	      		{Photo && Photo[index]? <img src={Photo[index].url}/> : null}
	      	</CardMedia>
	        <div className="row">
	        	{Photo? Photo.map(
	        		({url,id},i)=>{
	        			let style={width:'50px',height:'50px', margin:'5px'};
	        			if(index==i)
	        				style.border='1px solid #343434';
        				return (<div key={id}>
        							<img onClick={()=>{this.setState({index:i});}} style={style} src={url} />
    							</div>);
	        		})
	        		: null}
	 
	        </div>
	      </div>
	    );
	}
}

export default Carousel;