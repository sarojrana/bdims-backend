const mongoose = require('mongoose')

const { Schema } = mongoose

const AddressSchema = new Schema({
  province: { type: String, trim: true, required: [true, 'province required'] },
  district: { type: String, trim: true, required: [true, 'district required'] }
}, {
    timestamps: true,
    versionKey: false
})
  
module.exports = mongoose.model('Address', AddressSchema);