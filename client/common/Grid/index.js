import React, { PropTypes } from 'react';
import { Table, TableBody, TableFooter, TableHeader, TableRow, TableRowColumn } from 'material-ui/Table';
import TableHeaderColumn from './TableHeaderColumn';
import update from 'react-addons-update';
import Pagination from './Pagination';
import GridColumnFilter from './filtering/GridColumnFilter';
import DataTypes from './filtering/DataTypes';
import FilterOperator from './filtering/FilterOperator';
import Accounting from 'accounting';
class Grid extends React.Component {
    constructor() {
        super(...arguments);
        this.update = update;
    }
    onPageChanged(page) {
        this.loadData(this.props.columns, { pageSize: this.props.pagination.pageSize, currentPage: page });
    }
    onPageSizeChanged(pageSize) {
        this.loadData(this.props.columns, { pageSize, currentPage: this.props.pagination.currentPage });
    }
    onOrderByChanged(key, isOrderByDesc) {
        let columns = this.props.columns;
        let changedColumn = null;
        for (let c of columns) {
            if (c.key === key) {
                changedColumn = { index: columns.indexOf(c), sortOrder: c.sortOrder, key: c.key };
                break;
            }
        }
        let pendingState = columns;
        switch (isOrderByDesc) {
            case true: //if ordering column
                pendingState = update(pendingState, {
                    [changedColumn.index]: { $merge: { orderByDesc: isOrderByDesc } }
                });
                break;
            case null:
            case undefined: //if change from ordering column to non ordering column
                for (let c of columns) {
                    if (c.sortOrder > 0) { //populate all ordering column
                        if (c.key != changedColumn.key) { //if not changed column
                            if (c.sortOrder > changedColumn.sortOrder) {
                                pendingState = update(pendingState, {
                                    [columns.indexOf(c)]: { $merge: { sortOrder: c.sortOrder - 1 } }
                                });
                            }
                        }
                    }
                }
                pendingState = update(pendingState, {
                    [changedColumn.index]: { $merge: { sortOrder: null, orderByDesc: isOrderByDesc } }
                });
                break;
            case false: //if change from non ordering column to ordering column
                let maxOrderNo = 0;
                for (let c of columns) {
                    if (c.sortOrder > 0) { //populate all ordering column
                        if (c.key != changedColumn.key) { //if not changed column
                            maxOrderNo = maxOrderNo > c.sortOrder ? maxOrderNo : c.sortOrder;
                        }
                    }
                }
                changedColumn.sortOrder = maxOrderNo + 1;
                pendingState = update(pendingState, {
                    [changedColumn.index]: { $merge: { sortOrder: changedColumn.sortOrder, orderByDesc: isOrderByDesc } }
                });
                break;
        }

        this.loadData(pendingState, this.props.pagination);
    }
    populatePaginationForRequestBody(pagination) {
        let offset = (pagination.currentPage - 1) * pagination.pageSize;
        let req = {
            offset: offset,
            limit: pagination.pageSize,
            start: offset + 1,
            end: pagination.pageSize * pagination.currentPage,
            pageSize: pagination.pageSize,
            currentPage: pagination.currentPage
        }
        return req;
    }
    populateOrderForRequestBody(columns) {
        let order = [];
        for (let c of columns) {
            switch (c.orderByDesc) {
                case true:
                    order.splice(c.sortOrder - 1, 0, [c.key, 'DESC']);
                    break;
                case null:
                case undefined:
                    break;
                case false:
                    order.splice(c.sortOrder - 1, 0, [c.key]);
                    break;
            }
        }
        return order;
    }
    loadData(columns, pagination) {
        let order = this.populateOrderForRequestBody(columns);
        let pg = this.populatePaginationForRequestBody(pagination);
        let where = this.populateFilteringForRequestBody(columns);
        let request = { order, pagination: pg, where: where };
        this.props.onRequestDataLoad(request, columns);
    }

