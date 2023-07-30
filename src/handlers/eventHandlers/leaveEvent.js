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

    const eventToLeave = await Event.findById(eventId);

    if (!eventToLeave) {
      console.log(
        "Événement à quitter non trouvé. ID de l'événement :",
        eventId
      );
      return h
        .response({ message: "Événement à quitter non trouvé." })
        .code(404);
    }

    // Vérifier si l'utilisateur est déjà inscrit à l'événement
    if (!eventToLeave.attendees.includes(userId)) {
      console.log(
        "Utilisateur n'est pas inscrit à l'événement. ID de l'utilisateur :",
        userId
      );
      return h
        .response({ message: "Vous n'êtes pas inscrit à cet événement." })
        .code(200);
    }

    // Retirer l'utilisateur de la liste des participants
    eventToLeave.attendees.pull(userId);
    await eventToLeave.save();

    return h
      .response({ message: "Vous avez quitté l'événement avec succès." })
      .code(200);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la sortie de l'événement :",
      error
    );
    return Boom.badImplementation(
      "Une erreur est survenue lors de la sortie de l'événement.",
      error
    );
  }
};
