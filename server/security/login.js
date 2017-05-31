import db from '../models/index';
import uuid from 'node-uuid';
import jwt from 'jwt-simple';
import cloudinary from '../cloudinary';
let LocalStrategy = require('passport-local').Strategy;

function login(username,password,remember){
	let where = {UserName:username};
	if(password)
		where.Password=password;
	else{
		where.$or=[
			{
				Password:''
			},
			{Password:null}
		];
	}
	return db.UserAccount.findAll({where})
				.then(result=>{
					let userAccount = result[0];
					if(userAccount){
						let sessionKey = jwt.encode(username,uuid.v4());
						return db.UserSession.create({UserAccountId:userAccount.id,ExpiredIn:remember? null: 300,Counter:1,SessionKey:sessionKey},{fields:['UserAccountId','ExpiredIn','Counter','SessionKey']})
						.then(session=>{
							return userAccount.getUser().then(user=>{
								if(user)
									return {type:'USER',Photo:user.Photo,FullName:user.FullName,EntityId:user.id};
								else
									return userAccount.getCustomer().then(customer=>{
										if(customer)
											return {type:'CUSTOMER',Photo:customer.Photo,FullName:customer.FullName,EntityId:customer.id};
										else
											return user.getDealer().then(dealer=>{
												if(dealer)
													return {type:'DEALER',Photo:dealer.Photo,FullName:dealer.FullName,EntityId:dealer.id};
												else
													return null;
											});
									});
							}).then(accountType=>{
								let {type,Photo,FullName,EntityId}=accountType? accountType:{};
								return {
									success:true,
									access_token:sessionKey,
									user_id:userAccount.id,
									user_name:username,
									account_type:type,
									profile_pic:Photo?cloudinary.url(Photo):`img/letter/letter_${FullName[0]}.png`,
									full_name:FullName,
									entity_id:EntityId
								};
							});
						});
					}
					else {
						return {message:'User name or password is incorrect.',success:false};
					}
				})
				.catch(error=>({message:error,success:false}));
}

function loginHandler(req,res){
	let {username,password,remember} = req.body;
	login(username,password,remember).then(session=>{res.json(session);});
}



export {loginHandler};
export default login;