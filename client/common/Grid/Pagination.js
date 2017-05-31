import React,{PropTypes} from 'react';
import { createUltimatePagination, ITEM_TYPES } from 'react-ultimate-pagination';
import FlatButton from 'material-ui/FlatButton';
import NavigationFirstPage from 'material-ui/svg-icons/navigation/first-page';
import NavigationLastPage from 'material-ui/svg-icons/navigation/last-page';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import TextField from 'material-ui/TextField';
import muiThemeable from 'material-ui/styles/muiThemeable';

const flatButtonStyle = {
    minWidth: 36
};

const Page = ({ value, isActive, onClick }) => (
    <FlatButton style={flatButtonStyle} label={value.toString()} primary={isActive} onClick={onClick}/>
);

const Ellipsis = ({ onClick }) => (
    <FlatButton style={flatButtonStyle} label="..." onClick={onClick}/>
);

const FirstPageLink = ({ isActive, onClick }) => (
    <FlatButton style={flatButtonStyle} icon={<NavigationFirstPage/>} onClick={onClick}/>
);

const PreviousPageLink = ({ isActive, onClick }) => (
    <FlatButton style={flatButtonStyle} icon={<NavigationChevronLeft/>} onClick={onClick}/>
);

const NextPageLink = ({ isActive, onClick }) => (
    <FlatButton style={flatButtonStyle} icon={<NavigationChevronRight/>} onClick={onClick}/>
);

const LastPageLink = ({ isActive, onClick }) => (
    <FlatButton style={flatButtonStyle} icon={<NavigationLastPage/>} onClick={onClick}/>
);
const WrapperComponent = (props) => (<div className="pagination" style={{display:"inline-block"}}>{props.children}</div>)

const itemTypeToComponent = {
    [ITEM_TYPES.PAGE]: Page,
    [ITEM_TYPES.ELLIPSIS]: Ellipsis,
    [ITEM_TYPES.FIRST_PAGE_LINK]: FirstPageLink,
    [ITEM_TYPES.PREVIOS_PAGE_LINK]: PreviousPageLink,
    [ITEM_TYPES.NEXT_PAGE_LINK]: NextPageLink,
    [ITEM_TYPES.LAST_PAGE_LINK]: LastPageLink
};

const Nav = createUltimatePagination({ itemTypeToComponent: itemTypeToComponent, WrapperComponent: WrapperComponent });
class Pagination extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { currentPage: this.props.currentPage, pageSize: this.props.pageSize };
    }
    onChange(pageNo) {
        this.state.currentPage = pageNo;
        this.props.onChanged(pageNo);
    }
    onCurrentPageTextFieldChange(e) {
        this.setState({ currentPage: e.target.value });
    }
    onCurrentPageTextFieldBlur(e) {
        let p = Number.parseInt(e.target.value);
        if (p && p <= this.props.totalPages && p > 0)
            this.props.onChanged(p);
        else
            this.setState({ currentPage: this.props.currentPage });
    }
    onCurrentPageTextFieldKeyPress(e) {
        if (e.charCode == 13) {
            this.refs.currentPage.blur();
        }
    }
    onPageSizeTextFieldChange(e) {
        this.setState({ pageSize: e.target.value });
    }
    onPageSizeTextFieldBlur(e) {
        let p = Number.parseInt(e.target.value);
        if (p && p > 0)
            this.props.onPageSizeChanged(p);
        else
            this.setState({ pageSize: this.props.pageSize });
    }
    onPageSizeTextFieldKeyPress(e) {
        if (e.charCode == 13) {
            this.refs.pageSize.blur();
        }
    }

    render() {
        this.state.currentPage = this.state.currentPage> this.props.totalPages? this.props.currentPage:this.state.currentPage;
        let theme = this.props.muiTheme;
        return (
            <div style={{backgroundColor:theme.palette.accent2Color}}>
            <TextField ref="currentPage" onKeyPress={this.onCurrentPageTextFieldKeyPress.bind(this)} onBlur={this.onCurrentPageTextFieldBlur.bind(this)} onChange={this.onCurrentPageTextFieldChange.bind(this)}  name={"currentPage"} style={{width:'30px'}} inputStyle={{textAlign:"right"}} value={this.state.currentPage}></TextField>
        <span style={{fontFamily:theme.fontFamily,color:theme.palette.textColor,verticalAlign:'middle'}}>{' of '}{this.props.totalPages}</span>
        <Nav  currentPage={this.props.currentPage} totalPages={this.props.totalPages} onChange={this.onChange.bind(this)}></Nav>
        
        <span style={{fontFamily:theme.fontFamily,color:theme.palette.textColor,verticalAlign:'middle'}}>{' Items per page: ' }</span>
        <TextField ref="pageSize" onKeyPress={this.onPageSizeTextFieldKeyPress.bind(this)} onBlur={this.onPageSizeTextFieldBlur.bind(this)} onChange={this.onPageSizeTextFieldChange.bind(this)}  name={"pageSize"} style={{width:'30px'}} inputStyle={{textAlign:"right"}} value={this.state.pageSize}></TextField>
      </div>
        );
    }
}
const ThemeablePagination = muiThemeable()(Pagination);
ThemeablePagination.propTypes = {
  currentPage:PropTypes.number.isRequired,
  pageSize:PropTypes.number.isRequired,
  onChanged:PropTypes.func.isRequired,
  onPageSizeChanged:PropTypes.func.isRequired
};
export default ThemeablePagination;
