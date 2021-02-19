//resolvers: donde se resuelven las queries definidas en typeDefs

const User = require('../models/User')
const Post = require('../models/Post')
const { SECRET_KEY } = require('../secret/secretKey')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

module.exports = {
  Query: {
    sayHi: () => 'Hello',
    async getUsers() {
      try {
        const users = await User.find()
        return users
      } catch (err) {
        throw new Error(err)
      }
    },
    async getPosts() {
      try {
        const posts = await Post.find()
        return posts
      } catch (err) {
        throw new Error(err)
      }
    },
    async getPost(_, { postId }) {
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
    async getUser(_, { userId }) {
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
  },
  Mutation: {
    async registerUser(
      _,
      {
        registerInput: { username, email, password, confirmPassword }
      }
    ) {
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = generateToken(res)


      return {
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
}