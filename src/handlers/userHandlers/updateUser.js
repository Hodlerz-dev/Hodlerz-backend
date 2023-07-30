import { User } from "../../models/user/userModel.js";

// PUT

export default async (request, h) => {
  try {
    // Récupérer l'ID de l'utilisateur connecté à partir du token JWT
    const userId = request.auth.credentials.userId;

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return h.response({ message: "Utilisateur non trouvé." }).code(404);
    }

    // Mettre à jour les informations de l'utilisateur avec les données fournies dans la requête
    user.picture = request.payload.picture;
    user.twitter = request.payload.twitter;
    user.country = request.payload.country;
    user.city = request.payload.city;
    user.job = request.payload.job;
    user.sideProject = request.payload.sideProject;
    user.followersInCommon = request.payload.followersInCommon;
    user.followers = request.payload.followers;
    user.skillz = request.payload.skillz;
    user.interests = request.payload.interests;
    user.learning = request.payload.learning;
    user.updatedAt = Date.now();

    // Enregistrer les modifications dans la base de données
    await user.save();

    // Répondre avec succès
    return h
      .response({ message: "Utilisateur mis à jour avec succès." })
      .code(200);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    return h
      .response({
        error:
          "Une erreur est survenue lors de la mise à jour de l'utilisateur.",
      })
      .code(500);
  }
};
