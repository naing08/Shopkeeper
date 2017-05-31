import React from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';

const TableHeaderColumnSortOrder = (props) => (
  <sup style={{
                    borderRadius: '100%',
                    padding: '0 .3em',
                    color:'#fff',
                    backgroundColor:props.muiTheme.palette.accent1Color
                }}>
                {props.children}
  </sup>
);

export default muiThemeable()(TableHeaderColumnSortOrder);