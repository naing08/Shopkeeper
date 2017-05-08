/**
 * Created by ChitSwe on 2/25/17.
 */
import React from 'react';
import ProductBrowser from './ProductBrowser/index';
class Home extends React.Component{
    render(){
        return (<ProductBrowser/>);
    }
    componentDidMount(){
    	document.title="Site Home";
    }
}

export default Home;