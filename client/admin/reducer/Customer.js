import update from 'react-addons-update';
const initialData = {
    errors:{},
    id:null,
    FullName:'',
    UserName:'',
    Photo:'',
    PhotoFormat:'',
    UserAccountId:null,
    createdAt:null,
    updatedAt:null,
    PhoneNo:'',
    Email:'',
    Region:'',
    Township:'',
    Address:'',
    IsConfirmedEmail:false,
    IsConfirmedPhoneNo:false,
    IsModerated:false
};

function validateCustomer(customer){
	let {FullName,errors} = customer;
    errors = errors? errors:{};
    let isValid = true;
    if(!FullName) {
        errors.FullName = "Full Name is required."
        isValid = false;
    }else
        errors.FullName="";
    return {isValid,errors};
}

const Customer = (state={createDialogOpen:false,editDialogOpen:false,edit:initialData},action)=>{
	action.edit = action.edit? action.edit:initialData;
	switch(action.type){
		case 'CUSTOMER_EDIT':
			let newCustomer=Object.assign({},state.edit,action.edit);
            newCustomer = Object.assign(newCustomer,validateCustomer(newCustomer));
            return update(state,{
                edit:{$set:newCustomer}
            });
			break;
        case 'CUSTOMER_CREATE_DIALOG_OPEN':
            return update(state,{createDialogOpen:{$set:true}});
            break;
        case 'CUSTOMER_CREATE_DIALOG_CLOSE':
            return update(state,{createDialogOpen:{$set:false}});
            break;
        case 'CUSTOMER_EDIT_DIALOG_OPEN':
            return update(state,{editDialogOpen:{$set:true}});
            break;
        case 'CUSTOMER_EDIT_DIALOG_CLOSE':
            return update(state,{editDialogOpen:{$set:false}});
            break;
        case 'CUSTOMER_VALIDATE':
            let customer = Object.assign({},state.edit,validateCustomer(state.edit));
            return update(state,{
                edit:{$set:customer}
            });
        default:
            return state;
            break;
	}
}

export {initialData};
export default Customer;
