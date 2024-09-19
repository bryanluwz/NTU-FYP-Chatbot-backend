import {
  ChatListModel,
  GetChatInfoResponseModel,
  GetChatListResponseModel,
  PostQueryMessageResponseModel,
} from "../typings/chatTypings";
import { UserTypeEnum } from "../typings/enums";

const DefaultUserAvatar = "/assets/user-avatar-default.png";

export const postQueryMessageMockData =
  async (): Promise<PostQueryMessageResponseModel> => {
    const fakeResponseList = [
      "I'm sorry, I don't understand.",
      "If only I could understand you.",
      "明月几时有，把酒问青天。不知天上宫阙，今夕是何年。我欲乘风过去，惟恐琼楼玉宇。高处不胜寒，起舞弄清影，何似在人间。",
      "对不起，我不明白。",
      "申し訳ございません、英語は全然わかりません。",
      "これは超長いの返事みたいね、ここで私と一緒に待ってね？いやなの？( ,,`･ω･´)ﾝﾝﾝ？",
      `Somebody once told me the world is gonna roll me,
I ain't the sharpest tool in the shed,
She was looking kind of dumb with her finger and her thumb,
In the shape of an "L" on her forehead`,
    ];

    const responseMessage =
      fakeResponseList[Math.floor(Math.random() * fakeResponseList.length)];
    return {
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        message: responseMessage,
      },
    };
  };

export const getChatListMockData: GetChatListResponseModel = {
  status: {
    code: 200,
    message: "OK",
  },
  data: {
    chatList: [
      {
        chatId: "1",
        chatName: "Chat 1",
      },
      {
        chatId: "2",
        chatName: "Chat 2",
      },
      {
        chatId: "3",
        chatName: "Chat 3",
      },
      {
        chatId: "4",
        chatName: "Chat 4",
      },
      {
        chatId: "5",
        chatName: "Chat 5",
      },
      {
        chatId: "6",
        chatName: "Chat 6",
      },
      {
        chatId: "7",
        chatName: "Chat 7",
      },
      {
        chatId: "8",
        chatName: "Chat 8",
      },
      {
        chatId: "9",
        chatName: "Chat 9",
      },
      {
        chatId: "10",
        chatName: "Chat 10",
      },
      {
        chatId: "11",
        chatName: "Chat 11",
      },
      {
        chatId: "12",
        chatName: "Chat 12",
      },
      {
        chatId: "13",
        chatName: "Chat 13",
      },
      {
        chatId: "14",
        chatName: "Chat 14",
      },
      {
        chatId: "15",
        chatName: "Chat 15",
      },
      {
        chatId: "16",
        chatName: "Chat 16",
      },
      {
        chatId: "17",
        chatName: "Chat 17",
      },
      {
        chatId: "18",
        chatName: "Chat 18",
      },
      {
        chatId: "19",
        chatName: "Chat 19",
      },
      {
        chatId: "20",
        chatName: "Chat 20",
      },
    ],
  },
};

export const getChatInfoMockData = async (
  chatId: string
): Promise<GetChatInfoResponseModel> => {
  const fakeResponseList = [
    [
      {
        messageId: "1",
        userType: UserTypeEnum.User,
        message: "Hello",
      },
      {
        messageId: "2",
        userType: UserTypeEnum.AI,
        message: "Hi",
      },
    ],
    [
      {
        messageId: "1",
        userType: UserTypeEnum.User,
        message: "你好",
      },
      {
        messageId: "2",
        userType: UserTypeEnum.AI,
        message: "你好",
      },
    ],
    [
      {
        messageId: "1",
        userType: UserTypeEnum.User,
        message: "こんにちは",
      },
      {
        messageId: "2",
        userType: UserTypeEnum.AI,
        message: "こんにちは",
      },
    ],
  ];

  const messages =
    fakeResponseList[(parseInt(chatId) - 1) % fakeResponseList.length];

  return {
    status: {
      code: 200,
      message: "OK",
    },
    data: {
      chatInfo: {
        chatId,
        chatName: `Chat ${chatId}`,
        messages,
      },
    },
  };
};

// Why isn' the user avatar being sent properly?
export const getUserInfoMockData = {
  status: {
    code: 200,
    message: "OK",
  },
  data: {
    userInfo: {
      username: "Gorlock the Destroyer",
      email: "gorlock.destroyer@e.nut.edu.sg",
      avatar: DefaultUserAvatar,
    },
  },
};
