import { Post } from "../../models/user/userModel.js";

export const likePost = async (request, h) => {
  const { postId, userId } = request.payload;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    return h.response(post).code(200);
  } catch (error) {
    console.error("Error liking post:", error);
    return h
      .response({ error: "An error occurred while liking the post." })
      .code(500);
  }
};
