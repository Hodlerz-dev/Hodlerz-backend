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

    const userId = request.auth.credentials.userId;
    console.log("ID de l'utilisateur connecté :", userId);

    // Ce sera peut-être request.payload au lieu de request.params
    const { brozIdToFollow } = request.params;

    const brozToFollow = await User.findById(brozIdToFollow);

    if (!brozToFollow) {
      console.log(
        "Utilisateur à suivre non trouvé. ID de l'utilisateur :",
        brozIdToFollow
      );
      return h
        .response({ message: "Utilisateur à suivre non trouvé." })
        .code(404);
    }

    const user = await User.findById(userId);
    if (user.followingBroz.includes(brozIdToFollow)) {
      return h
        .response({ message: "Utilisateur déjà dans la liste de suivi." })
        .code(200);
    }

    // Mettre à jour l'utilisateur connecté en ajoutant l'utilisateur à suivre dans sa liste de suivi
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { followingBroz: brozIdToFollow } },
      { new: true }
    );

    if (!updatedUser) {
      console.log(
        "Utilisateur non trouvé lors de la mise à jour. ID de l'utilisateur :",
        userId
      );
      return h.response({ message: "Utilisateur non trouvé." }).code(404);
    }

    // Mettre à jour la section 'broz' de l'utilisateur suivi
    const updatedBrozToFollow = await User.findOneAndUpdate(
      { _id: brozIdToFollow },
      { $addToSet: { broz: userId._id } }, // Mise à jour pour ajouter l'ID de l'utilisateur dans la liste des followers du broz
      { new: true }
    );

    if (!updatedBrozToFollow) {
      console.log(
        "Utilisateur à suivre non trouvé lors de la mise à jour. ID de l'utilisateur :",
        brozIdToFollow
      );
      return h
        .response({ message: "Utilisateur à suivre non trouvé." })
        .code(404);
    }

    return h
      .response({ message: "Utilisateur ajouté à la liste de suivi." })
      .code(200);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de l'ajout à la liste de suivi :",
      error
    );
    return Boom.badImplementation(
      "Une erreur est survenue lors de l'ajout à la liste de suivi.",
      error
    );
  }
};
