const mongoose = require('mongoose');

const { Schema } = mongoose;

const status = ['APPROVED', 'PENDING', 'COMPLETED'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const BloodRequestSchema = new Schema({
  userId: { type: Schema.ObjectId, ref: 'User', required: [true, 'userId required'] },
  addressId: { type: Schema.ObjectId, ref: 'Address', required: [true, 'address required'] },
  bloodGroup: { type: String, enum: bloodGroups, required: [true, 'blood group required'] },
  date: { type: Date, required: [true, 'date for blood donation required'], 
          min: [getMinimumDate(), 'Date and time must be at least few hours later'] },
  status: { type: String, enum: status, default: 'PENDING', required: [true, 'status required'] },
}, { 
  timestamps: true,
  versionKey: false 
});

function getMinimumDate() {
  let date = new Date();
  date.setHours(date.getHours() + 4);
  return new Date(date);
}

module.exports = mongoose.model('BloodRequest', BloodRequestSchema);