import React, { PropTypes } from 'react';
import { TableHeaderColumn as HColumn } from 'material-ui/Table';
import NavigationArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import NavigationArrowDropUp from 'material-ui/svg-icons/navigation/arrow-drop-up';
import TableHeaderColumnSortOrder from './TableHeaderColumnSortOrder';


class TableHeaderColumn extends React.Component {
    constructor() {
        super(...arguments);
    }
    handleClick() {
        let nextState = null;
        switch (this.props.options.orderByDesc) {
            case true:
                nextState = null;
                break;
            case null:
            case undefined:
                nextState = false;
                break;
            case false:
                nextState = true;
                break;
        }
        this.props.onOrderByChanged(this.props.options.key, nextState);
    }
    render() {
        let arrow = null;
        let arrowStyle = { verticalAlign: 'middle' };
        let sortOrder = null;
        let style = Object.assign({cursor:"pointer"},this.props.style);
        switch (this.props.options.orderByDesc) {
            case true:
                arrow = <NavigationArrowDropDown style={arrowStyle}/>;
                break;
            case null:
            case undefined:
                break;
            case false:
                arrow = <NavigationArrowDropUp style={arrowStyle}/>;
                break;
        }
        if (arrow)
            sortOrder =  <TableHeaderColumnSortOrder>{this.props.options.sortOrder}</TableHeaderColumnSortOrder>
        let caption = this.props.options.key;
        if (this.props.options.caption)
            caption = this.props.options.caption;
        return (
            <HColumn 
		 		onClick={this.handleClick.bind(this)}
		 		className={this.props.className}
		 		columnNumber={this.props.columnNumber}
		 		style={style}
		 		tooltip={this.props.tooltip}
		 		tooltipStyle={this.props.tooltipStyle}
		 		>
		 		{caption}
		 		{sortOrder}
		 		{arrow}
		 	</HColumn>
        );
    }
}
TableHeaderColumn.propTypes = {
    className: PropTypes.string,
    columnNumber: PropTypes.number,
    style: PropTypes.object,
    tooltip: PropTypes.string,
    tooltipStyle: PropTypes.object,
    onOrderByChanged: PropTypes.func,
    options: PropTypes.shape({
        key: PropTypes.string.isRequired,
        orderByDesc: PropTypes.bool,
        caption: PropTypes.string
    })

};
export default TableHeaderColumn;
