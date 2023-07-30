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

    const users = await User.find({}, { password: 0 });

    if (!users || users.length === 0) {
      return h.response({ message: "Aucun utilisateur trouvé." }).code(404);
    }

    return h.response(users).code(200);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la récupération des utilisateurs :",
      error
    );
    return Boom.badImplementation(
      "Une erreur est survenue lors de la récupération des utilisateurs.",
      error
    );
  }
};
