import { Event } from "../../models/event/eventModel.js";
import Boom from "@hapi/boom";

export default async (request, h) => {
  try {
    if (!request.auth.isAuthenticated) {
      console.log(
        "Non authentifié. Les informations d'authentification sont :",
        request.auth
      );
      return Boom.unauthorized("Utilisateur non authentifié");
    }

    const userId = request.auth.credentials.userId;
    console.log("ID de l'utilisateur connecté :", userId);

    const { eventId } = request.params;

    const eventToJoin = await Event.findById(eventId);

    if (!eventToJoin) {
      console.log(
        "Événement à rejoindre non trouvé. ID de l'événement :",
        eventId
      );
      return h
        .response({ message: "Événement à rejoindre non trouvé." })
        .code(404);
    }

    // Vérifier si l'utilisateur est déjà inscrit à l'événement
    if (eventToJoin.attendees.includes(userId)) {
      console.log(
        "Utilisateur déjà inscrit à l'événement. ID de l'utilisateur :",
        userId
      );
      return h
        .response({ message: "Vous êtes déjà inscrit à cet événement." })
        .code(200);
    }

    // Ajouter l'utilisateur à la liste des participants
    eventToJoin.attendees.push(userId);
    await eventToJoin.save();

    return h
      .response({ message: "Vous avez rejoint l'événement avec succès." })
      .code(200);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de l'inscription à l'événement :",
      error
    );
    return Boom.badImplementation(
      "Une erreur est survenue lors de l'inscription à l'événement.",
      error
    );
  }
};
