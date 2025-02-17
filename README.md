# NTU FYP Chatbot Backend

This repository contains the backend implementation for the NTU Final Year Project (FYP) Chatbot. The backend is built using Express (TypeScript) for handling API requests from the frontend and processing chatbot logic.

## Features

The key features of the backend include:

1. **API Endpoints**: Provides RESTful API endpoints for handling chatbot requests.

2. **Chatbot Logic**: Contains the chatbot logic for handling user queries and responses.

   - **AI-related Logic**: Forwards AI-related requests to [AI server](https://github.com/bryanluwz/NTU-FYP-Chatbot-AI) for processing.

3. **Database Integration**: Integrates with local SQLite database for storing chatbot data, such as conversations, user profiles, and chatbot profiles.

4. **User Authentication**: Supports user authentication for securing chatbot data and profiles.

   - **JSON Web Tokens (JWT)**: Uses JWT for generating and verifying tokens. This ensures that only authenticated users can access certain endpoints.

5. **Logging and Monitoring**: Logs chatbot activities and errors for monitoring and debugging purposes.

## Setup and Installation

The frontend code should already be built (see [frontend repository](https://github.com/bryanluwz/NTU-FYP-Chatbot-frontend) `dist` folder)

Minimally, only the [frontend repository](https://github.com/bryanluwz/NTU-FYP-Chatbot-frontend) `dist` folder and backend repositories are required to run the full chatbot system.

1. Clone this repository:

   ```bash
   git clone https://github.com/bryanluwz/NTU-FYP-Chatbot-backend.git
   ```

2. Install the dependencies:

   `yarn` is used for package management, but you can use `npm` or whatever if you prefer

   ```bash
   yarn install
   ```

3. Set the frontend built code path in the `.env` file:

   ```env
   # Default path
   FRONTEND_PATH=../NTU-FYP-Chatbot-frontend/dist
   ```

   This path should point to the `dist` folder in the frontend repository. If you have the frontend code in a different location, update the path accordingly.

   Don't know how? Too bad, figure it out yourself.

4. Start the development server:

   ```bash
   yarn start
   ```

   The backend server should now be running on `https://localhost:3000` or whatever port you specified in the `.env` file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

1. [ME](https://github.com/bryanluwz) for building this awesome chatbot frontend, alone, with no help from humans. 🤖
