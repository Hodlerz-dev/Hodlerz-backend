import signup from "../../handlers/authHandlers/signup.js";
import signupValidator from "../../helpers/authValidators/signupValidator.js";
import login from "../../handlers/authHandlers/login.js";
import loginValidator from "../../helpers/authValidators/loginValidator.js";
import followBroz from "../../handlers/userHandlers/followBroz.js";
import followBrozValidator from "../../helpers/userValidators/followBrozValidator.js";
import unFollowBroz from "../../handlers/userHandlers/unFollowBroz.js";
import unFollowBrozValidator from "../../helpers/userValidators/unFollowBrozValidator.js";
import followUser from "../../handlers/userHandlers/followUser.js";
import followUserValidator from "../../helpers/userValidators/followUserValidator.js";
import unFollowUserValidator from "../../helpers/userValidators/unFollowUserValidator.js";
import unFollowUser from "../../handlers/userHandlers/unFollowUser.js";

const userRoutes = [
  {
    method: "POST",
    path: "/auth/signup",
    handler: signup,
    options: {
      auth: false,
      validate: {
        payload: signupValidator,
      },
    },
  },
  {
    method: "POST",
    path: "/auth/login",
    handler: login,
    options: {
      auth: false,
      validate: {
        payload: loginValidator,
      },
    },
  },
  {
    method: "POST",
    path: "/user/followBroz/{brozIdToFollow}",
    handler: followBroz,
    options: {
      auth: "jwt",
      validate: {
        params: followBrozValidator,
      },
    },
  },
  {
    method: "PUT",
    path: "/user/unFollowBroz/{brozIdToUnfollow}",
    handler: unFollowBroz,
    options: {
      auth: "jwt",
      validate: {
        params: unFollowBrozValidator,
      },
    },
  },
  {
    method: "POST",
    path: "/user/follow/{userIdToFollow}",
    handler: followUser,
    options: {
      auth: "jwt",
      validate: {
        params: followUserValidator,
      },
    },
  },
  {
    method: "PUT",
    path: "/user/unFollow/{userIdToUnFollow}",
    handler: unFollowUser,
    options: {
      auth: "jwt",
      validate: {
        params: unFollowUserValidator,
      },
    },
  },
  // {
  //   method: "PUT",
  //   path: "/{id}",
  //   handler: updateUser,
  //   options: {
  //     validate: {
  //       payload: updateUserValidator,
  //     },
  //   },
  // },
];

export default userRoutes;