    populateFilteringForRequestBody(columns) {
        let where = [];
        columns.forEach(c => {
            if (c.filter && c.filter.operator) {
                let symbol = c.filter.operator.getSymbol();
                let operand = c.filter.operand;
                switch (symbol) {
                    case '$eq':
                    case '$ne':
                    case '$gt':
                    case '$gte':
                    case '$lt':
                    case '$lte':
                        if (operand || operand == 0 || operand == false) {
                            where.push({
                                [c.key]: {
                                    [symbol]: operand
                                }
                            });
                        }
                        break;
                    case '$between':
                    case '$notBetween':
                        if (operand && (operand.from || operand.from == 0) && (operand.to || operand.to == 0)) {
                            where.push({
                                [c.key]: {
                                    [symbol]: [operand.from, operand.to]
                                }
                            });
                        }
                        break;
                    case '$isNull':
                        where.push({
                            [c.key]: { $eq: null }
                        });
                        break;
                    case '$isNotNull':
                        where.push({
                            [c.key]: { $ne: null }
                        });
                        break;
                    case '$in':
                    case '$notIn':
                        if (operand && Array.isArray(operand) && operand.length) {
                            where.push({
                                [c.key]: {
                                    [symbol]: operand
                                }
                            });
                        }
                        break;
                    case '$contain':
                        if (operand || operand == 0)
                            where.push({
                                [c.key]: { $like: '%' + operand + '%' }
                            });
                        break;
                    case '$notContain':
                        if (operand || operand == 0) {
                            where.push({
                                [c.key]: { $notLike: '%' + operand + '%' }
                            });
                        }
                        break;
                    case '$startWith':
                        if (operand || operand == 0) {
                            where.push({
                                [c.key]: { $like: operand + '%' }
                            });
                        }
                        break;
                    case '$endWith':
                        if (operand || operand == 0) {
                            where.push({
                                [c.key]: { $like: '%' + operand }
                            });
                        }
                    case '$notStartWith':
                        if (operand || operand == 0) {
                            where.push({
                                [c.key]: { $notLike: operand + '%' }
                            });
                        }
                        break;
                    case '$notEndWith':
                        if (operand || operand == 0) {
                            where.push({
                                [c.key]: { $notLike: '%' + operand }
                            });
                        }
                        break;
                }
            }
        });
        where = { $and: where };
        return where;
    }

    columnFilterChange(index, filter) {
        let columns = update(this.props.columns, {
            [index]: { filter: { $set: { operator: filter.operator, operand: filter.operand } } }
        });
        this.loadData(columns, this.props.pagination);
    }

    formatValue(value,format){
        let text = value;
        switch(format){
            case 'shortDate':
                text = isNaN(Date.parse(value))?'': (new Date(value)).formatAsShortDate();
                break;
            case 'longDate':
                text = isNaN(Date.parse(value))?'': (new Date(value)).formatAsLongDate();
                break;
            case 'shortTime':
                text = isNaN(Date.parse(value))?'': (new Date(value)).formatShortTime();
                break;
            case 'longTime':
                text = isNaN(Date.parse(value))?'': (new Date(value)).formatAsLongTime();
                break;
            case 'currency':
                text = isNaN(Number.parseFloat(value))? '':Accounting.formatMoney();
                break;
            case 'number':
                text = isNaN(Number.parseFloat(value))? '' :Accounting.formatNumber();
                break;
        }
        return text;
    }

    render() {
        
        return (
            <div>
            <Table
                height={this.props.height}
                fixedHeader={this.props.fixedHeader}
                fixedFooter={this.props.fixedFooter}
                bodyStyle={{overflow:'visible'}}
            >
            <TableHeader>
                <TableRow>
                    {
                        this.props.columns.map(c=>(<TableHeaderColumn style={{width:c.width && c.width>0? c.width:null}} onOrderByChanged={this.onOrderByChanged.bind(this)} key={c.key} options={c}/>))
                    }
                </TableRow>
                <TableRow>
                    {
                        this.props.columns.map((c,index)=>(<TableRowColumn style={{width:c.width && c.width>0? c.width:null}} key={c.key}>
                                {c.enableFiltering?<GridColumnFilter  value={c.filter} dataType={c.dataType} onChange={x=>{this.columnFilterChange(index,x);}}></GridColumnFilter>:null}
                            </TableRowColumn>))
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    this.props.data.map(i=>(
                        <TableRow key={this.props.data.indexOf(i)}>
                            {
                            this.props.columns.map(c=>{
                                let value = i[c.key];
                                if(c.format)
                                    value = this.formatValue(value,c.format);
                                return (
                                    <TableRowColumn style={{width:c.width && c.width>0? c.width:null}} key="{c.key}">{value}</TableRowColumn>
                                );
                            })
                            }
                        </TableRow>
                        ))
                }
            </TableBody>            
        </Table>
        <Pagination currentPage={this.props.pagination.currentPage} totalPages={this.props.pagination.totalPages} onChanged={this.onPageChanged.bind(this)} onPageSizeChanged={this.onPageSizeChanged.bind(this)} pageSize={this.props.pagination.pageSize}></Pagination>
        </div>);
    }
}

Grid.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        caption: PropTypes.string,
        key: PropTypes.string.isRequired,
        orderByDesc: PropTypes.bool,
        enableFiltering: PropTypes.bool,
        dataType: DataTypes.PropTypes.isRequired,
        filter: PropTypes.shape({
            operator: PropTypes.instanceOf(FilterOperator),
            operand: PropTypes.any
        }),
        format:PropTypes.oneOf(['number','shortDate','longDate','shortTime','longTime','currency'])
    })),
    data: PropTypes.array,
    pagination: PropTypes.shape({
        currentPage: PropTypes.number.isRequired,
        totalPages: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired
    }),
    onRequestDataLoad: PropTypes.func.isRequired,
    fixedHeader:PropTypes.bool,
    fixedFooter:PropTypes.bool,
    height:PropTypes.string
}
export default Grid;
