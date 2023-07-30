import { User } from "../../models/user/userModel.js";

export default async (request, h) => {
  const { language, location, profession, skills, pseudo } = request.query;

  try {
    let users = User.find();

    // Filtrer par langue
    if (language) {
      users = users.where("language").equals(language);
    }

    // Filtrer par localisation
    if (location) {
      users = users.where("location").equals(location);
    }

    // Filtrer par profession
    if (profession) {
      users = users.where("profession").equals(profession);
    }

    // Filtrer par compétences
    if (skills) {
      users = users.where("skills").equals(skills);
    }

    // Filtrer par pseudo
    if (pseudo) {
      users = users.where("pseudo").equals(pseudo);
    }

    // Exécuter la requête et récupérer les résultats
    const filteredUsers = await users.exec();

    return h.response(filteredUsers).code(200);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    return h
      .response({
        error:
          "Une erreur est survenue lors de la récupération des utilisateurs.",
      })
      .code(500);
  }
};
