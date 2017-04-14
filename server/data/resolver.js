/**
 * Created by ChitSwe on 1/2/17.
 */
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import {resolver as resolver_ProductBrand} from './ProductBrand';
import {resolver as resolver_ProductGroup} from './ProductGroup';
import {resolver as resolver_Product} from './Product';
import {resolver as resolver_User} from './User';
import {resolver as resolver_UserAccount} from './UserAccount';
import {resolver as resolver_Customer} from './Customer';
const Resolver={
    DateTime:new GraphQLScalarType({
        name: 'DateTime',
        description: 'Date time custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.toJSON(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
    Date:new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return (new Date(value)).dateOnly(); // value from the client
        },
        serialize(value) {
            return value.toDateOnlyJSON(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return new Date(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
    Query:{

    },
    Mutation:{


    }
};

Object.assign(Resolver,resolver_ProductBrand.type);
Object.assign(Resolver.Query,resolver_ProductBrand.query);
Object.assign(Resolver.Mutation,resolver_ProductBrand.mutation);



Object.assign(Resolver,resolver_ProductGroup.type);
Object.assign(Resolver.Query, resolver_ProductGroup.query);
Object.assign(Resolver.Mutation,resolver_ProductGroup.mutation);

Object.assign(Resolver,resolver_Product.type);
Object.assign(Resolver.Query,resolver_Product.query);
Object.assign(Resolver.Mutation,resolver_Product.mutation);

Object.assign(Resolver,resolver_User.type);
Object.assign(Resolver.Query,resolver_User.query);
Object.assign(Resolver.Mutation,resolver_User.mutation);

Object.assign(Resolver,resolver_UserAccount.type);
Object.assign(Resolver.Query,resolver_UserAccount.query);
Object.assign(Resolver.Mutation,resolver_UserAccount.mutation);

Object.assign(Resolver,resolver_Customer.type);
Object.assign(Resolver.Query,resolver_Customer.query);
Object.assign(Resolver.Mutation,resolver_Customer.mutation);

export default  Resolver;