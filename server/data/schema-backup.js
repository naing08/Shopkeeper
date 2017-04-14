/**
 * Created by ChitSwe on 12/21/16.
 */
const Schema=`
    scalar DateTime
    scalar Date
    type Query{
        hello:String
    }
    
    
    
    type Query{
        ProductBrand(page:Int!,pageSize:Int!,search:String):ProductBrands
    }
    
    type Mutation{
        ProductBrand(Alias:String!,Name:String!,Photo:String,PhotoFormat:String,id:Int):ProductBrandMutationResult
        deleteProductBrand(id:Int!):ProductBrand
        undoDeleteProductBrand(id:Int!):ProductBrand
    }
    
    type error{
        key:String
        message:String!
    }
    
    type ProductBrandMutationResult{
        instance:ProductBrand
        errors:[error]
    }
    
    schema{
        query:Query
        mutation:Mutation
    }
    
`;

export default Schema;