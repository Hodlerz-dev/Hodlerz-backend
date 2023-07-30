import createEvent from "../../handlers/eventHandlers/createEvent.js";
import deleteEvent from "../../handlers/eventHandlers/deleteEvent.js";
import getFamousEvent from "../../handlers/eventHandlers/getFamousEvent.js";
import joinEvent from "../../handlers/eventHandlers/joinEvent.js";
import leaveEvent from "../../handlers/eventHandlers/leaveEvent.js";
import readAllEvents from "../../handlers/eventHandlers/readAllEvents.js";
import researchEvent from "../../handlers/eventHandlers/researchEvent.js";
import updateEvent from "../../handlers/eventHandlers/updateEvent.js";
import createEventValidator from "../../helpers/eventValidators/createEventValidator.js";
import deleteEventValidator from "../../helpers/eventValidators/deleteEventValidator.js";
import joinEventValidator from "../../helpers/eventValidators/joinEventValidator.js";
import leaveEventValidator from "../../helpers/eventValidators/leaveEventValidator.js";
import updateEventValidator from "../../helpers/eventValidators/updateEventValidator.js";

const eventRoutes = [
  {
    method: "POST",
    path: "/event/createEvent",
    handler: createEvent,
    options: {
      auth: "jwt",
      validate: {
        payload: createEventValidator,
      },
    },
  },
  {
    method: "PUT",
    path: "/event/updateEvent/{eventId}",
    handler: updateEvent,
    options: {
      auth: "jwt",
      validate: {
        params: updateEventValidator.params,
        payload: updateEventValidator.payload,
      },
    },
  },
  {
    method: "DELETE",
    path: "/event/deleteEvent/{eventId}",
    handler: deleteEvent,
    options: {
      auth: "jwt",
      validate: {
        params: deleteEventValidator,
      },
    },
  },
  {
    method: "GET",
    path: "/event/readAllEvents",
    handler: readAllEvents,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "PUT",
    path: "/event/joinEvent/{eventId}",
    handler: joinEvent,
    options: {
      auth: "jwt",
      validate: {
        params: joinEventValidator,
      },
    },
  },
  {
    method: "DELETE",
    path: "/event/leaveEvent/{eventId}",
    handler: leaveEvent,
    options: {
      auth: "jwt",
      validate: {
        params: leaveEventValidator,
      },
    },
  },
  {
    method: "GET",
    path: "/event/getFamousEvent",
    handler: getFamousEvent,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/event/researchEvents",
    handler: researchEvent,
    options: {
      auth: "jwt",
    },
  },
];

export default eventRoutes;
