import db from '../models/index';
import {property} from 'lodash';

export const type=`
	type BankAccount{
		id:Int!
		Name:String!
		Description:String
		AccountNo:String!
		Enabled:Boolean!
	}
`;

export const query=`
	BankAccount(enabled:Boolean!):[BankAccount]
`;

export const mutation=`

`;

export const resolver={
	type:{
		BankAccount:{
			id:property('id'),
			Name:property('Name'),
			Description:property('Description'),
			AccountNo:property('AccountNo'),
			Enabled:property('Enabled')
		}
	},
	query:{
		BankAccount:(_,{enabled})=>{
			return db.BankAccount.findAll({where:{Enabled:enabled},attributes:['id','Name','Description','AccountNo']});
		}
	},
	mutation:{

	}
};
