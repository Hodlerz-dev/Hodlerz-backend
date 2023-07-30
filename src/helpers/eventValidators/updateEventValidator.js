import Joi from "joi";

export default Joi.object({
  params: Joi.object({
    eventId: Joi.string().required().trim(), // Assurez-vous que l'ID de l'événement est une chaîne
  }),
  payload: Joi.object({
    title: Joi.string().trim(),
    description: Joi.string().trim(),
    date: Joi.date(),
    location: Joi.object({
      type: Joi.string().valid("Point"),
      coordinates: Joi.array().items(Joi.number().min(-180).max(180)).length(2),
      address: Joi.string().trim(),
    }),
    organizer: Joi.string().alphanum().trim(), // Assurez-vous que l'ID de l'organisateur est une chaîne alphanumérique
    attendees: Joi.array().items(Joi.string().alphanum().trim()), // Assurez-vous que les ID des participants sont des chaînes alphanumériques
    followersOfAttendees: Joi.array().items(Joi.string().alphanum().trim()), // Assurez-vous que les ID des followers des participants sont des chaînes alphanumériques
    brozOfAttendees: Joi.array().items(Joi.string().alphanum().trim()), // Assurez-vous que les ID des "broz" des participants sont des chaînes alphanumériques
  }).min(1), // Au moins un champ doit être spécifié pour la mise à jour
});
