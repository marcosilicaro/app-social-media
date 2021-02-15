// modelo de como guarda la informacion mongodb

const { model, Schema } = require('mongoose');

const postSchema = new Schema ({
  title: String, 
  content: String, 
  username: String, 
  createdAt: String,
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  comments: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ],
  user: [
    {
      type: Schema.Types.ObjectId
    }
  ]
})

module.exports = model('Post', postSchema);