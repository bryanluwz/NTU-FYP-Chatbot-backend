import { Request, Response } from "express";
import { Chat, Persona, User } from "../models";
import { HTTPResponseEmptyWrapper, HTTPResponseErrorWrapper } from "../typings";
import {
  GetPersonaResponseModel,
  PersonaModel,
} from "../typings/dashboardTypings";
import { UserRoleEnum } from "../typings/enums";
import path from "path";
import fs from "fs";

import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { transferDocumentSrcApi } from "../apis";

// Define the absolute path for the uploads directory
const uploadDirectory = path.resolve(
  process.cwd(),
  process.env.UPLOADS_STORAGE || "uploads"
);

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Configure storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize multer with storage options
const upload = multer({ storage });

// Middleware to handle multiple file uploads
export const uploadPersonaMiddleware = upload.fields([
  { name: "personaAvatar", maxCount: 1 },
  { name: "documentSrc", maxCount: 1 },
]);

// Set up multer for file handling
const databaseAvatarStoragePath = path.resolve(
  process.cwd(),
  process.env.AVATARS_STORAGE || "avatars"
);

const databaseDocumentsStoragePath = path.resolve(
  process.cwd(),
  process.env.DOCUMENTS_STORAGE || "documents"
);

export const getPersonaList = async (
  req: Request,
  res: Response<GetPersonaResponseModel | HTTPResponseErrorWrapper>
) => {
  try {
    const personas = (await Persona.findAll()) as PersonaModel[];

    const formattedPersonas = personas.map((persona: any) => {
      const _persona = persona.toJSON();
      return {
        ..._persona,
        personaAvatar: `/avatars/${_persona.personaAvatar}`,
      };
    }) as PersonaModel[];

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        personas: formattedPersonas,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to retrieve chats" });
  }
};

export const postPersonaList = async (
  req: Request,
  res: Response<GetPersonaResponseModel | HTTPResponseErrorWrapper>
) => {
  // get user id from request
  const userId = req.userId;

  // If admin, return all, if educator, return only their personas, if user, don't return anything
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  try {
    let personas: PersonaModel[] = [];

    // Check if user is an admin, if yes return all
    if (user.role === UserRoleEnum.Admin) {
      personas = (await Persona.findAll()) as PersonaModel[];
    } else if (user.role === UserRoleEnum.Educator) {
      personas = (await Persona.findAll({
        where: {
          userId: userId,
        },
      })) as PersonaModel[];
    }

    const formattedPersonas = personas.map((persona: any) => {
      const _persona = persona.toJSON();
      return {
        ..._persona,
        personaAvatar: `/avatars/${_persona.personaAvatar}`,
      };
    }) as PersonaModel[];

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        personas: formattedPersonas,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to create persona" });
  }
};

export const createPersona = async (
  req: Request,
  res: Response<GetPersonaResponseModel | HTTPResponseErrorWrapper>
) => {
  try {
    const userId = req.userId;
    const { personaName, personaDescription } = req.body;

    const persona = await Persona.create({
      personaName,
      personaDescription,
      userId: userId,
    });

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        personas: [persona],
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to create persona" });
  }
};

