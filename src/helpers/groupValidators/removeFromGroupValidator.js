import Joi from "joi";

export default Joi.object({
  groupId: Joi.string().required(),
  memberIds: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .unique()
    .required(),
});
