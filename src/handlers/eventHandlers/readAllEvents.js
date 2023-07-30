import { Event } from "../../models/event/eventModel.js";
import Boom from "@hapi/boom";

export default async (request, h) => {
  try {
    const events = await Event.find().exec();

    return h.response({ events }).code(200);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la lecture des événements :",
      error
    );
    return Boom.badImplementation(
      "Une erreur est survenue lors de la lecture des événements.",
      error
    );
  }
};