export const updatePersona = async (
  req: Request,
  res: Response<HTTPResponseEmptyWrapper | HTTPResponseErrorWrapper>
) => {
  // The userId is the admin's or requester's userId
  const userId = req.userId;

  // Extract personaId from request params and the data to be updated from request body
  const personaInfo = JSON.parse(req.body.personaInfo) as PersonaModel;
  const { personaId, personaDescription, personaName } = personaInfo;

  const avatarFile = (req.files as any)?.personaAvatar?.[0];
  const documentFile = (req.files as any)?.documentSrc?.[0];

  const _avatarBuffer = avatarFile?.path
    ? fs.readFileSync(avatarFile.path)
    : null;
  const _documentBuffer = documentFile?.path
    ? fs.readFileSync(documentFile.path)
    : null;

  const avatar = _avatarBuffer
    ? { buffer: _avatarBuffer, ...avatarFile }
    : null;
  const documentSrc = _documentBuffer
    ? { buffer: _documentBuffer, ...documentFile }
    : null;

  try {
    // Find the persona to update
    const persona = await Persona.findByPk(personaId);

    // If persona does not exist, return 404
    if (!persona) {
      return res.status(404).json({ error: "Persona not found" });
    }

    // Check if the user is the owner of the persona or an admin
    if (persona.userId !== userId) {
      const user = await User.findByPk(userId);
      if (!user || user.role !== UserRoleEnum.Admin) {
        return res.status(403).json({ error: "Unauthorized" });
      }
    }

    if (avatar) {
      // Generate a unique filename for the avatar

      const avatarFilename = `avatar_${uuidv4()}${path.extname(
        avatar.originalname
      )}`;
      const newAvatarPath = path.join(
        databaseAvatarStoragePath,
        avatarFilename
      ); // Adjust path as needed

      // Remove original avatar file
      if (persona.personaAvatar) {
        const avatarPath = path.join(
          databaseAvatarStoragePath,
          persona.personaAvatar
        );
        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
        }
      }

      // Upload avatar: save the file locally to the 'avatars' folder
      fs.writeFileSync(newAvatarPath, avatar.buffer);

      // Save the path (or URL if hosted) to userInfo
      persona.personaAvatar = `${avatarFilename}`; // Adjust path for how you'll serve the file

      // Remove from uploads
      if (fs.existsSync(avatarFile.path)) {
        fs.unlinkSync(avatarFile.path);
      }
    }

    if (documentSrc) {
      // Generate a unique filename for the documentSrc
      const documentSrcFilename = `documentSrc_${uuidv4()}${path.extname(
        documentSrc.originalname
      )}`;
      const documentSrcPath = path.join(
        databaseDocumentsStoragePath,
        documentSrcFilename
      ); // Adjust path as needed

      // Remove original documentSrc file
      if (persona.documentSrc) {
        const originalPath = path.join(
          databaseDocumentsStoragePath,
          persona.documentSrc
        );
        if (fs.existsSync(originalPath)) {
          fs.unlinkSync(originalPath);
        }
      }

      // Upload documentSrc: save the file locally to the 'documents' folder
      fs.writeFileSync(documentSrcPath, documentSrc.buffer);

      // Save the path (or URL if hosted) to userInfo
      persona.documentSrc = `${documentSrcFilename}`; // Adjust path for how you'll serve the file

      // Remove from uploads
      if (fs.existsSync(documentFile.path)) {
        fs.unlinkSync(documentFile.path);
      }

      // Call the API to update the documentSrc
      const _response = await transferDocumentSrcApi({
        personaId: personaId,
        documentSrcPath: documentSrcPath,
      });
    }

    // Update the persona's name and description if provided
    if (personaName) {
      persona.personaName = personaName;
    }
    if (personaDescription) {
      persona.personaDescription = personaDescription;
    }

    // Save the updated persona information to the database
    await persona.save();

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {},
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to update persona" });
  }
};

export const deletePersona = async (
  req: Request,
  res: Response<GetPersonaResponseModel | HTTPResponseErrorWrapper>
) => {
  try {
    const userId = req.userId;
    const { personaId } = req.body;

    const persona = await Persona.findByPk(personaId);
    if (!persona) {
      return res.status(404).json({ error: "Persona not found" });
    }

    if (persona.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await persona.destroy();

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        personas: [persona],
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to delete persona" });
  }
};

export const getPersona = async (req: Request, res: Response) => {
  try {
    // Extract the personaId from the request params
    const { id: chatId } = req.params;
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const personaId = chat?.personaId;

    const persona = (await Persona.findByPk(personaId)) as PersonaModel;

    if (!persona) {
      return res.status(404).json({ error: "Persona not found" });
    }

    const avatarPath = path.join(
      "/avatars",
      persona.personaAvatar ?? "default"
    );

    return res.json({
      status: {
        code: 200,
        message: "OK",
      },
      data: {
        personas: [{ ...persona, personaAvatar: avatarPath }],
      },
    });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to retrieve persona avatar" });
  }
};
