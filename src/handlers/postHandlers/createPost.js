import { User, Post } from "../../models/user/userModel.js";

// Post

export default async (request, h) => {
  const { userId, content } = request.payload;

  try {
    // Vérifier si l'utilisateur existe dans la base de données
    const user = await User.findById(userId);
    if (!user) {
      return h.response({ message: "Utilisateur non trouvé." }).code(404);
    }

    // Créer un nouvel objet Post avec les données fournies
    const newPost = new Post({
      userId,
      content,
    });

    // Enregistrer le nouveau post dans la base de données
    await newPost.save();

    // Répondre avec succès et renvoyer les détails du post créé
    return h
      .response({ message: "Post créé avec succès.", post: newPost })
      .code(201);
  } catch (error) {
    console.error("Erreur lors de la création du post :", error);
    return h
      .response({
        error: "Une erreur est survenue lors de la création du post.",
      })
      .code(500);
  }
};
