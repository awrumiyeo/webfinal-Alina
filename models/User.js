const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  gender: { type: String },
  role: { type: String, default: 'user' }, // 'admin', 'editor', or 'user'
  twoFactorCode: { type: String },
  twoFactorCodeExpires: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
