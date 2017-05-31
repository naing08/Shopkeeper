import React,{PropTypes} from 'react';
import {Card, CardHeader,CardActions} from 'material-ui/Card';
import {withRouter} from 'react-router';


class ItemCard extends React.Component{
    constructor(){
        super(...arguments);
        this.state = {loading:false};
    }
    render(){
        let {Customer,router} = this.props;
        let {id,FullName,deletedAt,ThumbnailUrl,UserName,UserAccountId,Region,Township} = Customer;
        // return 
        //     (<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 grid-item" >
        //         <Card>
        //             <CardHeader title={FullName}  avatar={ThumbnailUrl} subtitle={UserName}/>
        //         </Card>
        //     </div>);
        return (<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 grid-item">
                    <a href='#' onClick={(e)=>{e.preventDefault();router.push(`/admin/Customer/${id}`);}} style={{display:'block'}}>
                        <Card>
                            <CardHeader title={FullName} avatar={ThumbnailUrl} subtitle={`${Township.Name1},${Region.Name1}`} />
                        </Card>
                    </a>
                </div>);
    }
}


export default withRouter(ItemCard);

