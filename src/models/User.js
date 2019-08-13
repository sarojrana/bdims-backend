const mongoose = require('mongoose');

const { Schema } = mongoose;

const gender = ['FEMALE', 'MALE', 'OTHER'];
const userStatus = ['ACTIVE', 'DELETED'];
const userTypes = ['ADMIN', 'DONOR', 'MEMBER'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const UserSchema = new Schema({
  firstName: { type: String, trim: true, required: [true, 'first name required'] },
  lastName: { type: String, trim: true, required: [true, 'last name required'] },
  email: { type: String, unique: [true, 'email already exists'], required: [true, 'email required'] },
  mobile: { type: String, unique: [true, 'mobile already exists'], required: [true, 'mobile number required'] },
  dob: { type: Date, max: [getMaximumDOB(), 'Must be 18 years old'] },
  gender: { type: String, enum: gender, required: [true, 'gender required'] },
  province: { type: String },
  district: { type: String },
  bloodGroup: { type: String, enum: bloodGroups, required: [true, 'blood group required'] },
  role: { type: String, default: 'MEMBER', enum: userTypes },
  status: { type: String, default: 'ACTIVE', enum: userStatus, required: [true, 'status required'] },
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
  if(this.dob) {
    return date.getFullYear() - bDate.getFullYear();
  } else {
    return '';
  }  
});

function getMaximumDOB() {
  let date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return new Date(date);
}

module.exports = mongoose.model('User', UserSchema);


