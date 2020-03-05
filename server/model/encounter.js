const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const encounterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('Encounter', encounterSchema);