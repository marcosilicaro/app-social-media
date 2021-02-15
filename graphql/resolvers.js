//resolvers: donde se resuelven las queries definidas en typeDefs

const User = require('../models/User')
const Post = require('../models/Post')

module.exports = {
    Query : {
        sayHi:() => 'Hello',
        async getUsers(){
            try{
                const users = await User.find()
                return users
            } catch (err){
                throw new Error(err)
            }
        },
        async getPosts(){
            try{
                const posts = await Post.find()
                return posts
            } catch (err){
                throw new Error(err)
            }
        },
        async getPost(_,{postId}){
            try {
                const post = await Post.findById(postId);
                if (post) {
                  return (post)
                } else {
                  throw new Error('Post not found');
                }
              } catch (err) {
                throw new Error(err);
              }
        },
        async getUser(_,{userId}){
            try {
                const user = await User.findById(userId);
                if (user) {
                  return (user)
                } else {
                  throw new Error('User not found');
                }
              } catch (err) {
                throw new Error(err);
              }
        }
    }
}