const mongoose = require('mongoose');

const { Schema } = mongoose;

const DonationSchema = new Schema({
  userId: { type: Schema.ObjectId, ref: 'User', required: [true, 'userId required'] },
  date: { type: Date, required: [true, 'date of blood donation required'] },
}, { 
  timestamps: true,
  versionKey: false 
});

module.exports = mongoose.model('donation', DonationSchema);