const expressAsyncHandler = require('express-async-handler');
const messageCollection = require('../models/message.models');
const conversationCollection = require('../models/conversation.models');
const ApiResponse = require('../utils/ApiResponse.utils');

// ✅ send message
const sendMessage = expressAsyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.id;
  const { message } = req.body;

  let gotConversation = await conversationCollection.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!gotConversation) {
    gotConversation = await conversationCollection.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = await messageCollection.create({
    senderId,
    receiverId,
    message,
  });

  if (newMessage) {
    gotConversation.messages.push(newMessage);
  }
  
  await Promise.allSettled([gotConversation.save(),newMessage.save()]);

  // ✅ Access io and socket map
  const io = req.app.get('io');
  const userSocketMap = req.app.get('userSocketMap');

  //It will return the SocketId from the userSocketMap Object
  const receiverSocketId = userSocketMap[receiverId];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  new ApiResponse(201, true, newMessage, gotConversation).send(res);
});

// ✅ get messages
const getMessage = expressAsyncHandler(async (req, res, next) => {
  let senderId = req.user._id;
  let receiverId = req.params.id;

  const conversation = await conversationCollection
    .findOne({
      participants: { $all: [senderId, receiverId] },
    })
    .populate('messages');

  new ApiResponse(
    200,
    true,
    'All conversation fetched successfully',
    conversation
  ).send(res);
});

module.exports = {
  sendMessage,
  getMessage,
};
