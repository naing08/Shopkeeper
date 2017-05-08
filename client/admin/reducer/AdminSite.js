import update from 'react-addons-update';
const initialData={
	isSnackbarOpen:false,
	snackbarMessage:''
}

const AdminSite=(state=initialData,action)=>{
	switch(action.type){
		 case 'ADMIN_SITE_SNACKBAR_OPEN':
		 	return update(state,{
		 		isSnackbarOpen:{$set:true},
		 		snackbarMessage:{$set:action.message}
		 	});
		 	break;
		 case 'ADMIN_SITE_SNACKBAR_CLOSE':
		 	return update(state,{
	 			isSnackbarOpen:{$set:false},
	 			snackbarMessage:{$set:''}
		 	});
		 	break;
		 default:
		 	return state;
		 	break;
	}
};
export {initialData};
export default AdminSite;