import { Post } from "../../models/post/postModel.js";

// GET

export default async (request, h) => {
  const { postId } = request.params;

  try {
    // Rechercher le post dans la base de données par son identifiant
    const post = await Post.findById(postId).populate("userId", "pseudo"); // Utilisez la méthode `populate` pour inclure les détails de l'utilisateur qui a créé le post (par exemple, le pseudo)

    if (!post) {
      return h.response({ message: "Post non trouvé." }).code(404);
    }

    // Répondre avec les détails du post
    return h.response({ post }).code(200);
  } catch (error) {
    console.error("Erreur lors de la lecture du post :", error);
    return h
      .response({
        error: "Une erreur est survenue lors de la lecture du post.",
      })
      .code(500);
  }
};
