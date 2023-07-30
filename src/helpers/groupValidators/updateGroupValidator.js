import Joi from "joi";

export default Joi.object({
  params: Joi.object({
    groupId: Joi.string().required(),
  }),
  payload: Joi.object({
    name: Joi.string().required().min(1).max(100),
    description: Joi.string().allow("").max(500),
  }),
});
