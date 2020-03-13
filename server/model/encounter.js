const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var encounterParticipantSchema = new Schema({
  type: {
    type: String,
    required: true
  },

  avatarUrl: String,

  name: {
    type: String,
    required: true
  },

  color: String,

  initiativeModifier: {
    type: Number,
    required: true
  },

  rolledInitiative: Number,

  maxHp: {
    type: Number,
    required: true
  },

  currentHp: {
    type: Number,
    required: true
  },

  temporaryHp: Number,

  armorClass: {
    type: Number,
    required: true
  },

  temporaryArmorClass: Number,

  speed: {
    type: Number,
    required: true
  },

  swimSpeed: Number,
  climbSpeed: Number,
  flySpeed: Number,

  temporarySpeed: Number,
  temporarySwimSpeed: Number,
  temporaryClimbSpeed: Number,
  temporaryFlySpeed: Number,

  mapSize: {
    type: Number,
    required: true
  },

  immunities: {
    damageTypes: [{ type: Schema.Types.ObjectId, ref: 'DamageType' }],
    conditions: [{ type: Schema.Types.ObjectId, ref: 'Condition' }]
  },
  vulnerabilities: [{ type: Schema.Types.ObjectId, ref: 'DamageType' }],
  resistances: [{ type: Schema.Types.ObjectId, ref: 'DamageType' }],
  features: [{ type: Schema.Types.ObjectId, ref: 'Feature' }],
  conditions: [{ type: Schema.Types.ObjectId, ref: 'Condition' }],

  advantages: String,
  comment: String
});

const mapSchema = new Schema({
  mapUrl: {
    type: String,
    required: true
  },
  mapWidth: Number,
  mapHeight: Number,
  gridWidth: Number,
  gridHeight: Number,
  gridColor: String,
  showGrid: Boolean,
  participantCoordinates: [
    {
      participantId: {
        type: Schema.Types.ObjectId,
        ref: 'Encounter.participants',
        required: true
      },

      mapX: {
        type: Number,
        required: true
      },
      mapY: {
        type: Number,
        required: true
      },
      infoX: {
        type: Number,
        required: true
      },
      infoY: {
        type: Number,
        required: true
      },
      gridX: Number,
      gridY: Number
    }
  ]
});

const encounterSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },

    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    participants: [encounterParticipantSchema],

    map: mapSchema,

    activeParticipantId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Encounter', encounterSchema);
