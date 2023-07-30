import { User } from "../../models/user/userModel.js";

// Delete

export default async (request, h) => {
  try {
    // Récupérer l'ID de l'utilisateur connecté à partir du token JWT
    const userId = request.auth.credentials.userId;

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return h.response({ message: "Utilisateur non trouvé." }).code(404);
    }

    // Supprimer l'utilisateur de la base de données
    await user.remove();

    // Répondre avec succès
    return h
      .response({ message: "Utilisateur supprimé avec succès." })
      .code(200);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    return h
      .response({
        error:
          "Une erreur est survenue lors de la suppression de l'utilisateur.",
      })
      .code(500);
  }
};
