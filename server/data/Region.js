import db from '../models/index';
import {property} from 'lodash';

export const type =`
	type Region{
		id:Int!
		Name1:String!
		Name2:String
	}
`;

export const query=`
	Region:[Region]
`;

export const mutation=``;

export const resolver = {
	type:{
		Region:{
			id:property("id"),
			Name1:property("Name1"),
			Name2:property("Name2")
		}
	},
	query:{
		Region:(_)=>{
			return db.Region.findAll({attributes:['id','Name1','Name2']});
		}
	},
	mutation:{

	}
};