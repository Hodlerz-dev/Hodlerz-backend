import { Event } from "../../models/event/eventModel.js";

export default async (request, h) => {
  try {
    const famousEvents = await Event.find()
      .sort({ "attendees.length": -1 })
      .limit(10);

    // Répondre avec les événements populaires
    return h.response(famousEvents).code(200);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des événements populaires :",
      error
    );
    return h
      .response({
        error:
          "Une erreur est survenue lors de la récupération des événements populaires.",
      })
      .code(500);
  }
};
