const mongoose = require('mongoose');

const { Schema } = mongoose;

const userStatus = ['APPROVED', 'DELETED', 'PENDING'];
const userTypes = ['ADMIN', 'DONOR', 'MEMBER'];

const LoginSchema = new Schema({
  role: { type: String, enum: userTypes },
  email: { type: String, unique: [true, 'email already exists'], required: [true, 'email required'] },
  password: { type: String, required: [true, 'password required'] },
  token: [{ type: String }],
  status: { type: String, enum: userStatus },
  userId: { type: Schema.ObjectId, ref: 'User', unique: true, required: [true, 'userId required'] },
}, { 
  timestamps: true,
  versionKey: false 
});

module.exports = mongoose.model('Login', LoginSchema);
