/**
 * Created by ChitSwe on 12/21/16.
 */
import {type as type_ProductBrand,query as query_ProductBrand,mutation as mutation_ProductBrand} from './ProductBrand';
import {type as type_ProductGroup,query as query_ProductGroup, mutation as mutation_ProductGroup} from './ProductGroup';
import {type as type_Product, query as query_Product,mutation as mutation_Product} from './Product';
import {type as type_User,query as query_User,mutation as mutation_User} from './User'
import {type as type_UserAccount, query as query_UserAccount,mutation as mutation_UserAccount} from './UserAccount';
import {type as type_Customer, query as query_Customer,mutation as mutation_Customer} from './Customer';

const Schema=`
    scalar DateTime
    scalar Date
    
    type error{
        key:String
        message:String!
    }
    
    ${type_ProductBrand}
    ${type_ProductGroup}
    ${type_Product}
    ${type_User}
    ${type_UserAccount}
    ${type_Customer}
    type Query{
        ${query_ProductBrand}
        ${query_ProductGroup}
        ${query_Product}
        ${query_User}
        ${query_UserAccount}
        ${query_Customer}
    }
    
    type Mutation{
        ${mutation_ProductBrand}
        ${mutation_ProductGroup}
        ${mutation_Product}
        ${mutation_User}
        ${mutation_UserAccount}
        ${mutation_Customer}
    }
    
    
    
    schema{
        query:Query
        mutation:Mutation
    }
    
`;

export default Schema;