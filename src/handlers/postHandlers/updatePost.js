import { Post } from "../../models/user/userModel.js";

// PUT

export default async (request, h) => {
  const { postId, content } = request.payload;

  try {
    // Vérifier si le post existe dans la base de données
    const post = await Post.findById(postId);
    if (!post) {
      return h.response({ message: "Post non trouvé." }).code(404);
    }

    // Mettre à jour le contenu du post
    post.content = content;
    post.updatedAt = new Date();

    // Enregistrer les modifications dans la base de données
    await post.save();

    // Répondre avec succès et renvoyer les détails du post mis à jour
    return h
      .response({ message: "Post mis à jour avec succès.", post })
      .code(200);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post :", error);
    return h
      .response({
        error: "Une erreur est survenue lors de la mise à jour du post.",
      })
      .code(500);
  }
};
