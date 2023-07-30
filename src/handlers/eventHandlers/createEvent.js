import { Event } from "../../models/event/eventModel.js";
import { User } from "../../models/user/userModel.js";
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

    const organizerId = request.auth.credentials.userId;
    console.log("ID de l'organisateur de l'événement :", organizerId);

    const { title, description, date, location, address } = request.payload;

    // Créer un nouvel événement
    const newEvent = new Event({
      title,
      description,
      date,
      location: {
        type: "Point",
        coordinates: location.coordinates,
        address: location.address,
      },
      organizer: organizerId,
      attendees: [organizerId], // L'organisateur est également un participant
      followersOfAttendees: [], // Pas de followers pour l'instant
      brozOfAttendees: [], // Pas de broz pour l'instant
    });

    const savedEvent = await newEvent.save();

    const updatedOrganizer = await User.findByIdAndUpdate(
      organizerId,
      { $addToSet: { eventsOrganized: savedEvent._id } },
      { new: true }
    );

    if (!updatedOrganizer) {
      console.log(
        "Utilisateur organisateur non trouvé lors de la mise à jour. ID de l'utilisateur :",
        organizerId
      );
      return h
        .response({ message: "Utilisateur organisateur non trouvé." })
        .code(404);
    }

    return h
      .response({ message: "Événement créé avec succès.", event: savedEvent })
      .code(201);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la création de l'événement :",
      error
    );
    return Boom.badImplementation(
      "Une erreur est survenue lors de la création de l'événement.",
      error
    );
  }
};
