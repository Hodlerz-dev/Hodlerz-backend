import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../models/user/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export default async (request, h) => {
  try {
    const { email, password } = request.payload;

    const user = await User.findOne({ email });
    if (!user) {
      return h.response({ message: "Utilisateur non trouvé." }).code(404);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return h.response({ message: "Mot de passe incorrect." }).code(401);
    }

    try {
      const token = JWT.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "1h",
        }
      );

      return h.response({ token }).code(200);
    } catch (error) {
      return h.response({ error: "JWT token generation error" }).code(500);
    }
  } catch (error) {
    return h.response({ error }).code(500);
  }
};
