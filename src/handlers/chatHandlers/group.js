import { Group } from "../../models/group/groupModel.js";

export default (socket, io) => {
  socket.on("message", async ({ groupId, channelId, content }) => {
    try {
      const userId = socket.decoded.user._id;

      // Vérifier si l'utilisateur est membre du groupe
      const group = await Group.findOne({
        _id: groupId,
        members: userId,
      });

      if (!group) {
        console.log("Group not found or user not a member. Group ID:", groupId);
        socket.emit(
          "error",
          "Group not found or you are not a member of this group."
        );
        return;
      }

      // Vérifier si le canal est dans le groupe
      const channel = group.channels.id(channelId);
      if (!channel) {
        console.log("Channel not found in group. Channel ID:", channelId);
        socket.emit("error", "Channel not found in group.");
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
        sender: userId,
        content,
        createdAt: new Date(),
      };

      channel.messages.push(newMessage);
      await group.save();

      // Send the new message to all users in the channel
      socket.to(channelId).emit("newMessage", newMessage);
    } catch (error) {
      console.error("Error while adding message to channel:", error);
      socket.emit(
        "error",
        "An error occurred while adding the message to the channel."
      );
    }
  });

  socket.on("joinGroup", async ({ groupId }) => {
    try {
      const userId = socket.decoded.userId;

      // Vérifier si le groupe existe
      const group = await Group.findById(groupId);
      if (!group) {
        console.log("Group not found. Group ID:", groupId);
        socket.emit("error", "Group not found.");
        return;
      }

      // Vérifier si l'utilisateur a la permission de rejoindre ce groupe ( a ajouter + tard )
      // if (group.private && !group.invitedUsers.includes(userId)) {
      //   socket.emit("error", "You do not have permission to join this group.");
      //   return;
      // }

      const user = connectedUsers.find((user) => user.socketId === socket.id);
      if (user) {
        user.groups.push(groupId);
      }

      // Ajouter l'utilisateur à la liste des membres du groupe s'il n'est pas déjà un membre
      if (!group.members.includes(userId)) {
        group.members.push(userId);
        await group.save();

        // Émettre un événement userJoined avec les détails de l'utilisateur et du groupe
        io.emit("userJoined", { userId, group });
      }
    } catch (error) {
      console.error("Error while joining group:", error);
      socket.emit("error", "An error occurred while joining the group.");
    }
  });

  socket.on("leaveGroup", async ({ groupId }) => {
    try {
      const userId = socket.decoded.userId;

      // Vérifier si l'utilisateur est membre du groupe
      const group = await Group.findOne({
        _id: groupId,
        members: userId,
      });

      if (group) {
        // Supprimer l'utilisateur de la liste des membres
        group.members.pull(userId);
        await group.save();

        // Émettre un événement userLeft avec les détails de l'utilisateur et du groupe
        io.emit("userLeft", { userId, group });
      } else {
        console.log(
          "User is not a member of the group or group not found. Group ID:",
          groupId
        );
        socket.emit(
          "error",
          "You are not a member of the group or group not found."
        );
      }
    } catch (error) {
      console.error("Error while leaving group:", error);
      socket.emit("error", "An error occurred while leaving the group.");
    }
  });

  socket.on("joinChannel", async ({ groupId, channelId }) => {
    try {
      const userId = socket.decoded.userId;

      // Vérifier si le groupe et le canal existent
      const group = await Group.findOne({
        _id: groupId,
        "channels._id": channelId,
      });

      const user = connectedUsers.find((user) => user.socketId === socket.id);
      if (user) {
        user.channels.push(channelId);
      }

      if (!group) {
        console.log(
          "Group or channel not found. Group ID:",
          groupId,
          "Channel ID:",
          channelId
        );
        socket.emit("error", "Group or channel not found.");
        return;
      }

      // Vérifier si l'utilisateur est membre du groupe
      if (!group.members.includes(userId)) {
        console.log("User is not a member of the group. User ID:", userId);
        socket.emit("error", "You are not a member of the group.");
        return;
      }

      // Trouver le canal dans le groupe
      const channel = group.channels.id(channelId);

      // Faire joindre le socket à la "room" correspondante au canal
      socket.join(channelId);

      // Ajouter l'utilisateur à la liste des participants du canal s'il n'est pas déjà un participant
      if (!channel.participants.includes(userId)) {
        channel.participants.push(userId);
        await group.save();

        // Émettre un événement userJoinedChannel avec les détails de l'utilisateur, du canal et du groupe
        io.emit("userJoinedChannel", { userId, channel, group });
      }
    } catch (error) {
      console.error("Error while joining channel:", error);
      socket.emit("error", "An error occurred while joining the channel.");
    }
  });

  socket.on("leaveChannel", async ({ groupId, channelId }) => {
    try {
      const userId = socket.decoded.userId;

      // Vérifier si le groupe et le canal existent et si l'utilisateur est membre du groupe
      const group = await Group.findOne({
        _id: groupId,
        "channels._id": channelId,
        members: userId,
      });

      if (!group) {
        console.log(
          "Group, channel, or user not found. Group ID:",
          groupId,
          "Channel ID:",
          channelId,
          "User ID:",
          userId
        );
        socket.emit("error", "Group, channel, or user not found.");
        return;
      }

      // Trouver le canal dans le groupe
      const channel = group.channels.id(channelId);

      // Supprimer l'utilisateur de la liste des participants
      channel.participants.pull(userId);
      await group.save();

      // Émettre un événement userLeftChannel avec les détails de l'utilisateur, du canal et du groupe
      io.emit("userLeftChannel", { userId, channel, group });
    } catch (error) {
      console.error("Error while leaving channel:", error);
      socket.emit("error", "An error occurred while leaving the channel.");
    }
  });
};
