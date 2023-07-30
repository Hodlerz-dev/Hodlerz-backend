import { Event } from "../../models/event/eventModel.js";
import Boom from "@hapi/boom";

export default async (request, h) => {
  try {
    const { title, location, date, attendees } = request.query;

    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (location) {
      filter["location.address"] = { $regex: location, $options: "i" };
    }
    if (date) {
      // Convert in object
      const searchDate = new Date(date);
      // Defined dates interval
      const startDate = new Date(searchDate.setHours(0, 0, 0, 0));
      const endDate = new Date(searchDate.setHours(23, 59, 59, 999));
      filter.date = { $gte: startDate, $lte: endDate };
    }
    if (attendees) {
      filter.attendees = attendees;
    }

    // Search events
    const events = await Event.find(filter);

    return h.response(events).code(200);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la recherche d'événements :",
      error
    );
    return Boom.badImplementation(
      "Une erreur est survenue lors de la recherche d'événements.",
      error
    );
  }
};
