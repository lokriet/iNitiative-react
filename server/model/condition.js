const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conditionSchema = new Schema({
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

module.exports = mongoose.model('Condition', conditionSchema);