const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const participantTemplateSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  
  avatarUrl: String,
  color: String,

  name: {
    type: String,
    required: true
  },
  
  initiativeModifier: {
    type: Number,
    required: true
  },

  maxHp: {
    type: Number,
    required: true
  },

  armorClass: {
    type: Number,
    required: true
  },

  speed: {
    type: Number,
    required: true
  },

  swimSpeed: Number,
  climbSpeed: Number,
  flySpeed: Number,

  mapSize: {
    type: Number,
    required: true
  },

  immunities: {
    damageTypes: [{ type : Schema.Types.ObjectId, ref: 'DamageType' }],
    conditions: [{ type : Schema.Types.ObjectId, ref: 'Condition' }]
  },
  vulnerabilities: [{ type : Schema.Types.ObjectId, ref: 'DamageType' }],
  resistances: [{ type : Schema.Types.ObjectId, ref: 'DamageType' }],
  features: [{ type : Schema.Types.ObjectId, ref: 'Feature' }],

  comment: String,

  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('ParticipantTemplate', participantTemplateSchema);