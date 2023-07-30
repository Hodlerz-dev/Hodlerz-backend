import { Post } from "../../models/user/userModel.js";

export const getAllPosts = async (request, h) => {
  try {
    const posts = await Post.find();
    return h.response(posts).code(200);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    return h
      .response({ error: "An error occurred while retrieving posts." })
      .code(500);
  }
};
