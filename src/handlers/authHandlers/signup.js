import { User } from "../../models/user/userModel.js";
import bcrypt from "bcrypt";

export default async (request, h) => {
  const { pseudo, email, password } = request.payload;

  try {
    // Vérifier si l'utilisateur existe déjà dans la base de données
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return h
        .response({
          error: "Cet e-mail est déjà utilisé par un autre utilisateur.",
        })
        .code(409);
    }

    // Hasher le mot de passe avant de l'enregistrer dans la base de données
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = new User({
      pseudo,
      email,
      password: hashedPassword,
    });

    // Enregistrer l'utilisateur dans la base de données
    await newUser.save();

    // Répondre avec succès
    return h.response({ message: "Inscription réussie." }).code(201);
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return h
      .response({
        error: "Une erreur est survenue lors de l'inscription.",
      })
      .code(500);
  }
};
