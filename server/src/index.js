const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const resolvers = require('./resolvers');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
  errorFormat: 'minimal'
});

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: {
    prisma
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
