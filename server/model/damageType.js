const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const damageTypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isHomebrew: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('DamageType', damageTypeSchema);