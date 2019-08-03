const mongoose = require('mongoose');

const { Schema } = mongoose;

const gender = ['FEMALE', 'MALE', 'OTHER'];
const userStatus = ['APPROVED', 'DELETED', 'PENDING'];
const userTypes = ['ADMIN', 'DONOR', 'MEMBER'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const UserSchema = new Schema({
  firstName: { type: String, trim: true, required: [true, 'first name required'] },
  lastName: { type: String, trim: true, required: [true, 'last name required'] },
  email: { type: String, unique: [true, 'email already exists'], required: [true, 'email required'] },
  mobile: { type: String, unique: [true, 'mobile already exists'], required: [true, 'mobile number required'] },
  dob: { type: Date, required: [true, 'date of birth required'], max: getMaximumDOB() },
  gender: { type: String, enum: gender, required: [true, 'gender required'] },
  addressId: { type: Schema.ObjectId, ref: 'Address', required: [true, 'address required'] },
  bloodGroup: { type: String, enum: bloodGroups, required: [true, 'blood group required'] },
  role: { type: String, enum: userTypes, default: 'MEMBER' },
  status: { type: String, enum: userStatus, default: 'PENDING', required: [true, 'status required'] },
  docImage: { type: String },
}, { 
  timestamps: true,
  versionKey: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

UserSchema.virtual('age').get(function () {
  const date = new Date();
  const bDate = new Date(this.dob);
  return date.getFullYear() - bDate.getFullYear();
});

function getMaximumDOB() {
  let date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return new Date(date);
}

module.exports = mongoose.model('User', UserSchema);


