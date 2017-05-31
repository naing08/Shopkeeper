import db from '../models/index';
import {property} from 'lodash';
import cloudinary from '../cloudinary';

export const type=`
type BankTransfer{
	id:Int!
	TransferDate:Date!
	Remark:String
	Attachment:String!
	AttachmentUrl:String!
}

input InputBankTransfer{
	TransferDate:Date!
	Remark:String
	Attachment:String!
	BankAccountId:Int!
}

type BankTransferMutationResult{
	instance:BankTransfer
	errors:[error]
}
`;

export const query=``;
export const mutation=``;
export const resolver={
	type:{
		BankTransfer:{
			id:property("id"),
			TransferDate:property("TransferDate"),
			Remark:property("Remark"),
			Attachment:property("Attachment"),
			AttachmentUrl:transfer=>(transfer.Attachment? cloudinary.url(transfer.Attachment):null)
		}
	},
	query:{},
	mutation:{}
};