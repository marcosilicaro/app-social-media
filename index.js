const {ApolloServer} = require('apollo-server')
const mongoose = require('mongoose')
const {connection_url} = require('./config')
const typeDefs = require('./graphql/typeDefs')
const resolvers= require('./graphql/resolvers')

const server = new ApolloServer({
    typeDefs,
    resolvers
})

mongoose
  .connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch(err => {
    console.error(err)
  })