import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Référence à l'utilisateur qui a créé le post
    content: { type: String, required: true }, // Contenu du post
    picture: { type: String },
    video: { type: String },
    likers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Liste des utilisateurs qui ont aimé le post
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Référence à l'utilisateur qui a commenté
        content: { type: String, required: true }, // Contenu du commentaire
      },
    ],
  },
  { timestamps: true } // Ajoute automatiquement les champs createdAt et updatedAt
);

const Post = mongoose.model("Post", postSchema);

export default Post;
