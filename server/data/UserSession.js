import db from '../models/index';
import {property} from 'lodash';
import login from '../security/login';

export const type = 
`	type UserSession{
		success:Boolean!
		access_token:String!
		user_id:Int!
		user_name:String!
		account_type:String!
		profile_pic:String!
		full_name:String!
		entity_id:Int!
	}
`;

export const query=``;

export const mutation=`
	Login(username:String!,password:String,remember:Boolean):UserSession
`;

export const resolver={
	type:{},
	query:{},
	mutation:{
		Login(_,{username,password,remember}){
			return login(username,password,remember);
		}
	}
}
