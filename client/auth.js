import {setCookie,getCookie} from './cookieManager';

function saveUserProfile(profile){
	let {access_token,user_id,user_name,account_type,profile_pic,full_name}=profile;	
	setCookie('access_token',access_token);
	setCookie('user_id',user_id);
	setCookie('user_name',user_name);
	setCookie('account_type',account_type);
	setCookie('profile_pic',profile_pic);
	setCookie('full_name',full_name);
}

function logout(){
	saveUserProfile({
		access_token:'',
		user_id:null,
		user_name:'',
		account_type:'',
		profile_pic:null,
		full_name:''
	});
}

function getAccessToken(){
	return getCookie('access_token');
}

function getUserProfile(){
	return {
		access_token:getCookie('access_token'),
		user_id:getCookie('user_id'),
		user_name:getCookie('user_name'),
		account_type:getCookie('account_type'),
		profile_pic:getCookie('profile_pic'),
		full_name:getCookie('full_name')
	} 
}

function login({UserName,Password,Remember}){
	let request = new Request('/login',{
		method:'POST',
		body:JSON.stringify({
			username:UserName,
			password:Password,
			remember:Remember
		}),
		headers:new Headers({
			'Content-Type':'application/json'
		})
	});
	return fetch(request).then((response=>(response.json())));
}

export {getAccessToken,saveUserProfile,getUserProfile,login,logout	};