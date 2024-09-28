import sqlite3 from "sqlite3";
import { ChatUserTypeEnum } from "../typings/enums";
import { ChatInfoModel } from "../typings/chatTypings";

import { v4 as uuidv4 } from "uuid";

const intialiseChats = (db: sqlite3.Database) => {
  // Insert mock chats
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

  chats.forEach((chat) => {
    db.run(
      "INSERT INTO chats (chatId, userId, personaId, chatName, messages, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        chat.chatId,
        chat.userId,
        chat.personaId,
        chat.chatName,
        JSON.stringify(chat.messages),
        chat.createdAt,
        chat.updatedAt,
      ],
      (err: { message: any }) => {
        if (err) {
          console.error("Error inserting mock chat", err.message);
        }
      }
    );
  });
};

export default intialiseChats;
