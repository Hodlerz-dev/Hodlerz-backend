import { Post } from "../../models/user/userModel.js";

export const commentPost = async (request, h) => {
  const { postId, userId, comment } = request.payload;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { userId, comment } } },
      { new: true }
    );
    return h.response(post).code(200);
  } catch (error) {
    console.error("Error commenting on post:", error);
    return h
      .response({ error: "An error occurred while commenting on the post." })
      .code(500);
  }
};
