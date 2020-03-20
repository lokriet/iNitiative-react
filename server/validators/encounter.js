const Joi = require('@hapi/joi');

const mapParticipantValidationSchema = Joi.object()
  .keys({
    _id: Joi.any().optional(),
    participantId: Joi.any().required(),
    mapX: Joi.number()
      .min(0)
      .max(Joi.ref('....mapWidth'))
      .required(),
    mapY: Joi.number()
      .min(0)
      .max(Joi.ref('....mapHeight'))
      .required(),
    infoX: Joi.number().required(),
    infoY: Joi.number().required(),
    gridX: Joi.string().allow(null, ''),
    gridY: Joi.string().allow(null, '')
  })
  .unknown(true);

const positionSchema = Joi.object()
  .keys({
    posX: Joi.any().required(),
    posY: Joi.any().required()
  })
  .unknown(true);

const areaEffectValidationSchema = Joi.object()
  .keys({
    _id: Joi.any().optional(),
    name: Joi.string()
      .optional()
      .allow(null, ''),
    type: Joi.string()
      .equal('rectangle', 'circle', 'segment')
      .required(),
    color: Joi.string()
      .regex(/^#[0-9a-f]{6}/i)
      .required(),
    gridWidth: Joi.number()
      .min(0)
      .max(1000)
      .required(),
    gridHeight: Joi.number()
      .min(0)
      .max(1000)
      .required(),
    angle: Joi.number()
      .optional()
      .allow(null, ''),
    position: Joi.object()
      .keys({
        x: Joi.any().required().strip(false),
        y: Joi.any().required().strip(false)
      })
      .unknown(true)
      .required(),
    followingParticipantId: Joi.any()
      .optional()
      .allow(null, '')
  })
  .unknown(true);

const mapValidationSchema = Joi.object()
  .keys({
    _id: Joi.any().optional(),
    mapUrl: Joi.string()
      .uri()
      .required(),
    mapWidth: Joi.number()
      .min(1)
      .max(2000)
      .required(),
    mapHeight: Joi.number()
      .min(1)
      .max(1500)
      .required(),
    gridWidth: Joi.number()
      .min(1)
      .max(1000)
      .allow(null, ''),
    gridHeight: Joi.number()
      .min(1)
      .max(1000)
      .allow(null, ''),
    gridColor: Joi.string()
      .regex(/^#[0-9a-f]{6}/i)
      .optional(),
    showGrid: Joi.bool().required(),
    showInfo: Joi.bool().required(),
    showDead: Joi.bool().required(),
    snapToGrid: Joi.bool().required(),
    participantCoordinates: Joi.array()
      .items(mapParticipantValidationSchema)
      .unique((a, b) => {
        let aId;
        if (typeof a.participantId === 'object' && '_id' in a.participantId) {
          aId = a.participantId._id.toString();
        } else {
          aId = a.participantId.toString();
        }

        let bId;
        if (typeof b.participantId === 'object' && '_id' in b.participantId) {
          bId = b.participantId._id.toString();
        } else {
          bId = b.participantId.toString();
        }

        console.log('comparator', aId, bId);
        return aId === bId;
      }),
    areaEffects: Joi.array().items(areaEffectValidationSchema)
  })
  .unknown(true);

const participantValidationSchema = Joi.object()
  .keys({
    _id: Joi.any().optional(),
    type: Joi.string()
      .equal('player', 'monster')
      .required(),
    avatarUrl: Joi.string()
      .uri()
      .allow(null, ''),
    name: Joi.string()
      .max(200)
      .trim()
      .required(),
    color: Joi.string()
      .regex(/^#[0-9a-f]{6}/i)
      .allow(null, ''),
    initiativeModifier: Joi.number().required(),
    rolledInitiative: Joi.number()
      .min(1)
      .max(20)
      .allow(null, ''),
    maxHp: Joi.number()
      .min(1)
      .required(),
    currentHp: Joi.number()
      .min(0)
      .required(),
    temporaryHp: Joi.number()
      .min(1)
      .allow(null, ''),
    armorClass: Joi.number()
      .min(0)
      .required(),
    temporaryArmorClass: Joi.number()
      .min(0)
      .allow(null, ''),
    speed: Joi.number()
      .min(1)
      .required(),
    swimSpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    climbSpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    flySpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    temporarySpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    temporarySwimSpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    temporaryClimbSpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    temporaryFlySpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    mapSize: Joi.number()
      .min(1)
      .required(),

    immunities: Joi.object()
      .keys({
        damageTypes: Joi.array()
          .items(Joi.any())
          .required(),
        conditions: Joi.array()
          .items(Joi.any())
          .required()
      })
      .unknown(true),
    vulnerabilities: Joi.array()
      .items(Joi.any())
      .required(),
    resistances: Joi.array()
      .items(Joi.any())
      .required(),
    features: Joi.array()
      .items(Joi.any())
      .required(),
    conditions: Joi.array()
      .items(Joi.any())
      .required(),

    advantages: Joi.string()
      .max(5000)
      .trim()
      .allow(null, ''),
    comment: Joi.string()
      .max(5000)
      .trim()
      .allow(null, '')
  })
  .unknown(true);

const encounterValidationSchema = Joi.object()
  .keys({
    _tempId: Joi.any().forbidden(),
    _id: Joi.any().optional(),
    name: Joi.string()
      .max(200)
      .trim()
      .required(),
    participants: Joi.array()
      .items(participantValidationSchema)
      .unique((a, b) => a.name === b.name),
    activeParticipantId: Joi.string().allow(null, ''),
    map: mapValidationSchema.allow(null)
  })
  .unknown(true);

module.exports = {
  encounterValidationSchema,
  participantValidationSchema,
  mapValidationSchema,
  positionSchema,
  areaEffectValidationSchema,
  mapParticipantValidationSchema
};
