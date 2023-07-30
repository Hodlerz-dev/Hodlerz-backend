import { Post } from "../../models/user/userModel.js";

export const deleteComment = async (request, h) => {
  const { postId, commentId } = request.params;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
    return h.response(post).code(200);
  } catch (error) {
    console.error("Error deleting comment:", error);
    return h
      .response({ error: "An error occurred while deleting the comment." })
      .code(500);
  }
};
