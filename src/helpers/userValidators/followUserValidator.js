import Joi from "joi";

export default Joi.object({
  userIdToFollow: Joi.string().required().trim(),
});
