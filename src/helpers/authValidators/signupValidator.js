import Joi from "joi";

export default Joi.object({
  pseudo: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
