//resolvers: donde se resuelven las queries definidas en typeDefs

const User = require('../models/User')
const Post = require('../models/Post')
const { SECRET_KEY } = require('../secret/secretKey')
const { UserInputError } = require('apollo-server')
const { registerInputsValidation } = require('../util/registerInputsValidation')
const checkAuth = require('../util/check-auth')
const { AuthenticationError } = require('apollo-server')

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

      // VALIDATION

      // empty user?
      const { valid, errors } = registerInputsValidation(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // existing user validation
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        throw new UserInputError('Username is taken')
      }

      // existing email validation
      const existingEmail = await User.findOne({ email })
      if (existingEmail) {
        throw new UserInputError('Email is taken')
      }

      const res = await newUser.save();

      const token = generateToken(res)


      return {
        ...res._doc,
        id: res._id,
        token
      };
    },
    async loginUser(
      _,
      {
        username, password
      }
    ) {

      // existing user?
      const existingUser = await User.findOne({ username })
      if (!existingUser) {
        throw new UserInputError('There are no users with that username')
      }

      // password correct?
      const matchingPasswords = await bcrypt.compare(password, existingUser.password)
      if (!matchingPasswords) {
        throw new UserInputError('Wrong Credentials')
      }

      const token = generateToken(existingUser)

      return {
        ...existingUser._doc,
        id: existingUser._id,
        token
      };
    },
    async createPost(
      _, { title, content }, context
    ) {

      const user = checkAuth(context);

      const newPost = new Post({
        title,
        content,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      return post;

    },
    async deletePost(
      _, { postId }, context
    ) {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }

    }
  }
}