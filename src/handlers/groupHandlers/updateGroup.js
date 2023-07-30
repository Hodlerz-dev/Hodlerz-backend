import { Group } from "../../models/group/groupModel.js";
import Boom from "@hapi/boom";

export default async (request, h) => {
  try {
    if (!request.auth.isAuthenticated) {
      console.log(
        "Non authentifié. Les informations d'authentification sont :",
        request.auth
      );
      return Boom.unauthorized(
        "Vous devez être connecté pour mettre à jour un groupe."
      );
    }

    const userId = request.auth.credentials.userId;
    console.log("ID de l'utilisateur connecté :", userId);

    const { groupId } = request.params;
    const { name, description } = request.payload;

    // Vérifier si l'utilisateur est membre du groupe
    const group = await Group.findOne({
      _id: groupId,
      members: userId,
    });

    if (!group) {
      console.log(
        "Groupe non trouvé ou l'utilisateur n'est pas membre. ID du groupe :",
        groupId
      );
      return h
        .response({
          message: "Groupe non trouvé ou vous n'êtes pas membre du groupe.",
        })
        .code(404);
    }

    // Vérifier si l'utilisateur est le créateur du groupe
    if (group.createdBy.toString() !== userId.toString()) {
      return Boom.forbidden(
        "Vous n'êtes pas autorisé à modifier le nom de ce groupe car vous n'êtes pas le créateur."
      );
    }

    // Mettre à jour le nom du groupe
    group.name = name;
    const updatedGroup = await group.save();

    return h.response({ group: updatedGroup }).code(200);
  } catch (error) {
    console.error("Error while updating the group:", error);
    return Boom.badImplementation(
      "Une erreur est survenue lors de la mise à jour du groupe.",
      error
    );
  }
};
