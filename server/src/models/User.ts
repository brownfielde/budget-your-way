import { Schema, model, Document } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
 },
 password: {
    type: String,
    required: true,
    minlength: 6,
 },
createdAt: {
    type: Date,
    default: Date.now,
},
  });

module.exports =  model('User', userSchema);
