import update from 'react-addons-update';
const initialData = {
	id:null,
	EntityId:null,
	EntityType:'',
	isDialogOpen:false,
    UserName:{
    	UserName:'',
    	updatedAt:'',
    	createdAt:'',
    	error:''
    },
    Password:{
    	errors:{},
    	OldPassword:'',
    	NewPassword:'',
    	ConfirmPassword:''
    }
};

function validateUserName(edit){
	let {UserName}  = edit;
	let error = '';
	let isValid=true;
	if(!UserName){
		isValid = false;
		error='User Name is required';
	}
	return Object.assign({},edit,{UserName,error,isValid});
}

function validatePassword(edit){
	let {OldPassword,NewPassword,ConfirmPassword} = edit;
	let isValid = true;
	let errors = {NewPassword:'',OldPassword:''};
	if(!NewPassword){
		isValid = false;
		errors.NewPassword= "Password is required";
	}
	if(!ConfirmPassword){
		isValid = false;
		errors.ConfirmPassword = "Confirm Password is required";
	}
	if(NewPassword !== ConfirmPassword){
		errors.NewPassword = errors.NewPassword? errors.NewPassword: 'Password does not match with confirm password';
		errors.ConfirmPassword = errors.ConfirmPassword? errors.ConfirmPassword:'Confirm password does not match with new password.';
		isValid = false;
	}
	return Object.assign({},edit,{errors,isValid});
}
const UserName=(state=initialData.UserName,action)=>{
	switch(action.type){
		case 'USERNAME_EDIT':
			return validateUserName(Object.assign({},state,action.edit));
			break;
		default:
			return state;
	}
};

const Password=(state=initialData.Password,action)=>{
	switch(action.type){
		case 'PASSWORD_EDIT':
			return validatePassword(Object.assign({},state,action.edit));
			break;
		default:
			return state;
	}
};
const UserAccount=(state=initialData,action)=>{
	switch(action.type){
		case 'USER_ACCOUNT_PASSWORD_DIALOG_OPEN':
			return update(state,{
				isDialogOpen:{$set:true}
			});
			break;
		case 'USER_ACCOUNT_PASSWORD_DIALOG_CLOSE':
			return update(state,{
				isDialogOpen:{$set:false}
			});
			break;
		case 'USERNAME_EDIT':
			return Object.assign({},state,action.edit,{UserName:UserName(state.UserName,action)});
			break;
		case 'PASSWORD_EDIT':
			return Object.assign({},state,action.edit,{Password:Password(state.Password,action)});
			break;
		default:
			return state;
	}

};

export {initialData};
export default UserAccount;

