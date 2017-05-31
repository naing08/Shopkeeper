/**
 * Created by ChitSwe on 1/21/17.
 */
import React from 'react';;
import TownshipSelector from './site/components/TownshipSelector';
class Test extends React.Component{
    render(){
        return (
            <TownshipSelector 
                        selectFieldProps={{
                            name:"Delivery_Township",
                            floatingLabelText:"Township",
                            hintText:"Township",    
                            id:"Delivery_Township",
                            className:"checkout_delivery_field township col-xs-12"
                        }}
                    />
            );
    }
}

export default Test;