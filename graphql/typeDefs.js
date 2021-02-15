// typeDefs: define los paquetes de informacion que va a devolver una query en graphql y tambien define la query en si

const gql = require('graphql-tag')

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    username: String!
    password: String!
    createdAt: String!
  }
  type Post {
    id: ID!
    title: String, 
    content: String, 
    username: String, 
    createdAt: String,
    likes: [Like],
    comments: [Comment] 
  }
  type Like{
    id: ID!
    username: String,
    createdAt: String
  }
  type Comment{
    id: ID!
    body: String,
    username: String,
    createdAt: String
  }
  type Query{
    sayHi: String!,
    getUsers: [User],
    getPosts: [Post],
    getPost(postId: ID!): Post,
    getUser(userId: ID!): User
  }
`