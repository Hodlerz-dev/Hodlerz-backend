import { Post } from "../../models/user/userModel.js";

// Delete

export default async (request, h) => {
  const { postId } = request.params;

  try {
    // Vérifier si le post existe dans la base de données
    const post = await Post.findById(postId);
    if (!post) {
      return h.response({ message: "Post non trouvé." }).code(404);
    }

    // Supprimer le post de la base de données
    await post.remove();

    // Répondre avec succès
    return h.response({ message: "Post supprimé avec succès." }).code(200);
  } catch (error) {
    console.error("Erreur lors de la suppression du post :", error);
    return h
      .response({
        error: "Une erreur est survenue lors de la suppression du post.",
      })
      .code(500);
  }
};
