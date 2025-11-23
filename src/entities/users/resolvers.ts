import { type Resolvers } from '../../types/resolver-types';

const resolvers: Resolvers = {
  Query: {
    me: () => {
      return {
        id: '2'
      };
    }
  }
};

export default resolvers;
