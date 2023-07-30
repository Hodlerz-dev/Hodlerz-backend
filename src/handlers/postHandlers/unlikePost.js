import { Post } from "../../models/user/userModel.js";

export const unlikePost = async (request, h) => {
  const { postId, userId } = request.payload;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    return h.response(post).code(200);
  } catch (error) {
    console.error("Error unliking post:", error);
    return h
      .response({ error: "An error occurred while unliking the post." })
      .code(500);
  }
};
