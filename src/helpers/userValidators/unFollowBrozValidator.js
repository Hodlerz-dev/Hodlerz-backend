import Joi from "joi";

export default Joi.object({
  brozIdToUnfollow: Joi.string().required().trim(),
});
