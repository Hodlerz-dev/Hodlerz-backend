import Joi from "joi";

export default Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  date: Joi.date().iso().required(),
  location: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).required(),
    address: Joi.string().required().trim(),
  }),
  organizer: Joi.string().required().trim(), // is the organizer a chain ?
});
