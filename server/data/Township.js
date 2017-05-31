import db from '../models/index';
import {property} from 'lodash';

export const type =`
	type Township{
		id:Int!
		Name1:String!
		Name2:String
	}
`;

export const query=`
	Township(regionId:Int!):[Township]
`;

export const mutation=``;

export const resolver = {
	type:{
		Township:{
			id:property("id"),
			Name1:property("Name1"),
			Name2:property("Name2")
		}
	},
	query:{
		Township:(_,{regionId})=>{
			return db.Township.findAll({where:{RegionId:regionId},attributes:['id','Name1','Name2']});
		}
	},
	mutation:{

	}
};