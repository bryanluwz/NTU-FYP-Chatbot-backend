import { Chat, User, Persona } from "../models";
import { ChatUserTypeEnum } from "../typings/enums";
import { ChatInfoModel } from "../typings/chatTypings";
import { v4 as uuidv4 } from "uuid";

const initializeChats = async () => {
  try {
    // Define mock chats
    const chats: ChatInfoModel[] = [
      {
        chatId: uuidv4(),
        userId: "69420",
        personaId: "10",
        chatName: "Chat 1",
        messages: [
          { messageId: "1", userType: ChatUserTypeEnum.AI, message: "Hello!" },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        chatId: uuidv4(),
        userId: "69420",
        personaId: "11",
        chatName: "Chat 2",
        messages: [
          { messageId: "3", userType: ChatUserTypeEnum.AI, message: "nun!" },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    for (const chat of chats) {
      // Check if chat already exists
      const existingChat = await Chat.findOne({
        where: { chatId: chat.chatId },
      });
      if (existingChat) {
        console.log(
          `Chat with ID ${chat.chatId} already exists. Skipping insertion.`
        );
        continue;
      }

      // Ensure that the referenced user and persona exist
      const user = await User.findByPk(chat.userId);
      const persona = await Persona.findByPk(chat.personaId);

      if (!user) {
        console.error(
          `User with ID ${chat.userId} does not exist. Cannot create chat.`
        );
        continue;
      }

      if (!persona) {
        console.error(
          `Persona with ID ${chat.personaId} does not exist. Cannot create chat.`
        );
        continue;
      }

      // Create chat
      await Chat.create({
        chatId: chat.chatId,
        userId: chat.userId,
        personaId: chat.personaId,
        chatName: chat.chatName,
        messages: chat.messages,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
      });

      console.log(`Chat ${chat.chatName} inserted successfully.`);
    }
  } catch (error) {
    console.error("Error inserting mock chats:", error);
  }
};

export default initializeChats;
