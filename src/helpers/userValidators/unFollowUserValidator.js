import Joi from "joi";

export default Joi.object({
  userIdToUnFollow: Joi.string().required().trim(),
});
