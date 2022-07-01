const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const AmazonProduct = require('./resolvers');
const fs = require('fs');

const prisma = new PrismaClient({
  errorFormat: 'minimal'
});

const resolvers = {
  AmazonProduct
}

const typeDefs = {typeDefs: fs.readFileSync(
  "./src/schema.graphql",
  'utf8'
)};

console.log(typeDefs)
const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: {
    prisma
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
