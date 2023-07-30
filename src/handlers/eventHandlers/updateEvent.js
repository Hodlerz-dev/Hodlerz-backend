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

    const eventToUpdate = await Event.findById(eventId);

    console.log(userId.toString(), eventToUpdate.organizer.toString());

    if (!eventToUpdate) {
      console.log(
        "Événement à mettre à jour non trouvé. ID de l'événement :",
        eventId
      );
      return h
        .response({ message: "Événement à mettre à jour non trouvé." })
        .code(404);
    }

    // Check if user connected is the creator
    if (eventToUpdate.organizer.toString() !== userId.toString()) {
      console.log(
        "Utilisateur non autorisé à mettre à jour l'événement. ID de l'utilisateur :",
        userId
      );
      return Boom.unauthorized(
        "Vous n'êtes pas autorisé à mettre à jour cet événement."
      );
    }

    // Récupérer les données de mise à jour à partir du payload de la requête
    const { title, description, date, location } = request.payload;

    // Mettre à jour les champs de l'événement
    eventToUpdate.title = title;
    eventToUpdate.description = description;
    eventToUpdate.date = date;
    eventToUpdate.location = location;

    // Enregistrer les modifications dans la base de données
    const updatedEvent = await eventToUpdate.save();

    return h
      .response({
        message: "Événement mis à jour avec succès.",
        event: updatedEvent,
      })
      .code(200);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la mise à jour de l'événement :",
      error
    );
    return Boom.badImplementation(
      "Une erreur est survenue lors de la mise à jour de l'événement.",
      error
    );
  }
};
