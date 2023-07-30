import Joi from "joi";

export default Joi.object({
  brozIdToFollow: Joi.string().required().trim(),
});
