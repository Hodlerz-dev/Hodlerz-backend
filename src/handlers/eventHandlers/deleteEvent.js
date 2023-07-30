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

    const eventToDelete = await Event.findById(eventId);

    if (!eventToDelete) {
      console.log(
        "Événement à supprimer non trouvé. ID de l'événement :",
        eventId
      );
      return h
        .response({ message: "Événement à supprimer non trouvé." })
        .code(404);
    }

    // Vérifier si l'utilisateur connecté est bien l'organisateur de l'événement
    if (eventToDelete.organizer.toString() !== userId.toString()) {
      console.log(
        "Utilisateur non autorisé à supprimer l'événement. ID de l'utilisateur :",
        userId
      );
      return Boom.unauthorized(
        "Vous n'êtes pas autorisé à supprimer cet événement."
      );
    }

    // Supprimer l'événement de la base de données
    await Event.deleteOne({ _id: eventId });

    return h.response({ message: "Événement supprimé avec succès." }).code(200);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la suppression de l'événement :",
      error
    );
    return Boom.badImplementation(
      "Une erreur est survenue lors de la suppression de l'événement.",
      error
    );
  }
};
