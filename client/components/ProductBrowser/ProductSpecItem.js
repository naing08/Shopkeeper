/**
 * Created by ChitSwe on 1/24/17.
 */
import React,{PropTypes} from 'react';
import {Card} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import ContentClear from 'material-ui/svg-icons/content/clear';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import buildErrorForServerValidationResult from '../../common/buildErrorForServerValidationResult';
import {connect} from 'react-redux';
import {deleteProductSpecification} from '../../../common/apollo/Product/index';
import {compose} from 'react-apollo';
import CircularProgress from 'material-ui/CircularProgress';
class ProductSpecItem extends React.Component{
    constructor(){
        super(...arguments);
        this.state = {
            deleting:false
        };
    }

    destroy(id){
        if(id) {
            this.setState({deleting:true});
            this.props.destroy(id).then(() => {
                this.setState({deleting: false});
                this.props.destroyAction(id);
            }).catch((error) => {
                this.setState({deleting: false});
            });
        }else{
            this.props.destroyAction(id);
        }
    }
    render (){
        let {errors,Name,Value,id,edit,index} = this.props;
        errors = buildErrorForServerValidationResult(errors);
        return (
            <div className="grid-item">
                <Card style={{padding:'10px',position:'relative'}}>
                    <TextField name="Name" value={Name} errorText={errors.Name} floatingLabelText="Spec Name" hintText="Spec Name" onChange={(e)=>{edit(index,{Name:e.target.value});}}/>
                    <br/>
                    <TextField name="Value" value={Value} errorText={errors['Value']} floatingLabelText="Spec Value" hintText="Spec Value" onChange={(e)=>{edit(index,{Value:e.target.value});}}/>
                    <br/>
                    <FloatingActionButton secondary={this.state.deleting} mini={true} onClick={()=>{this.destroy(index);}} style={{position:'absolute',top:10,right:10}}>
                        {this.state.deleting? <CircularProgress size={30}/> :<ContentClear/>}
                    </FloatingActionButton>
                    <br/>
                    <span>{errors.errorText}</span>
                </Card>
            </div>
        );
    }
}

ProductSpecItem.propTypes={
  error:PropTypes.arrayOf(PropTypes.shape({
      key:PropTypes.string,
      message:PropTypes.string
  })),
    Name:PropTypes.string,
    Value:PropTypes.string,
    id:PropTypes.number
};

export default compose(
    deleteProductSpecification,
    connect(
        ()=>({}),
        (dispatch)=>({
            edit:(index,edit)=>{
                dispatch({
                    type:'PRODUCT_SPEC_EDIT',
                    index,
                    edit
                });
            },
            destroyAction:(index)=>{
                dispatch({
                    index,
                    type:'PRODUCT_SPEC_DESTROY'
                });
            }
        })
    )
)(ProductSpecItem);