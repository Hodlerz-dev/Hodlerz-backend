import Joi from "joi";

export default Joi.object({
  eventId: Joi.string().required().trim(), // Assurez-vous que l'ID de l'événement est une chaîne
});
