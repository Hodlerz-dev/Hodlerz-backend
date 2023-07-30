import HapiAuthJWT from "hapi-auth-jwt2";
import { User } from "../models/user/userModel.js";
import JWT from "jsonwebtoken";

const validate = async (decoded, request, h) => {
  const user = await User.findOne({ _id: decoded.userId });

  console.log(user);

  if (!user) {
    return { isValid: false };
  } else {
    return { isValid: true, credentials: { userId: user._id } };
  }
};

export default async (server) => {
  await server.register(HapiAuthJWT);

  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: { algorithms: ["HS256"] },
  });

  server.auth.default("jwt");
};
