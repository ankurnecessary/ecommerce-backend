import 'graphql-import-node';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  resolvers as userResolvers,
  typeDefs as userTypeDefs
} from './entities/users';

const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs],
  resolvers: [userResolvers]
});

export default schema;
