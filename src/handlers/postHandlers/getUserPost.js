import { Post } from "../../models/user/userModel.js";

export const getUserPosts = async (request, h) => {
  const { userId } = request.params;
  try {
    const posts = await Post.find({ userId });
    return h.response(posts).code(200);
  } catch (error) {
    console.error("Error retrieving user posts:", error);
    return h
      .response({ error: "An error occurred while retrieving user posts." })
      .code(500);
  }
};
