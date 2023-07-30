import Joi from "joi";

export default Joi.object({
  eventId: Joi.string().required(),
});
