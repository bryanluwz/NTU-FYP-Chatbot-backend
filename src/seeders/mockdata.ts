import { PersonaModel } from "../typings/dashboardTypings";
import { v4 as uuidv4 } from "uuid";
import { UserRoleEnum } from "../typings/enums";

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
  {
    personaId: "9",
    personaName: "AK47 - Chatbot Warfare",
    personaDescription: "NTU is warzone, chatbot is comrade, AK47 is weapon",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 926117610000,
    updatedAt: 1726117610000,
  },
  {
    personaId: "10",
    personaName: "SG59 - Chatbot Singlish",
    personaDescription: "Wah lao eh, chatbot also can speak Singlish",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 826117610000,
    updatedAt: 1726117610000,
  },
  {
    personaId: "11",
    personaName: "SC9999 - Chatbot Quantum Computing",
    personaDescription:
      "This is a course chatbot for SC9999, created by the quantum physicist Richard Feynman",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 726117610000,
    updatedAt: 1726117610000,
  },
  {
    personaId: "12",
    personaName: "CCP101 - Ching Chong Chatbot",
    personaDescription: "早上好中国，现在我有冰淇淋。",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 626117610000,
    updatedAt: 1726117610000,
  },
  {
    personaId: "13",
    personaName: "JAP101 - アニメチャットボット",
    personaDescription: "人間は欲深い生き物",
    personaAvatar: "https://via.placeholder.com/150",
    createdAt: 526117610000,
    updatedAt: 1726117610000,
  },
];

// Fake users, admin, educators, and students (users)
// 2 Admins, 4 Educators, 7 Students
export const usersMockData = [
  // Admins
  {
    id: uuidv4(),
    username: "Pompompurin",
    email: "admin1@nut.edu.sg",
    avatar: "src/assets/user-avatar-default.png",
    role: UserRoleEnum.Admin,
    password: "pompom",
  },
  {
    id: uuidv4(),
    username: "Keroppi",
    email: "admin2@nut.edu.sg",
    avatar: "src/assets/user-avatar-default.png",
    role: UserRoleEnum.Admin,
    password: "kerokero",
  },
  // Educators
  {
    id: uuidv4(),
    username: "Kuromi-sensei",
    email: "educator1@nut.edu.sg",
    avatar: "src/assets/user-avatar-default.png",
    role: UserRoleEnum.Educator,
    password: "kuromimi",
  },
  {
    id: uuidv4(),
    username: "Badtz-sensei",
    email: "educator2@nut.edu.sg",
    avatar: "src/assets/user-avatar-default.png",
    role: UserRoleEnum.Educator,
    password: "badtzPenguin",
  },
  {
    id: uuidv4(),
    username: "My Melody-sensei",
    email: "educator3@nut.edu.sg",
    avatar: "src/assets/user-avatar-default.png",
    role: UserRoleEnum.Educator,
    password: "melonpan",
  },
  {
    id: uuidv4(),
    username: "Pochacco-sensei",
    email: "educator4@nut.edu.sg",
    avatar: "src/assets/user-avatar-default.png",
    role: UserRoleEnum.Educator,
    password: "pocharin",
  },
  // Students
  {
    id: uuidv4(),
    username: "Jason",
    email: "student001@nut.edu.sg",
    avatar: "",
    role: UserRoleEnum.User,
    password: "gayson",
  },
  {
    id: uuidv4(),
    username: "Eren",
    email: "student002@nut.edu.sg",
    avatar: "",
    role: UserRoleEnum.User,
    password: "tatakae",
  },
  {
    id: uuidv4(),
    username: "金正恩",
    email: "student003@nut.edu.sg",
    avatar: "",
    role: UserRoleEnum.User,
    password: "iloveamerica",
  },
  {
    id: uuidv4(),
    username: "LeBron James",
    email: "student004@nut.edu.sg",
    avatar: "",
    role: UserRoleEnum.User,
    password: "lebronjaames",
  },
  {
    id: uuidv4(),
    username: "Donald Trump",
    email: "student005@nut.edu.sg",
    avatar: "",
    role: UserRoleEnum.User,
    password: "obamna",
  },
  {
    id: uuidv4(),
    username: "糸瀬 雪",
    email: "student006@nut.edu.sg",
    avatar: "",
    role: UserRoleEnum.User,
    password: "daddyitsuomi",
  },
  {
    id: uuidv4(),
    username: "Anwar Ibrahim",
    email: "student007@nut.edu.sg",
    avatar: "",
    role: UserRoleEnum.User,
    password: "pwsvoteforme",
  },
];
