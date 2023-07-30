import { Channel } from "../../models/channel/channelModel.js";
import { User } from "../../models/user/userModel.js";

export default (socket, io) => {
  socket.on("message", async ({ channelId, content }) => {
    try {
      const userId = socket.decoded.user._id;

      const user = await User.findById(userId);

      const channel = await Channel.findById(channelId);
      if (!channel) {
        console.log("Channel not found. Channel ID:", channelId);
        socket.emit("error", "Channel not found.");
        return;
      }

      if (!channel.participants.includes(userId)) {
        socket.emit(
          "error",
          "You are not allowed to add a message to this channel."
        );
        return;
      }

      const newMessage = {
        sender: user.username,
        content,
        createdAt: new Date(),
      };

      channel.messages.push(newMessage);
      await channel.save();

      // Send the new message to all users in the channel
      // socket.to(channelId).emit("newMessage", newMessage);

      io.in(channelId).emit("newMessage", newMessage);
    } catch (error) {
      console.error("Error while adding message to channel:", error);
      socket.emit(
        "error",
        "An error occurred while adding the message to the channel."
      );
    }
  });

  socket.on("deleteMessage", async ({ messageId, channelId }) => {
    try {
      const userId = socket.decoded.userId;

      const channel = await Channel.findById(channelId);
      if (!channel) {
        console.log("Channel not found. Channel ID:", channelId);
        socket.emit("error", "Channel not found.");
        return;
      }

      const messageIndex = channel.messages.findIndex(
        (message) => message._id === messageId
      );

      if (messageIndex < 0) {
        console.log("Message not found. Message ID:", messageId);
        socket.emit("error", "Message not found.");
        return;
      }

      // Ensure the user is the sender of the message
      if (channel.messages[messageIndex].sender !== userId) {
        console.log(
          "User not authorized to delete this message. User ID:",
          userId
        );
        socket.emit("error", "You are not allowed to delete this message.");
        return;
      }

      // Remove the message
      channel.messages.splice(messageIndex, 1);
      await channel.save();

      // Notify all users in the channel that the message has been deleted
      io.in(channelId).emit("messageDeleted", messageId);
    } catch (error) {
      console.error("Error while deleting message:", error);
      socket.emit("error", "An error occurred while deleting the message.");
    }
  });
};
