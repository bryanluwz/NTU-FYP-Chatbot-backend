import {
  ChatListModel,
  GetChatInfoResponseModel,
  GetChatListResponseModel,
  PostQueryMessageResponseModel,
} from "../typings/chatTypings";
import {
  GetPersonaResponseModel,
  PersonaModel,
} from "../typings/dashboardTypings";
import { UserTypeEnum } from "../typings/enums";

export const getMockResponseMessage = () => {
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

  return responseMessage;
};

// Dashboard
export const personasMockData: PersonaModel[] = [
  {
    personaId: "1",
    personaName: "SC1234 - Chatbot Structures and Algorithms",
    personaDescription:
      "This is a course chatbot for SC1234, created by Gorlock the Destroyer",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 1726117610000,
    updatedAt: 1726117610000,
  },
  {
    personaId: "2",
    personaName: "SC6969 - Chatbot Design Patterns",
    personaDescription:
      "This is a course chatbot for SC6969, haha funny number",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 1626117610000,
    updatedAt: 1726117610000,
  },
  {
    personaId: "3",
    personaName: "SC420 - Chatbot Development",
    personaDescription:
      "This is a course chatbot for SC420, created by the legendary Snoop Dogg",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 1526117610000,
    updatedAt: 1726117610000,
  },
  {
    personaId: "4",
    personaName: "SC1337 - Chatbot Security",
    personaDescription:
      "This is a course chatbot for SC1337, created by the infamous 4chan hacker",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 1426117610000,
    updatedAt: 1726117610000,
  },
  {
    personaId: "5",
    personaName: "SC80085 - Chatbot Machine Learning",
    personaDescription:
      "This is a course chatbot for SC80085, created by the one and only Elon Musk",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 1326117610000,
    updatedAt: 1726117610000,
  },
  {
    personaId: "6",
    personaName: "SC9001 - Chatbot Artificial Intelligence",
    personaDescription:
      "This is a course chatbot for SC9001, created by the AI overlord Skynet",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 1226117610000,
    updatedAt: 1726117610000,
  },
  {
    personaId: "7",
    personaName: "SC1111 - Chatbot Ethics",
    personaDescription:
      "This is a course chatbot for SC1111, created by the ethical hacker 4chan",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 1126117610000,
    updatedAt: 1726117610000,
  },
  {
    personaId: "8",
    personaName: "SC0000 - Chatbot Introduction",
    personaDescription:
      "This is a course chatbot for SC0000, created by the mysterious hacker 4chan",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 1026117610000,
    updatedAt: 1726117610000,
  },
];
