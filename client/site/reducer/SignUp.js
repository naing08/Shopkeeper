const initialData = {
	UserName:'',
	Password:'',
	ConfirmPassword:'',
	dialogOpen:false,
	Remember:false,
	isValid:false,
	errors:{}
};

function validate(state){
	let {UserName,Password,ConfirmPassword,errors} = state;
	let isValid = true;
	if(!UserName){
		errors.UserName = "User name is required"
		isValid = false;
	}else{
		errors.UserName="";
	}

	if(Password !== ConfirmPassword){
		errors.Password="Password not confirmed";
		errors.ConfirmPassword = "Password not confirmed";
		isValid = false;
	}else{
		errors.Password= "";
		errors.ConfirmPassword = "";
	}
	return Object.assign({},state,{isValid,errors});
}

const SignUp = (state=initialData,action)=>{
	switch(action.type){
		case 'SIGNUP_EDIT':
			return validate(Object.assign({},state,action.edit));
			break;
		default:
			return state;
	}
}

export default SignUp;