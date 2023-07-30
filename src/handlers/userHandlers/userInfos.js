import { User } from "../../models/user/userModel.js";

//GET donc pas de validators

export default async (request, h) => {
  try {
    // Récupérer l'ID de l'utilisateur connecté à partir du token JWT
    const userId = request.auth.credentials.userId;

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return h.response({ message: "Utilisateur non trouvé." }).code(404);
    }

    return h.response(user).code(200);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations de l'utilisateur :",
      error
    );
    return h
      .response({
        error:
          "Une erreur est survenue lors de la récupération des informations de l'utilisateur.",
      })
      .code(500);
  }
};
