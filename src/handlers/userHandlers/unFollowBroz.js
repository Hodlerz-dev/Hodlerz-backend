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
    const { brozIdToUnfollow } = request.params;

    const brozToUnfollow = await User.findById(brozIdToUnfollow);
    if (!brozToUnfollow) {
      console.log(
        "Utilisateur à ne plus suivre non trouvé. ID de l'utilisateur :",
        brozIdToUnfollow
      );
      return h
        .response({ message: "Utilisateur à ne plus suivre non trouvé." })
        .code(404);
    }

    // Vérifier si l'utilisateur est déjà unfollow
    const user = await User.findById(userId);
    if (!user.followingBroz.includes(brozIdToUnfollow)) {
      return h.response({ message: "Utilisateur déjà unfollow." }).code(200);
    }

    // Mettre à jour l'utilisateur connecté en retirant l'utilisateur à ne plus suivre de sa liste de suivi
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { followingBroz: brozIdToUnfollow } },
      { new: true }
    );

    if (!updatedUser) {
      console.log(
        "Utilisateur non trouvé lors de la mise à jour. ID de l'utilisateur :",
        userId
      );
      return h.response({ message: "Utilisateur non trouvé." }).code(404);
    }

    // Mettre à jour la section 'broz' de l'utilisateur à ne plus suivre en retirant l'ID de l'utilisateur connecté de sa liste de followers
    const updatedBrozToUnfollow = await User.findOneAndUpdate(
      { _id: brozIdToUnfollow },
      { $pull: { broz: userId } },
      { new: true }
    );

    if (!updatedBrozToUnfollow) {
      console.log(
        "Utilisateur à ne plus suivre non trouvé lors de la mise à jour. ID de l'utilisateur :",
        brozIdToUnfollow
      );
      return h
        .response({ message: "Utilisateur à ne plus suivre non trouvé." })
        .code(404);
    }

    return h
      .response({ message: "Utilisateur retiré de la liste de suivi." })
      .code(200);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors du retrait de la liste de suivi :",
      error
    );
    return Boom.badImplementation(
      "Une erreur est survenue lors du retrait de la liste de suivi.",
      error
    );
  }
};
